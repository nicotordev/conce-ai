type AINews = {
  titulo: string;
  link: string;
  resumen: string;
  imagen: string | null;
};

type News = {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

type NewsContainerProps = {
  ssrNews: News[];
};

export type { AINews, News, NewsContainerProps };
