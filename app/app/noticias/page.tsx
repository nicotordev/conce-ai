import NewsContainer from "@/components/App/News/NewsContainer";
import prisma from "@/lib/prisma/index.prisma";

export default async function CondorAINews() {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const ssrNews = news.map((n) => ({
    ...n,
    publishedAt: new Date(n.createdAt).toDateString(),
    createdAt: new Date(n.createdAt).toDateString(),
    updatedAt: new Date(n.updatedAt).toDateString(),
  }));

  return <NewsContainer ssrNews={ssrNews} />;
}
