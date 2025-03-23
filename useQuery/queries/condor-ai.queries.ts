import condorAi from "@/lib/condor-ai";
import { News } from "@/types/news";
import { useQuery } from "@tanstack/react-query";

function useModelsQuery() {
  const modelsQuery = useQuery({
    queryKey: ["condor-ai/get-models"],
    queryFn: () => condorAi.condorAI.getModels(),
  });

  return modelsQuery;
}

function useNewsQuery(initialData: News[] = []) {
  const newsQuery = useQuery({
    queryKey: ["condor-ai/get-news"],
    queryFn: () => condorAi.condorAI.getNews(),
    initialData,
  });

  return newsQuery;
}

export { useModelsQuery, useNewsQuery };
