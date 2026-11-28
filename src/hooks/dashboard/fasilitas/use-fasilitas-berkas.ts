"use client";

import { useState } from "react";

import type { BerkasFasilitasAdmin, JenisBerkasFasilitas } from "@/types";
import { JENIS_BERKAS_FOTO } from "@/types";

type UploadResult = {
  success: boolean;
  data?: { path: string; url: string };
  message?: string;
};

type ItemResponse = {
  success: boolean;
  data?: BerkasFasilitasAdmin;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export function useFasilitasBerkas(fasilitasId: string, initial: BerkasFasilitasAdmin[]) {
  const [data, setData] = useState<BerkasFasilitasAdmin[]>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function uploadUrlUntuk(jenis: JenisBerkasFasilitas) {
    return JENIS_BERKAS_FOTO.includes(jenis)
      ? "/api/dashboard/fasilitas/upload-galeri"
      : "/api/dashboard/fasilitas/upload-dokumen";
  }

  async function addBerkas(options: {
    file: File;
    jenis: JenisBerkasFasilitas;
    label: string;
  }) {
    setIsSaving(true);
    setErrorMessage(null);

    let uploadedPath: string | null = null;
    try {
      const body = new FormData();
      body.set("file", options.file);
      const uploadResponse = await fetch(uploadUrlUntuk(options.jenis), {
        method: "POST",
        credentials: "include",
        body,
      });
      const uploadResult = (await uploadResponse.json()) as UploadResult;
      if (!uploadResponse.ok || !uploadResult.success || !uploadResult.data) {
        throw new Error(uploadResult.message ?? "Gagal mengunggah berkas.");
      }
      uploadedPath = uploadResult.data.path;

      const response = await fetch("/api/dashboard/fasilitas/berkas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fasilitasId,
          jenis: options.jenis,
          label: options.label,
          path: uploadedPath,
          mime: options.file.type,
          ukuran: options.file.size,
          urutan: data.length,
        }),
      });
      const result = (await response.json()) as ItemResponse;
      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.message ?? "Gagal menyimpan berkas.");
      }

      setData((prev) => [...prev, result.data!]);
      return true;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Terjadi kesalahan.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function removeBerkas(id: string) {
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/dashboard/fasilitas/berkas/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = (await response.json()) as { success: boolean; message?: string };
      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Gagal menghapus berkas.");
      }
      setData((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Terjadi kesalahan.");
      return false;
    }
  }

  return { data, isSaving, errorMessage, addBerkas, removeBerkas };
}