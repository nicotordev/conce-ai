import conceAi from "@/lib/conce-ai";
import { News } from "@/types/news";
import { useQuery } from "@tanstack/react-query";

function useModelsQuery() {
  const modelsQuery = useQuery({
    queryKey: ["conce-ai/get-models"],
    queryFn: () => conceAi.conceAi.getModels(),
  });

  return modelsQuery;
}

function useNewsQuery(initialData: News[] = []) {
  const newsQuery = useQuery({
    queryKey: ["conce-ai/get-news"],
    queryFn: () => conceAi.conceAi.getNews(),
    initialData,
  });

  return newsQuery;
}

export { useModelsQuery, useNewsQuery };
