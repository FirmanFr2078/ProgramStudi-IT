"use client";

import { useState } from "react";

import type { AlatAdmin, AlatInput } from "@/types";

type ItemResponse = {
  success: boolean;
  data?: AlatAdmin;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export function useFasilitasAlat(fasilitasId: string, initial: AlatAdmin[]) {
  const [data, setData] = useState<AlatAdmin[]>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});

  async function addAlat(input: Omit<AlatInput, "fasilitasId">) {
    setIsSaving(true);
    setErrorMessage(null);
    setFieldErrors({});
    try {
      const response = await fetch("/api/dashboard/fasilitas/alat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...input, fasilitasId }),
      });
      const result = (await response.json()) as ItemResponse;
      if (!response.ok || !result.success || !result.data) {
        if (result.errors) setFieldErrors(result.errors);
        setErrorMessage(result.message ?? "Gagal menambahkan alat.");
        return false;
      }
      setData((prev) => [...prev, result.data!]);
      return true;
    } finally {
      setIsSaving(false);
    }
  }

  async function editAlat(id: string, input: Omit<AlatInput, "fasilitasId">) {
    setIsSaving(true);
    setErrorMessage(null);
    setFieldErrors({});
    try {
      const response = await fetch(`/api/dashboard/fasilitas/alat/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...input, fasilitasId }),
      });
      const result = (await response.json()) as ItemResponse;
      if (!response.ok || !result.success || !result.data) {
        if (result.errors) setFieldErrors(result.errors);
        setErrorMessage(result.message ?? "Gagal mengubah alat.");
        return false;
      }
      setData((prev) => prev.map((item) => (item.id === id ? result.data! : item)));
      return true;
    } finally {
      setIsSaving(false);
    }
  }

  async function removeAlat(id: string) {
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/dashboard/fasilitas/alat/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = (await response.json()) as { success: boolean; message?: string };
      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Gagal menghapus alat.");
      }
      setData((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Terjadi kesalahan.");
      return false;
    }
  }

  return { data, isSaving, errorMessage, fieldErrors, addAlat, editAlat, removeAlat };
}