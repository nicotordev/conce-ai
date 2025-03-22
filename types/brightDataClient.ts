// Tipos
type BrightDataSearchResult = {
  title: string;
  link: string;
  snippet?: string;
};

type BrightDataScrapedPage = {
  url: string;
  title: string;
  h1: string;
  textPreview: string[];
};


export type {
    BrightDataSearchResult,
    BrightDataScrapedPage,
}