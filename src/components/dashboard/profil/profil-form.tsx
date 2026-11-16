"use client";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";

import { KetuaProdiPreview } from "@/components/dashboard/profil/ketua-prodi-preview";
import { FormField } from "@/components/dashboard/shared/form-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProfilForm } from "@/hooks/dashboard/profil/use-profil-form";
import type {
  ProfilProdiAdmin,
  ProfilProdiSambutanDosen,
} from "@/types";

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  });
}

const sectionClass = "rounded-xl border bg-card p-4 sm:p-6";

function ItemToolbar({
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  index: number;
  total: number;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      {onMoveUp && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7"
          disabled={index === 0}
          onClick={onMoveUp}
          aria-label="Pindah ke atas"
        >
          <ArrowUpIcon className="size-3.5" />
        </Button>
      )}
      {onMoveDown && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7"
          disabled={index === total - 1}
          onClick={onMoveDown}
          aria-label="Pindah ke bawah"
        >
          <ArrowDownIcon className="size-3.5" />
        </Button>
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-7"
        disabled={total <= 1}
        onClick={onRemove}
        aria-label="Hapus item"
      >
        <Trash2Icon className="size-3.5 text-destructive" />
      </Button>
    </div>
  );
}

/** Satu blok "daftar paragraf" (sejarah / misi / tujuan). */
function TextListSection({
  title,
  hint,
  addLabel,
  multiline,
  list,
  error,
  onAdd,
  onUpdate,
  onMove,
  onRemove,
}: {
  title: string;
  hint?: string;
  addLabel: string;
  multiline?: boolean;
  list: string[];
  error?: string;
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <section className={sectionClass}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {hint && (
            <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>
          )}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <PlusIcon /> {addLabel}
        </Button>
      </div>

      <div className="space-y-3">
        {list.map((value, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="mt-2 w-5 shrink-0 text-xs text-muted-foreground">
              {index + 1}.
            </span>
            {multiline ? (
              <Textarea
                value={value}
                onChange={(event) => onUpdate(index, event.target.value)}
                placeholder="Tulis paragrafnya di sini..."
                className="min-h-20"
                aria-invalid={Boolean(error)}
              />
            ) : (
              <Input
                value={value}
                onChange={(event) => onUpdate(index, event.target.value)}
                placeholder="Tulis isinya di sini..."
                aria-invalid={Boolean(error)}
              />
            )}
            <ItemToolbar
              index={index}
              total={list.length}
              onMoveUp={() => onMove(index, -1)}
              onMoveDown={() => onMove(index, 1)}
              onRemove={() => onRemove(index)}
            />
          </div>
        ))}
      </div>
      {error && <p className="mt-3 text-xs text-destructive">{error}</p>}
    </section>
  );
}

export function ProfilForm({
  initial,
  ketuaProdi,
}: {
  initial: ProfilProdiAdmin | null;
  ketuaProdi: ProfilProdiSambutanDosen | null;
}) {
  const {
    values,
    setField,
    addTextItem,
    updateTextItem,
    removeTextItem,
    moveTextItem,
    addProfilLulusan,
    updateProfilLulusan,
    removeProfilLulusan,
    addIdentitas,
    updateIdentitas,
    removeIdentitas,
    fieldErrors,
    isSubmitting,
    errorMessage,
    successMessage,
    updatedAt,
    submit,
  } = useProfilForm(initial);

  const error = (key: string) => fieldErrors[key]?.[0];

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
      className="mx-auto w-full max-w-7xl space-y-6"
    >
      {(errorMessage || successMessage) && (
        <div
          role="alert"
          className={`rounded-lg border px-3 py-2 text-sm ${
            errorMessage
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
          }`}
        >
          {errorMessage ?? successMessage}
        </div>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="mx-auto w-full max-w-4xl space-y-5">
          {/* ===== SAMBUTAN KETUA PRODI ===== */}
          <section className={sectionClass}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold">
                Sambutan Ketua Program Studi
              </h2>
              <Badge variant="secondary">Diambil otomatis</Badge>
            </div>

            <KetuaProdiPreview ketuaProdi={ketuaProdi} />

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-muted-foreground">
                  Isi sambutan per paragraf
                </h3>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTextItem("sambutanIsi")}
                >
                  <PlusIcon /> Tambah paragraf
                </Button>
              </div>

              {values.sambutanIsi.map((value, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="mt-2 w-5 shrink-0 text-xs text-muted-foreground">
                    {index + 1}.
                  </span>

                  <Textarea
                    value={value}
                    onChange={(event) =>
                      updateTextItem("sambutanIsi", index, event.target.value)
                    }
                    placeholder="Paragraf sambutan..."
                    className="min-h-20"
                    aria-invalid={Boolean(error("sambutanIsi"))}
                  />

                  <ItemToolbar
                    index={index}
                    total={values.sambutanIsi.length}
                    onMoveUp={() => moveTextItem("sambutanIsi", index, -1)}
                    onMoveDown={() => moveTextItem("sambutanIsi", index, 1)}
                    onRemove={() => removeTextItem("sambutanIsi", index)}
                  />
                </div>
              ))}

              {error("sambutanIsi") && (
                <p className="text-xs text-destructive">
                  {error("sambutanIsi")}
                </p>
              )}
            </div>
          </section>

          {/* ===== IDENTITAS PROGRAM STUDI ===== */}
          <section className={sectionClass}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold">Identitas Program Studi</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addIdentitas}
              >
                <PlusIcon /> Tambah baris
              </Button>
            </div>
            <p className="-mt-3 mb-4 text-[11px] text-muted-foreground">
              Mis. Nama Prodi, Jenjang, Fakultas, Perguruan Tinggi, Gelar
              Lulusan, Akreditasi, SK Penyelenggaraan, Lama Studi.
            </p>

            <div className="space-y-3">
              {values.identitas.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Input
                    value={item.label}
                    onChange={(event) =>
                      updateIdentitas(index, "label", event.target.value)
                    }
                    placeholder="Label, mis. Akreditasi"
                    className="sm:max-w-55"
                    aria-invalid={Boolean(error("identitas"))}
                  />
                  <Input
                    value={item.value}
                    onChange={(event) =>
                      updateIdentitas(index, "value", event.target.value)
                    }
                    placeholder="Isi, mis. Unggul — BAN-PT"
                    aria-invalid={Boolean(error("identitas"))}
                  />
                  <ItemToolbar
                    index={index}
                    total={values.identitas.length}
                    onRemove={() => removeIdentitas(index)}
                  />
                </div>
              ))}
            </div>
            {error("identitas") && (
              <p className="mt-3 text-xs text-destructive">
                {error("identitas")}
              </p>
            )}
          </section>

          {/* ===== VISI ===== */}
          <section className={sectionClass}>
            <h2 className="mb-5 text-sm font-semibold">Visi</h2>
            <FormField
              label="Pernyataan visi"
              htmlFor="visi"
              required
              error={error("visi")}
            >
              <Textarea
                id="visi"
                value={values.visi}
                onChange={(event) => setField("visi", event.target.value)}
                placeholder="Menjadi program studi yang unggul, islami, dan berdaya saing..."
                className="min-h-24"
                aria-invalid={Boolean(error("visi"))}
              />
            </FormField>
          </section>

          {/* ===== MISI ===== */}
          <TextListSection
            title="Misi"
            addLabel="Tambah misi"
            multiline
            list={values.misi}
            error={error("misi")}
            onAdd={() => addTextItem("misi")}
            onUpdate={(index, value) => updateTextItem("misi", index, value)}
            onMove={(index, direction) =>
              moveTextItem("misi", index, direction)
            }
            onRemove={(index) => removeTextItem("misi", index)}
          />

          {/* ===== SEJARAH ===== */}
          <TextListSection
            title="Sejarah Program Studi"
            hint="Narasi perjalanan dan perkembangan program studi, per paragraf."
            addLabel="Tambah paragraf"
            multiline
            list={values.sejarah}
            error={error("sejarah")}
            onAdd={() => addTextItem("sejarah")}
            onUpdate={(index, value) => updateTextItem("sejarah", index, value)}
            onMove={(index, direction) =>
              moveTextItem("sejarah", index, direction)
            }
            onRemove={(index) => removeTextItem("sejarah", index)}
          />

          {/* ===== TUJUAN ===== */}
          <TextListSection
            title="Tujuan Program Studi"
            addLabel="Tambah tujuan"
            multiline
            list={values.tujuan}
            error={error("tujuan")}
            onAdd={() => addTextItem("tujuan")}
            onUpdate={(index, value) => updateTextItem("tujuan", index, value)}
            onMove={(index, direction) =>
              moveTextItem("tujuan", index, direction)
            }
            onRemove={(index) => removeTextItem("tujuan", index)}
          />

          {/* ===== PROFIL LULUSAN ===== */}
          <section className={sectionClass}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold">Profil Lulusan</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addProfilLulusan}
              >
                <PlusIcon /> Tambah profil
              </Button>
            </div>

            <div className="space-y-4">
              {values.profilLulusan.map((item, index) => (
                <div key={index} className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Profil #{index + 1}
                    </span>
                    <ItemToolbar
                      index={index}
                      total={values.profilLulusan.length}
                      onRemove={() => removeProfilLulusan(index)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      value={item.judul}
                      onChange={(event) =>
                        updateProfilLulusan(index, "judul", event.target.value)
                      }
                      placeholder="Judul, mis. Software Developer"
                      aria-invalid={Boolean(error("profilLulusan"))}
                    />
                    <Textarea
                      value={item.deskripsi}
                      onChange={(event) =>
                        updateProfilLulusan(
                          index,
                          "deskripsi",
                          event.target.value,
                        )
                      }
                      placeholder="Deskripsi singkat bidang pekerjaannya..."
                      aria-invalid={Boolean(error("profilLulusan"))}
                    />
                  </div>
                </div>
              ))}
            </div>
            {error("profilLulusan") && (
              <p className="mt-3 text-xs text-destructive">
                {error("profilLulusan")}
              </p>
            )}
          </section>
        </div>

        {/* ===== SIDEBAR AKSI ===== */}
        <aside className="space-y-4 xl:sticky xl:top-6">
          <section className="rounded-xl border bg-card p-4">
            <h2 className="mb-2 text-sm font-semibold">Simpan</h2>
            <p className="mb-3 text-xs text-muted-foreground">
              Semua bagian di halaman ini tersimpan sekaligus sebagai satu
              konten Profil Program Studi.
            </p>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <SaveIcon />
              {isSubmitting ? "Menyimpan..." : "Simpan Profil Program Studi"}
            </Button>
          </section>

          {updatedAt && (
            <section className="rounded-xl border bg-card p-4 text-xs text-muted-foreground">
              <h2 className="mb-2 text-sm font-semibold text-foreground">
                Riwayat data
              </h2>
              <p>Terakhir diperbarui {formatTanggal(updatedAt)}.</p>
            </section>
          )}

          {!initial && (
            <section className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-700">
              Konten Profil Program Studi belum pernah diisi. Isi semua bagian
              lalu klik simpan untuk membuat data pertama kali.
            </section>
          )}
        </aside>
      </div>
    </form>
  );
}