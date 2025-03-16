import condorAi from "@/lib/condor-ai";
import { useQuery } from "@tanstack/react-query";

function useModelsQuery() {
  const modelsQuery = useQuery({
    queryKey: ["users/models"],
    queryFn: () => condorAi.getModels(),
  });

  return modelsQuery;
}

export { useModelsQuery };
