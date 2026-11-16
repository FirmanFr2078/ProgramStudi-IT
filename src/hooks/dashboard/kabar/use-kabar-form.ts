"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { ArticleBlock, KabarAdmin } from "@/types";

export type KabarFormValues = {
  slug: string;
  judul: string;
  ringkasan: string;
  konten: ArticleBlock[];
  kategori: "Berita" | "Pengumuman";
  tanggal: string;
  gambar: string | null;
};

type KabarFormResponse = {
  success: boolean;
  data?: KabarAdmin;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

type UploadResult = {
  success: boolean;
  data?: { path: string; url: string };
  message?: string;
};

const EMPTY_VALUES: KabarFormValues = {
  slug: "",
  judul: "",
  ringkasan: "",
  konten: [{ id: crypto.randomUUID(), type: "paragraph", content: "" }],
  kategori: "Berita",
  tanggal: new Date(Date.now() - new Date().getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10),
  gambar: null,
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

function makeBlock(type: ArticleBlock["type"]): ArticleBlock {
  const id = crypto.randomUUID();
  switch (type) {
    case "paragraph":
      return { id, type, content: "" };
    case "heading":
      return { id, type, level: 2, content: "" };
    case "image":
      return { id, type, image: "", alt: "", caption: "" };
    case "quote":
      return { id, type, content: "" };
    case "list":
      return { id, type, style: "unordered", items: [""] };
    case "divider":
      return { id, type };
  }
}

export function useKabarForm(initial?: KabarAdmin) {
  const router = useRouter();
  const isEditing = Boolean(initial);

  const [values, setValues] = useState<KabarFormValues>(
    initial
      ? {
          slug: initial.slug,
          judul: initial.judul,
          ringkasan: initial.ringkasan,
          konten: initial.konten,
          kategori: initial.kategori,
          tanggal: initial.tanggal,
          gambar: initial.gambarPath,
        }
      : EMPTY_VALUES,
  );
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initial?.gambar ?? null,
  );
  // Saat mengedit, slug dianggap sudah final: mengubah judul TIDAK boleh
  // diam-diam mengganti slug (itu mengubah URL berita yang sudah publik).
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // File yang udah dipilih user tapi BELUM dikirim ke Supabase.
  // key "cover" untuk banner, atau block.id untuk gambar di blok artikel.
  const pendingUploadsRef = useRef<Record<string, File>>({});

  // Lacak semua blob: URL yang pernah dibikin, biar bisa direvoke
  // (gak dibutuhkan browser lagi) pas block dihapus atau form ditinggal.
  const createdObjectUrlsRef = useRef<Set<string>>(new Set());

  function trackObjectUrl(url: string) {
    createdObjectUrlsRef.current.add(url);
    return url;
  }

  useEffect(() => {
    const urls = createdObjectUrlsRef.current;
    return () => {
      for (const url of urls) URL.revokeObjectURL(url);
    };
  }, []);

  function setField<K extends keyof KabarFormValues>(
    key: K,
    value: KabarFormValues[K],
  ) {
    if (key === "slug") setSlugManuallyEdited(true);
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "judul" && !slugManuallyEdited) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  }

  function resetSlugFromTitle() {
    setSlugManuallyEdited(false);
    setValues((prev) => ({ ...prev, slug: slugify(prev.judul) }));
  }

  function setCoverFile(file: File) {
    if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    const objectUrl = trackObjectUrl(URL.createObjectURL(file));
    pendingUploadsRef.current.cover = file;
    setCoverPreview(objectUrl);
    // values.gambar SENGAJA tidak diisi di sini — baru keisi path asli pas submit sukses
  }

  function setBlockImageFile(blockId: string, file: File) {
    const objectUrl = trackObjectUrl(URL.createObjectURL(file));
    pendingUploadsRef.current[blockId] = file;
    updateBlock(blockId, {
      image: objectUrl,
      alt: file.name.replace(/\.[^.]+$/, ""),
      caption: "",
    } as Partial<ArticleBlock>);
  }

  function addBlock(type: ArticleBlock["type"]) {
    const block = makeBlock(type);
    setValues((prev) => ({ ...prev, konten: [...prev.konten, block] }));
    return block.id;
  }

  function updateBlock(id: string, patch: Partial<ArticleBlock>) {
    setValues((prev) => ({
      ...prev,
      konten: prev.konten.map((block) =>
        block.id === id ? ({ ...block, ...patch } as ArticleBlock) : block,
      ),
    }));
  }

  function removeBlock(id: string) {
    setValues((prev) => {
      const removed = prev.konten.find((block) => block.id === id);
      if (removed?.type === "image" && removed.image.startsWith("blob:")) {
        URL.revokeObjectURL(removed.image);
        createdObjectUrlsRef.current.delete(removed.image);
      }
      return {
        ...prev,
        konten: prev.konten.filter((block) => block.id !== id),
      };
    });
    delete pendingUploadsRef.current[id];
  }

  function moveBlock(id: string, direction: -1 | 1) {
    setValues((prev) => {
      const index = prev.konten.findIndex((block) => block.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= prev.konten.length) return prev;
      const konten = [...prev.konten];
      [konten[index], konten[target]] = [konten[target], konten[index]];
      return { ...prev, konten };
    });
  }

  async function uploadPendingFile(
    file: File,
  ): Promise<{ path: string; url: string }> {
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/dashboard/kabar/upload", {
      method: "POST",
      credentials: "include",
      body,
    });
    const result = (await response.json()) as UploadResult;
    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.message ?? "Gagal mengunggah gambar.");
    }
    return result.data;
  }

  async function deleteUploadedFile(path: string) {
    try {
      await fetch("/api/dashboard/kabar/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ path }),
      });
    } catch {
      // best-effort rollback — gagal hapus gak perlu nge-block alur user
    }
  }

  async function submit() {
    setIsSubmitting(true);
    setErrorMessage(null);
    setFieldErrors({});

    const uploadedNow: Record<string, { path: string; url: string }> = {};

    try {
      // 1) Upload semua gambar yang masih nunggu, paralel.
      // Pakai allSettled dan catat tiap upload LANGSUNG saat sukses (bukan
      // menunggu semuanya selesai) — supaya kalau salah satu gagal, upload
      // lain yang sudah SUKSES tetap masuk uploadedNow dan ikut dibersihkan
      // di blok catch, bukan tertinggal jadi sampah di Storage.
      const pendingEntries = Object.entries(pendingUploadsRef.current);
      if (pendingEntries.length > 0) {
        const settled = await Promise.allSettled(
          pendingEntries.map(async ([key, file]) => {
            uploadedNow[key] = await uploadPendingFile(file);
          }),
        );

        const failed = settled.find(
          (result): result is PromiseRejectedResult => result.status === "rejected",
        );
        if (failed) {
          throw failed.reason instanceof Error
            ? failed.reason
            : new Error("Gagal mengunggah salah satu gambar.");
        }
      }

      // 2) Susun payload final — ganti placeholder blob: dengan path/url hasil upload asli
      const finalValues: KabarFormValues = {
        ...values,
        gambar: uploadedNow.cover?.path ?? values.gambar,
        konten: values.konten.map((block) =>
          block.type === "image" && uploadedNow[block.id]
            ? { ...block, image: uploadedNow[block.id].url }
            : block,
        ),
      };

      // 3) Baru simpan row Kabar ke database
      const url = isEditing
        ? `/api/dashboard/kabar/${initial?.id}`
        : "/api/dashboard/kabar";
      const method = isEditing ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(finalValues),
      });
      const result = (await response.json()) as KabarFormResponse;

      if (!response.ok || !result.success) {
        // Rollback — row gagal dibuat/diubah, hapus lagi file yang baru keupload
        await Promise.allSettled(
          Object.values(uploadedNow).map((data) =>
            deleteUploadedFile(data.path),
          ),
        );
        if (result.errors) setFieldErrors(result.errors);
        setErrorMessage(result.message ?? "Gagal menyimpan kabar.");
        return;
      }

      pendingUploadsRef.current = {};
      router.push("/dashboard/kabar");
      router.refresh();
    } catch (error) {
      // Upload sendiri gagal di tengah jalan (mis. gambar ke-3 dari 5 error) —
      // bersihin yang sudah sempat terupload sebelum error ini dilempar
      await Promise.allSettled(
        Object.values(uploadedNow).map((data) => deleteUploadedFile(data.path)),
      );
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
    resetSlugFromTitle,
    coverPreview,
    setCoverFile,
    addBlock,
    updateBlock,
    removeBlock,
    moveBlock,
    setBlockImageFile,
    fieldErrors,
    isSubmitting,
    errorMessage,
    submit,
    isEditing,
  };
}