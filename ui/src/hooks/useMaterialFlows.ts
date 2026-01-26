import { useEffect, useState } from "react";
import type { ApiResponse } from "../types/ApiResponse";
import type { MaterialFlow } from "../types/MaterialFlow";

type UseMaterialFlowsResult = {
  data: MaterialFlow[];
  error: string | null;
  isLoading: boolean;
};

export function useMaterialFlows(): UseMaterialFlowsResult {
  const [data, setData] = useState<MaterialFlow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const response = await fetch("/api/materialflow/list");
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        const payload = (await response.json()) as ApiResponse<MaterialFlow[]>;
        if (!isMounted) {
          return;
        }
        setData(payload.data ?? []);
      } catch (err) {
        if (!isMounted) {
          return;
        }
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, error, isLoading };
}
