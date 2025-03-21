import condorAi from "@/lib/condor-ai";
import { useQuery } from "@tanstack/react-query";

function useModelsQuery() {
  const modelsQuery = useQuery({
    queryKey: ["condor-ai/get-models"],
    queryFn: () => condorAi.condorAI.getModels(),
  });

  return modelsQuery;
}

export { useModelsQuery };
