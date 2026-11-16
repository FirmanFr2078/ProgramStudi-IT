"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useRef, useState } from "react";
import {
  AlignLeft,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  FileText,
  Heading2,
  ImagePlus,
  List,
  Minus,
  Plus,
  Quote,
  RotateCcw,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useKabarForm } from "@/hooks/dashboard/kabar/use-kabar-form";
import type { ArticleBlock, KabarAdmin } from "@/types";


export function KabarForm({ initial }: { initial?: KabarAdmin }) {
  const {
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
  } = useKabarForm(initial);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<"cover" | string>("cover");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
  const ALLOWED_IMAGE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

  function chooseCover() {
    setUploadTarget("cover");
    fileInputRef.current?.click();
  }

  function addImageBlock() {
    const id = addBlock("image");
    setUploadTarget(id);
    fileInputRef.current?.click();
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setUploadError(
        "Format file tidak didukung. Gunakan JPG, PNG, atau WebP.",
      );
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setUploadError("Ukuran file terlalu besar. Maksimal 2 MB.");
      return;
    }

    setUploadError(null);
    if (uploadTarget === "cover") {
      setCoverFile(file);
    } else {
      setBlockImageFile(uploadTarget, file);
    }
  }

  function addListBlock(style: "ordered" | "unordered") {
    const id = addBlock("list");
    updateBlock(id, { style } as Partial<ArticleBlock>);
  }

  function renderBlock(block: ArticleBlock, index: number) {
    return (
      <section
        key={block.id}
        className="group relative rounded-xl border border-border/70 bg-background/50 p-3 transition-colors hover:border-primary/30"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex size-6 items-center justify-center rounded-md bg-muted">
              {block.type === "paragraph" && <AlignLeft className="size-3.5" />}
              {block.type === "heading" && <Heading2 className="size-3.5" />}
              {block.type === "image" && <ImagePlus className="size-3.5" />}
              {block.type === "quote" && <Quote className="size-3.5" />}
              {block.type === "list" && <List className="size-3.5" />}
              {block.type === "divider" && <Minus className="size-3.5" />}
            </span>
            <span className="capitalize">
              {block.type === "heading"
                ? "Subjudul"
                : block.type === "image"
                  ? "Gambar artikel"
                  : block.type}
            </span>
          </div>
          <div className="flex items-center gap-0.5 opacity-100 transition-opacity sm:opacity-60 sm:group-hover:opacity-100">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Pindah ke atas"
              disabled={index === 0}
              onClick={() => moveBlock(block.id, -1)}
            >
              <ArrowUp />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Pindah ke bawah"
              disabled={index === values.konten.length - 1}
              onClick={() => moveBlock(block.id, 1)}
            >
              <ArrowDown />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Hapus blok"
              onClick={() => removeBlock(block.id)}
            >
              <Trash2 className="text-destructive" />
            </Button>
          </div>
        </div>

        {block.type === "paragraph" && (
          <Textarea
            value={block.content}
            onChange={(event) =>
              updateBlock(block.id, { content: event.target.value })
            }
            placeholder="Tulis paragraf kabar..."
            className="min-h-24 resize-y border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
          />
        )}

        {block.type === "heading" && (
          <div className="flex gap-2">
            <Select
              value={String(block.level)}
              onValueChange={(value) =>
                updateBlock(block.id, { level: Number(value) as 2 | 3 })
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">H2</SelectItem>
                <SelectItem value="3">H3</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={block.content}
              onChange={(event) =>
                updateBlock(block.id, { content: event.target.value })
              }
              placeholder="Tulis subjudul..."
              className="font-semibold"
            />
          </div>
        )}

        {block.type === "image" && (
          <div className="space-y-3">
            {block.image ? (
              <div className="space-y-2">
                <img
                  src={block.image}
                  alt={block.alt}
                  className="max-h-105 w-full rounded-lg object-contain"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUploadTarget(block.id);
                    fileInputRef.current?.click();
                  }}
                >
                  <Upload /> Ganti gambar
                </Button>
              </div>
            ) : (
              <div className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/30">
                <ImagePlus className="size-7 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Gambar belum dipilih
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUploadTarget(block.id);
                    fileInputRef.current?.click();
                  }}
                >
                  <Upload /> Unggah gambar
                </Button>
              </div>
            )}
            <Input
              value={block.alt}
              onChange={(event) =>
                updateBlock(block.id, { alt: event.target.value })
              }
              placeholder="Teks alternatif gambar (alt)"
            />
            <Input
              value={block.caption ?? ""}
              onChange={(event) =>
                updateBlock(block.id, { caption: event.target.value })
              }
              placeholder="Keterangan gambar (opsional)"
            />
          </div>
        )}

        {block.type === "quote" && (
          <Textarea
            value={block.content}
            onChange={(event) =>
              updateBlock(block.id, { content: event.target.value })
            }
            placeholder="Tuliskan kutipan..."
            className="min-h-20 border-l-2 border-l-primary bg-muted/20 italic"
          />
        )}

        {block.type === "list" && (
          <div className="space-y-2">
            <Select
              value={block.style}
              onValueChange={(value) =>
                updateBlock(block.id, {
                  style: value as "ordered" | "unordered",
                })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unordered">Bullet list</SelectItem>
                <SelectItem value="ordered">Daftar bernomor</SelectItem>
              </SelectContent>
            </Select>
            {block.items.map((item, itemIndex) => (
              <div key={`${block.id}-${itemIndex}`} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(event) =>
                    updateBlock(block.id, {
                      items: block.items.map((value, i) =>
                        i === itemIndex ? event.target.value : value,
                      ),
                    })
                  }
                  placeholder={`Item ${itemIndex + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={block.items.length === 1}
                  onClick={() =>
                    updateBlock(block.id, {
                      items: block.items.filter((_, i) => i !== itemIndex),
                    })
                  }
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                updateBlock(block.id, { items: [...block.items, ""] })
              }
            >
              <Plus /> Tambah item
            </Button>
          </div>
        )}

        {block.type === "divider" && (
          <div className="py-2">
            <hr className="border-border" />
          </div>
        )}
      </section>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="mx-auto w-full max-w-7xl space-y-6"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleImageUpload}
      />

      {(errorMessage || uploadError) && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage ?? uploadError}
        </div>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <main className="mx-auto w-full max-w-4xl space-y-5">
          <div className="rounded-xl border bg-card p-4 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <Badge variant="secondary">
                {isEditing ? "Mode edit" : "Dokumen baru"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {values.konten.length} blok konten
              </span>
            </div>

            <button
              type="button"
              onClick={chooseCover}
              className="group relative flex min-h-40 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed bg-muted/30 text-center transition-colors hover:border-primary/50 hover:bg-muted/50"
            >
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Banner kabar"
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                <span className="flex flex-col items-center gap-2 p-6 text-muted-foreground">
                  <ImagePlus className="size-8" />
                  <span className="text-sm font-medium">
                    Tambahkan banner utama
                  </span>
                  <span className="text-xs">
                    JPG, PNG, atau WebP · Maksimal 2 MB
                  </span>
                </span>
              )}
              <span className="absolute bottom-3 right-3 rounded-md bg-background/90 px-3 py-1.5 text-xs font-medium shadow backdrop-blur">
                {coverPreview ? "Ganti banner" : "Pilih gambar"}
              </span>
            </button>

            <div className="mt-7 space-y-5">
              <Input
                value={values.judul}
                onChange={(event) => setField("judul", event.target.value)}
                placeholder="Tulis judul kabar..."
                className="h-auto border-0 px-0 py-2 text-2xl font-bold tracking-tight shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-0 sm:text-3xl"
              />
              {fieldErrors.judul && (
                <p className="text-xs text-destructive">
                  {fieldErrors.judul[0]}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b pb-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  {values.tanggal || "Tanggal belum ditentukan"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="size-3.5" />
                  {initial?.createdBy?.nama ?? "Penulis otomatis saat disimpan"}
                </span>
                <Badge variant="outline">{values.kategori}</Badge>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ringkasan">Ringkasan artikel</Label>
                <Textarea
                  id="ringkasan"
                  value={values.ringkasan}
                  onChange={(event) =>
                    setField("ringkasan", event.target.value)
                  }
                  placeholder="Tulis ringkasan singkat yang akan tampil pada kartu kabar..."
                  className="min-h-20 resize-y"
                />
                {fieldErrors.ringkasan && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.ringkasan[0]}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Isi artikel</Label>
                  <span className="text-xs text-muted-foreground">
                    Susun blok sesuai alur kabar
                  </span>
                </div>
                {values.konten.map(renderBlock)}
                {fieldErrors.konten && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.konten[0]}
                  </p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addBlock("paragraph")}
                >
                  <Plus /> Tambah paragraf
                </Button>
              </div>
            </div>
          </div>
        </main>

        <aside className="space-y-4 xl:sticky xl:top-6">
          <section className="rounded-xl border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold">Informasi artikel</h2>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="kategori">Kategori</Label>
                <Select
                  value={values.kategori}
                  onValueChange={(value) =>
                    setField("kategori", value as typeof values.kategori)
                  }
                >
                  <SelectTrigger id="kategori" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Berita">Berita</SelectItem>
                    <SelectItem value="Pengumuman">Pengumuman</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tanggal">Tanggal publikasi</Label>
                <Input
                  id="tanggal"
                  type="date"
                  value={values.tanggal}
                  onChange={(event) => setField("tanggal", event.target.value)}
                />
                {fieldErrors.tanggal && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.tanggal[0]}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="slug">Slug URL</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={resetSlugFromTitle}
                  >
                    <RotateCcw /> Otomatis
                  </Button>
                </div>
                <Input
                  id="slug"
                  value={values.slug}
                  onChange={(event) => setField("slug", event.target.value)}
                  placeholder="judul-kabar"
                />
                {fieldErrors.slug && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.slug[0]}
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground">
                  Mengikuti judul secara otomatis, tetapi bisa diedit manual.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold">Tambah elemen</h2>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                className="justify-start"
                onClick={() => addBlock("paragraph")}
              >
                <AlignLeft /> Paragraf
              </Button>
              <Button
                type="button"
                variant="outline"
                className="justify-start"
                onClick={() => addBlock("heading")}
              >
                <Heading2 /> Subjudul
              </Button>
              <Button
                type="button"
                variant="outline"
                className="justify-start"
                onClick={addImageBlock}
              >
                <ImagePlus /> Gambar
              </Button>
              <Button
                type="button"
                variant="outline"
                className="justify-start"
                onClick={() => addBlock("quote")}
              >
                <Quote /> Kutipan
              </Button>
              <Button
                type="button"
                variant="outline"
                className="justify-start"
                onClick={() => addListBlock("unordered")}
              >
                <List /> Daftar
              </Button>
              <Button
                type="button"
                variant="outline"
                className="justify-start"
                onClick={() => addBlock("divider")}
              >
                <Minus /> Pemisah
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Gambar akan diunggah otomatis saat kamu klik &ldquo;Simpan kabar&rdquo;.
            </p>
          </section>

          <section className="rounded-xl border bg-card p-4">
            <h2 className="mb-2 text-sm font-semibold">Publikasi</h2>
            <p className="mb-3 text-xs text-muted-foreground">
              Pastikan judul, ringkasan, tanggal, dan isi artikel sudah sesuai
              sebelum menyimpan.
            </p>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <FileText />
              {isSubmitting
                ? "Mengunggah & menyimpan..."
                : isEditing
                  ? "Simpan perubahan"
                  : "Simpan kabar"}
            </Button>
            <Link
              href="/dashboard/kabar"
              className={`${buttonVariants({ variant: "outline" })} mt-2 w-full`}
            >
              Batal
            </Link>
          </section>
        </aside>
      </div>
    </form>
  );
}
