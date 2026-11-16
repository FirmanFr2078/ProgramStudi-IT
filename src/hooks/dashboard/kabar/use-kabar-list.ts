"use client";

import { useCallback, useEffect, useState } from "react";

import type { KabarAdmin } from "@/types";

type KabarListResponse = {
  success: boolean;
  data?: KabarAdmin[];
  message?: string;
};

type DeleteResponse = {
  success: boolean;
  message?: string;
};

export function useKabarList() {
  const [data, setData] = useState<KabarAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/dashboard/kabar", {
        credentials: "include",
      });
      const result = (await response.json()) as KabarListResponse;

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Gagal memuat daftar kabar.");
      }

      setData(result.data ?? []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memuat kabar.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    fetch("/api/dashboard/kabar", { credentials: "include" })
      .then((response) => response.json() as Promise<KabarListResponse>)
      .then((result) => {
        if (ignore) return;
        if (!result.success) {
          setErrorMessage(result.message ?? "Gagal memuat daftar kabar.");
        } else {
          setData(result.data ?? []);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        if (ignore) return;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memuat kabar.",
        );
        setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function deleteKabar(id: string) {
    setDeletingId(id);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/dashboard/kabar/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = (await response.json()) as DeleteResponse;

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Gagal menghapus kabar.");
      }

      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menghapus.",
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
    deleteKabar,
    refresh: fetchList,
  };
}
