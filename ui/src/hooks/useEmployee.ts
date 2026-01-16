import { useEffect, useState } from "react";
import type { ApiResponse } from "../types/ApiResponse";
import type { Employee } from "../types/Employee";

type UseEmployeeResult = {
  data: Employee | null;
  error: string | null;
  isLoading: boolean;
};

export function useEmployee(id: string | undefined): UseEmployeeResult {
  const [data, setData] = useState<Employee | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setError("Missing employee id");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const load = async () => {
      try {
        const response = await fetch(`/api/data/${id}`);
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        const payload = (await response.json()) as ApiResponse<Employee | null>;
        if (!isMounted) {
          return;
        }
        setData(payload.data ?? null);
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
  }, [id]);

  return { data, error, isLoading };
}
