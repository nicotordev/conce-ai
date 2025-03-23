/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchGoogleNewsViaBrightData } from "@/lib/brightDataClient";
import { generateNewsImage } from "@/lib/cloudfare";
import prisma from "@/lib/prisma/index.prisma";
import { CustomApiHandler } from "@/types/api";
import { ApiResponse, withApiAuthRequired } from "@/utils/api.utils";
import { Prisma } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCondorAInewsHandler: CustomApiHandler = async (req, res) => {
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

        const createdNews = await prismaTx.news.createManyAndReturn({
          data: fetchedNews.map(
            (news): Prisma.NewsCreateManyInput => ({
              title: news.titulo,
              url: news.link,
              description: news.resumen,
              image: news.imagen || "no-image",
              publishedAt: new Date(),
            })
          ),
        });

        return createdNews;
      });

      await Promise.allSettled(
        createdNews.map(async (n) => {
          const image = await generateNewsImage(n);

          if (!image) {
            return null;
          }

          return prisma.news.update({
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

    return ApiResponse.ok(news);
  } catch (err) {
    return ApiResponse.internalServerError(
      undefined,
      err,
      "[CONDOR-AI-NEWS-HANDLER]"
    );
  }
};

const GET = withApiAuthRequired(getCondorAInewsHandler);

export { GET };
