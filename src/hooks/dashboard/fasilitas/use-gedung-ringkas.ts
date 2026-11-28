"use client";

import { useEffect, useState } from "react";

import type { FasilitasRingkas } from "@/types";

type ListResponse = {
  success: boolean;
  data?: FasilitasRingkas[];
  message?: string;
};

export function useGedungRingkas() {
  const [data, setData] = useState<FasilitasRingkas[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    fetch("/api/dashboard/fasilitas/gedung", { credentials: "include" })
      .then((response) => response.json() as Promise<ListResponse>)
      .then((result) => {
        if (ignore) return;
        if (result.success) setData(result.data ?? []);
        setIsLoading(false);
      })
      .catch(() => {
        if (!ignore) setIsLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  return { data, isLoading };
}