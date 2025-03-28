/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchGoogleNewsViaBrightData } from "@/lib/brightDataClient";
import { generateNewsImage } from "@/lib/cloudfare";
import prisma from "@/lib/prisma/index.prisma";
import { CustomApiHandler } from "@/types/api";
import { ApiResponse, withApiAuthRequired } from "@/utils/api.utils";
import { Prisma } from "@prisma/client";
import { isValid } from "date-fns";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getConceAInewsHandler: CustomApiHandler = async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const latestNew = news.length > 0 ? news[0] : { updatedAt: new Date(0) };
    const currentDate = new Date();
    const newsDate = new Date(latestNew.updatedAt);

    /**
     * expire the new after 1 hour
     */
    if (
      currentDate.getTime() - newsDate.getTime() > 3600000 ||
      news.length === 0
    ) {
      const fetchedNews = await fetchGoogleNewsViaBrightData();
      const createdNews = await prisma.$transaction(async (prismaTx) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_deletedNewsBatchPayload] = await Promise.all([
          prismaTx.news.deleteMany(),
        ]);

        if (!fetchedNews) {
          throw new Error("No news found");
        }

        const createdPrismaTxNews = await prismaTx.news.createManyAndReturn({
          data: fetchedNews.map(
            (news): Prisma.NewsCreateManyInput => ({
              title: news.title,
              url: news.link,
              description: news.description,
              image: news.image || "no-image",
              publishedAt: isValid(news.publishedAt)
                ? new Date(news.publishedAt).toISOString()
                : new Date().toISOString(),
            })
          ),
        });

        return createdPrismaTxNews;
      });

      await Promise.allSettled(
        createdNews.map(async (n) => {
          const image = await generateNewsImage(n);

          if (!image) {
            return null;
          }

          return await prisma.news.update({
            where: { id: n.id },
            data: {
              image: image,
            },
          });
        })
      );

      const news = await prisma.news.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      return ApiResponse.ok(news);
    }

    if (
      news.some((n) => !n.image) ||
      news.some((n) => n.image === "no-image")
    ) {
      const newsWithoutImage = news.filter(
        (n) => !n.image || n.image === "no-image"
      );

      const updatedNews = await Promise.all(
        newsWithoutImage.map(async (n) => {
          const image = await generateNewsImage(n);

          if (!image) {
            return null;
          }

          return await prisma.news.update({
            where: { id: n.id },
            data: {
              image: image,
            },
          });
        })
      );

      if (!updatedNews) {
        throw new Error("No news found");
      }

      return ApiResponse.ok(updatedNews.filter((n) => n));
    }

    return ApiResponse.ok(news);
  } catch (err) {
    return ApiResponse.internalServerError(
      undefined,
      err,
      "[CONCE-AI-NEWS-HANDLER]"
    );
  }
};

const GET = withApiAuthRequired(getConceAInewsHandler);

export { GET };
