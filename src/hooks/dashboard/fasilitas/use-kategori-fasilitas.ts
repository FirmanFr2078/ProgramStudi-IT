"use client";

import { useCallback, useEffect, useState } from "react";

import type { KategoriFasilitasInput, KategoriFasilitasRef } from "@/types";

type ListResponse = {
  success: boolean;
  data?: KategoriFasilitasRef[];
  message?: string;
};

type ItemResponse = {
  success: boolean;
  data?: KategoriFasilitasRef;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export function useKategoriFasilitas() {
  const [data, setData] = useState<KategoriFasilitasRef[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});
  const [isSaving, setIsSaving] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/dashboard/fasilitas/kategori", {
        credentials: "include",
      });
      const result = (await response.json()) as ListResponse;
      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Gagal memuat kategori fasilitas.");
      }
      setData(result.data ?? []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function createKategori(input: KategoriFasilitasInput) {
    setIsSaving(true);
    setErrorMessage(null);
    setFieldErrors({});
    try {
      const response = await fetch("/api/dashboard/fasilitas/kategori", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });
      const result = (await response.json()) as ItemResponse;
      if (!response.ok || !result.success || !result.data) {
        if (result.errors) setFieldErrors(result.errors);
        setErrorMessage(result.message ?? "Gagal menambahkan kategori.");
        return false;
      }
      setData((prev) => [...prev, result.data!]);
      return true;
    } finally {
      setIsSaving(false);
    }
  }

  async function updateKategori(id: string, input: KategoriFasilitasInput) {
    setIsSaving(true);
    setErrorMessage(null);
    setFieldErrors({});
    try {
      const response = await fetch(`/api/dashboard/fasilitas/kategori/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });
      const result = (await response.json()) as ItemResponse;
      if (!response.ok || !result.success || !result.data) {
        if (result.errors) setFieldErrors(result.errors);
        setErrorMessage(result.message ?? "Gagal mengubah kategori.");
        return false;
      }
      setData((prev) => prev.map((item) => (item.id === id ? result.data! : item)));
      return true;
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteKategori(id: string) {
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/dashboard/fasilitas/kategori/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = (await response.json()) as { success: boolean; message?: string };
      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Gagal menghapus kategori.");
      }
      setData((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan.",
      );
      return false;
    }
  }

  return {
    data,
    isLoading,
    errorMessage,
    fieldErrors,
    isSaving,
    createKategori,
    updateKategori,
    deleteKategori,
    refresh,
  };
}