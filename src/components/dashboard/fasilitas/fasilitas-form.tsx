"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, SaveIcon, Upload } from "lucide-react";

import { FormField } from "@/components/dashboard/shared/form-field";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useFasilitasForm } from "@/hooks/dashboard/fasilitas/use-fasilitas-form";
import { useKategoriFasilitas } from "@/hooks/dashboard/fasilitas/use-kategori-fasilitas";
import { useGedungRingkas } from "@/hooks/dashboard/fasilitas/use-gedung-ringkas";
import { KategoriManagerDialog } from "@/components/dashboard/fasilitas/kategori-manager-dialog";
import {
  KEPEMILIKAN_ASET,
  KONDISI_ASET,
  STATUS_FASILITAS,
  type FasilitasAdmin,
} from "@/types";

const GEDUNG_NONE = "tidak ada";

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  });
}

const sectionClass = "rounded-xl border bg-card p-4 sm:p-6";

export function FasilitasForm({ initial }: { initial?: FasilitasAdmin }) {
  const {
    values,
    setField,
    fotoPreview,
    setFotoFile,
    fieldErrors,
    isSubmitting,
    errorMessage,
    submit,
    isEditing,
  } = useFasilitasForm(initial);

  const {
    data: kategoriList,
    isLoading: kategoriLoading,
    refresh: refreshKategori,
  } = useKategoriFasilitas();
  const { data: gedungList } = useGedungRingkas();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fotoError, setFotoError] = useState<string | null>(null);

  const error = (key: string) => fieldErrors[key]?.[0];

  function handleFotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setFotoError("Format file tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFotoError("Ukuran file terlalu besar. Maksimal 2 MB.");
      return;
    }
    setFotoError(null);
    setFotoFile(file);
  }

  function parseDeskripsi(raw: string): string[] {
    return raw
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
      className="mx-auto w-full max-w-7xl space-y-6"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFotoChange}
      />

      {(errorMessage || fotoError) && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {errorMessage ?? fotoError}
        </div>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="mx-auto w-full max-w-4xl space-y-5">
          {/* ===== IDENTITAS ===== */}
          <section className={sectionClass}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold">Identitas</h2>
              <Badge variant="secondary">
                {isEditing ? "Mode edit" : "Data baru"}
              </Badge>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex min-h-40 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed bg-muted/30 text-center transition-colors hover:border-primary/50 hover:bg-muted/50"
            >
              {fotoPreview ? (
                <img
                  src={fotoPreview}
                  alt="Foto fasilitas"
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                <span className="flex flex-col items-center gap-2 p-6 text-muted-foreground">
                  <ImagePlus className="size-8" />
                  <span className="text-sm font-medium">
                    Tambahkan foto fasilitas
                  </span>
                  <span className="text-xs">
                    JPG, PNG, atau WebP · Maksimal 2 MB
                  </span>
                </span>
              )}
              <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-background/90 px-3 py-1.5 text-xs font-medium shadow backdrop-blur">
                <Upload className="size-3.5" />
                {fotoPreview ? "Ganti foto" : "Pilih gambar"}
              </span>
            </button>
            {error("foto") && (
              <p className="mt-2 text-xs text-destructive">{error("foto")}</p>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField
                  label="Nama fasilitas"
                  htmlFor="nama"
                  required
                  error={error("nama")}
                >
                  <Input
                    id="nama"
                    value={values.nama}
                    onChange={(e) => setField("nama", e.target.value)}
                    placeholder="mis. Laboratorium Jaringan"
                    aria-invalid={Boolean(error("nama"))}
                  />
                </FormField>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Slug URL:{" "}
                  <span className="font-mono">{values.slug || "..."}</span>
                </p>
                {error("slug") && (
                  <p className="text-xs text-destructive">{error("slug")}</p>
                )}
              </div>

              <FormField
                label="Kategori"
                htmlFor="kategoriId"
                required
                error={error("kategoriId")}
              >
                <div className="flex items-center gap-2">
                  <Select
                    value={values.kategoriId}
                    onValueChange={(value) =>
                      value && setField("kategoriId", value)
                    }
                  >
                    <SelectTrigger
                      id="kategoriId"
                      className="w-full"
                      disabled={kategoriList.length === 0}
                      aria-invalid={Boolean(error("kategoriId"))}
                    >
                      <SelectValue>
                        {(value: string | null) => {
                          if (!value)
                            return kategoriLoading
                              ? "Memuat..."
                              : "Pilih kategori";
                          return (
                            kategoriList.find((k) => k.id === value)?.nama ??
                            "Pilih kategori"
                          );
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {kategoriList.map((k) => (
                        <SelectItem key={k.id} value={k.id}>
                          {k.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <KategoriManagerDialog compact onChange={refreshKategori} />
                </div>
                {!kategoriLoading && kategoriList.length === 0 && (
                  <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-500">
                    Belum ada kategori — tambahkan dulu lewat tombol di samping.
                  </p>
                )}
              </FormField>

              <FormField
                label="Gedung induk"
                htmlFor="gedungId"
                hint="Kosongkan kalau fasilitas ini sendiri adalah gedung."
              >
                <Select
                  value={values.gedungId ?? GEDUNG_NONE}
                  onValueChange={(value) =>
                    setField(
                      "gedungId",
                      value === GEDUNG_NONE || !value ? null : value,
                    )
                  }
                >
                  <SelectTrigger id="gedungId" className="w-full">
                    <SelectValue>
                      {(value: string | null) => {
                        if (!value || value === GEDUNG_NONE) return "tidak ada";
                        return (
                          gedungList.find((g) => g.id === value)?.nama ??
                          "tidak ada"
                        );
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={GEDUNG_NONE}>tidak ada</SelectItem>
                    {gedungList
                      .filter((g) => g.id !== initial?.id)
                      .map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.nama}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Lantai" htmlFor="lantai">
                <Input
                  id="lantai"
                  value={values.lantai ?? ""}
                  onChange={(e) => setField("lantai", e.target.value || null)}
                  placeholder="mis. 2"
                />
              </FormField>
            </div>
          </section>

          {/* ===== DETAIL FISIK ===== */}
          <section className={sectionClass}>
            <h2 className="mb-5 text-sm font-semibold">Detail fisik</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Luas (m²)" htmlFor="luasM2">
                <Input
                  id="luasM2"
                  type="number"
                  step="0.01"
                  value={values.luasM2 ?? ""}
                  onChange={(e) =>
                    setField(
                      "luasM2",
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                />
              </FormField>

              <FormField label="Kapasitas (orang)" htmlFor="kapasitas">
                <Input
                  id="kapasitas"
                  type="number"
                  value={values.kapasitas ?? ""}
                  onChange={(e) =>
                    setField(
                      "kapasitas",
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                />
              </FormField>

              <FormField label="Kepemilikan" htmlFor="kepemilikan">
                <Select
                  value={values.kepemilikan}
                  onValueChange={(v) =>
                    v && setField("kepemilikan", v as typeof values.kepemilikan)
                  }
                >
                  <SelectTrigger id="kepemilikan" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {KEPEMILIKAN_ASET.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Kondisi" htmlFor="kondisi">
                <Select
                  value={values.kondisi}
                  onValueChange={(v) =>
                    v && setField("kondisi", v as typeof values.kondisi)
                  }
                >
                  <SelectTrigger id="kondisi" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {KONDISI_ASET.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Status" htmlFor="status">
                <Select
                  value={values.status}
                  onValueChange={(v) =>
                    v && setField("status", v as typeof values.status)
                  }
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_FASILITAS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="Penggunaan (jam/minggu)"
                htmlFor="penggunaanJamPerMinggu"
              >
                <Input
                  id="penggunaanJamPerMinggu"
                  type="number"
                  value={values.penggunaanJamPerMinggu ?? ""}
                  onChange={(e) =>
                    setField(
                      "penggunaanJamPerMinggu",
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                />
              </FormField>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Checkbox
                id="aksesibelDifabel"
                checked={values.aksesibelDifabel}
                onCheckedChange={(checked) =>
                  setField("aksesibelDifabel", checked === true)
                }
              />
              <Label htmlFor="aksesibelDifabel" className="text-sm font-normal">
                Dapat diakses mahasiswa berkebutuhan khusus
              </Label>
            </div>
          </section>

          {/* ===== DESKRIPSI ===== */}
          <section className={sectionClass}>
            <h2 className="mb-3 text-sm font-semibold">Deskripsi</h2>
            <p className="-mt-1 mb-3 text-xs text-muted-foreground">
              Pisahkan tiap paragraf dengan baris kosong.
            </p>
            <Textarea
              value={values.deskripsi.join("\n\n")}
              onChange={(e) =>
                setField("deskripsi", parseDeskripsi(e.target.value))
              }
              placeholder="Jelaskan fasilitas ini..."
              className="min-h-32 resize-y"
            />
            {error("deskripsi") && (
              <p className="mt-1 text-xs text-destructive">
                {error("deskripsi")}
              </p>
            )}
          </section>
        </div>

        {/* ===== SIDEBAR ===== */}
        <aside className="space-y-4 xl:sticky xl:top-6">
          <section className="rounded-xl border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold">Visibilitas</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="tampilPublik"
                  checked={values.tampilPublik}
                  onCheckedChange={(checked) =>
                    setField("tampilPublik", checked === true)
                  }
                />
                <Label htmlFor="tampilPublik" className="text-sm font-normal">
                  Tampilkan di landing
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="unggulan"
                  checked={values.unggulan}
                  onCheckedChange={(checked) =>
                    setField("unggulan", checked === true)
                  }
                />
                <Label htmlFor="unggulan" className="text-sm font-normal">
                  Jadikan unggulan
                </Label>
              </div>
              <FormField label="Urutan" htmlFor="urutan">
                <Input
                  id="urutan"
                  type="number"
                  value={values.urutan}
                  onChange={(e) =>
                    setField("urutan", Number(e.target.value) || 0)
                  }
                />
              </FormField>
            </div>
          </section>

          <section className="rounded-xl border bg-card p-4">
            <h2 className="mb-2 text-sm font-semibold">Simpan</h2>
            <p className="mb-3 text-xs text-muted-foreground">
              Alat & galeri/dokumen dikelola terpisah setelah data ini
              tersimpan.
            </p>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <SaveIcon />
              {isSubmitting
                ? "Menyimpan..."
                : isEditing
                  ? "Simpan perubahan"
                  : "Simpan fasilitas"}
            </Button>
            <Link
              href="/dashboard/fasilitas"
              className={`${buttonVariants({ variant: "outline" })} mt-2 w-full`}
            >
              Batal
            </Link>
          </section>

          {initial && (
            <section className="rounded-xl border bg-card p-4 text-xs text-muted-foreground">
              <h2 className="mb-2 text-sm font-semibold text-foreground">
                Riwayat data
              </h2>
              <p>
                Dibuat {formatTanggal(initial.createdAt)}
                {initial.createdBy ? ` oleh ${initial.createdBy.nama}` : ""}
              </p>
              <p className="mt-1">
                Diubah {formatTanggal(initial.updatedAt)}
                {initial.updatedBy ? ` oleh ${initial.updatedBy.nama}` : ""}
              </p>
            </section>
          )}
        </aside>
      </div>
    </form>
  );
}
