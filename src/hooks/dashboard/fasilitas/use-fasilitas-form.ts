"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type {
  FasilitasAdmin,
  KepemilikanAset,
  KondisiAset,
  StatusFasilitas,
} from "@/types";

export type FasilitasFormValues = {
  slug: string;
  nama: string;
  kategoriId: string;
  gedungId: string | null;
  lantai: string | null;
  deskripsi: string[];
  foto: string | null;
  luasM2: number | null;
  kapasitas: number | null;
  kepemilikan: KepemilikanAset;
  kondisi: KondisiAset;
  status: StatusFasilitas;
  aksesibelDifabel: boolean;
  penggunaanJamPerMinggu: number | null;
  tampilPublik: boolean;
  unggulan: boolean;
  urutan: number;
};

type FasilitasFormResponse = {
  success: boolean;
  data?: FasilitasAdmin;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

type UploadResult = {
  success: boolean;
  data?: { path: string; url: string };
  message?: string;
};

const EMPTY_VALUES: FasilitasFormValues = {
  slug: "",
  nama: "",
  kategoriId: "",
  gedungId: null,
  lantai: null,
  deskripsi: [],
  foto: null,
  luasM2: null,
  kapasitas: null,
  kepemilikan: "Milik Sendiri",
  kondisi: "Baik",
  status: "Aktif",
  aksesibelDifabel: false,
  penggunaanJamPerMinggu: null,
  tampilPublik: false,
  unggulan: false,
  urutan: 0,
};

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 150);
}

export function useFasilitasForm(initial?: FasilitasAdmin) {
  const router = useRouter();
  const isEditing = Boolean(initial);

  const [values, setValues] = useState<FasilitasFormValues>(
    initial
      ? {
          slug: initial.slug,
          nama: initial.nama,
          kategoriId: initial.kategoriId,
          gedungId: initial.gedungId,
          lantai: initial.lantai,
          deskripsi: initial.deskripsi,
          foto: initial.fotoPath,
          luasM2: initial.luasM2,
          kapasitas: initial.kapasitas,
          kepemilikan: initial.kepemilikan,
          kondisi: initial.kondisi,
          status: initial.status,
          aksesibelDifabel: initial.aksesibelDifabel,
          penggunaanJamPerMinggu: initial.penggunaanJamPerMinggu,
          tampilPublik: initial.tampilPublik,
          unggulan: initial.unggulan,
          urutan: initial.urutan,
        }
      : EMPTY_VALUES,
  );
  const [fotoPreview, setFotoPreview] = useState<string | null>(
    initial?.foto ?? null,
  );
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [pendingFoto, setPendingFoto] = useState<File | null>(null);

  function setField<K extends keyof FasilitasFormValues>(
    key: K,
    value: FasilitasFormValues[K],
  ) {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "nama") {
        next.slug = slugify(String(value));
      }
      return next;
    });
  }
  function setFotoFile(file: File) {
    if (fotoPreview?.startsWith("blob:")) URL.revokeObjectURL(fotoPreview);
    setPendingFoto(file);
    setFotoPreview(URL.createObjectURL(file));
  }

  async function uploadFoto(
    file: File,
  ): Promise<{ path: string; url: string }> {
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/dashboard/fasilitas/upload", {
      method: "POST",
      credentials: "include",
      body,
    });
    const result = (await response.json()) as UploadResult;
    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.message ?? "Gagal mengunggah foto.");
    }
    return result.data;
  }

  async function deleteUploadedFoto(path: string) {
    try {
      await fetch("/api/dashboard/fasilitas/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ path }),
      });
    } catch {
      // best-effort rollback
    }
  }

  async function submit() {
    setIsSubmitting(true);
    setErrorMessage(null);
    setFieldErrors({});

    let uploadedPath: string | null = null;

    try {
      let finalFoto = values.foto;
      if (pendingFoto) {
        const uploaded = await uploadFoto(pendingFoto);
        uploadedPath = uploaded.path;
        finalFoto = uploaded.path;
      }

      const url = isEditing
        ? `/api/dashboard/fasilitas/${initial?.id}`
        : "/api/dashboard/fasilitas";
      const method = isEditing ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...values, foto: finalFoto }),
      });
      const result = (await response.json()) as FasilitasFormResponse;

      if (!response.ok || !result.success) {
        if (uploadedPath) await deleteUploadedFoto(uploadedPath);
        if (result.errors) setFieldErrors(result.errors);
        setErrorMessage(result.message ?? "Gagal menyimpan fasilitas.");
        return;
      }

      setPendingFoto(null);
      router.push("/dashboard/fasilitas");
      router.refresh();
    } catch (error) {
      if (uploadedPath) await deleteUploadedFoto(uploadedPath);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    values,
    setField,
    fotoPreview,
    setFotoFile,
    fieldErrors,
    isSubmitting,
    errorMessage,
    submit,
    isEditing,
  };
}
