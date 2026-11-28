"use client";

import { useCallback, useEffect, useState } from "react";

import type { FasilitasAdmin } from "@/types";

type ListResponse = {
  success: boolean;
  data?: FasilitasAdmin[];
  message?: string;
};

type DeleteResponse = {
  success: boolean;
  message?: string;
};

export function useFasilitasList() {
  const [data, setData] = useState<FasilitasAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/dashboard/fasilitas", {
        credentials: "include",
      });
      const result = (await response.json()) as ListResponse;
      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Gagal memuat daftar fasilitas.");
      }
      setData(result.data ?? []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memuat fasilitas.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  async function deleteFasilitas(id: string) {
    setDeletingId(id);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/dashboard/fasilitas/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = (await response.json()) as DeleteResponse;
      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Gagal menghapus fasilitas.");
      }
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return {
    data,
    isLoading,
    errorMessage,
    deletingId,
    deleteFasilitas,
    refresh: fetchList,
  };
}