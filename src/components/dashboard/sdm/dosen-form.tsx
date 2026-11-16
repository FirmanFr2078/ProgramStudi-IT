"use client"

import Link from "next/link"
import { useRef, useState, type ChangeEvent } from "react"
import { SaveIcon, Trash2Icon, UploadIcon } from "lucide-react"

import { FormField } from "@/components/dashboard/shared/form-field"
import { TagInput } from "@/components/dashboard/shared/tag-input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useDosenForm,
  type DosenFormValues,
} from "@/hooks/dashboard/sdm/use-dosen-form"
import { getInitials } from "@/lib/initials"
import {
  JABATAN_FUNGSIONAL,
  JABATAN_STRUKTURAL_OPTIONS,
  type DosenAdmin,
  type JabatanFungsional,
} from "@/types"

type PendidikanKey = "s1" | "s2" | "s3"
type PendidikanFieldKey = `${PendidikanKey}${"Bidang" | "Kampus"}`

const TANPA_JABATAN = "__tanpa__"
const JABATAN_LAINNYA = "__lainnya__"

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  })
}

function PendidikanFields({
  jenjang,
  title,
  required,
  hint,
  values,
  error,
  onChange,
}: {
  jenjang: PendidikanKey
  title: string
  required?: boolean
  hint?: string
  values: DosenFormValues
  error?: string
  onChange: (key: PendidikanFieldKey, value: string) => void
}) {
  const bidangKey = `${jenjang}Bidang` as const
  const kampusKey = `${jenjang}Kampus` as const

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant={required ? "default" : "outline"}>{title}</Badge>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          aria-label={`Bidang ${title}`}
          value={values[bidangKey]}
          onChange={(event) => onChange(bidangKey, event.target.value)}
          placeholder="Bidang / program studi"
          aria-invalid={Boolean(error)}
        />
        <Input
          aria-label={`Kampus ${title}`}
          value={values[kampusKey]}
          onChange={(event) => onChange(kampusKey, event.target.value)}
          placeholder="Perguruan tinggi"
          aria-invalid={Boolean(error)}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

const sectionClass = "rounded-xl border bg-card p-4 sm:p-6"

export function DosenForm({ initial }: { initial?: DosenAdmin }) {
  const {
    values,
    setField,
    slug,
    fotoPreview,
    setFotoFile,
    removeFoto,
    fieldErrors,
    isSubmitting,
    errorMessage,
    submit,
    isEditing,
  } = useDosenForm(initial)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fotoError, setFotoError] = useState<string | null>(null)

  // Jabatan struktural: "Lainnya" dinyalakan sekali di awal kalau nilai yang
  // sudah ada TIDAK cocok dengan preset manapun (data lama / custom).
  const [showCustomJabatan, setShowCustomJabatan] = useState(
    () =>
      Boolean(values.jabatanStruktural) &&
      !JABATAN_STRUKTURAL_OPTIONS.includes(
        values.jabatanStruktural as (typeof JABATAN_STRUKTURAL_OPTIONS)[number],
      ),
  )

  const error = (key: string) => fieldErrors[key]?.[0]

  function handleFotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    setFotoError(setFotoFile(file))
  }

  function handleJabatanStrukturalChange(value: string | null) {
    if (!value) return
    if (value === JABATAN_LAINNYA) {
      setShowCustomJabatan(true)
      return
    }
    setShowCustomJabatan(false)
    setField("jabatanStruktural", value === TANPA_JABATAN ? "" : value)
  }

  const jabatanSelectValue = showCustomJabatan
    ? JABATAN_LAINNYA
    : values.jabatanStruktural || TANPA_JABATAN

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
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
              <Badge variant="secondary">{isEditing ? "Mode edit" : "Data baru"}</Badge>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Avatar className="size-24 shrink-0">
                {fotoPreview && (
                  <AvatarImage src={fotoPreview} alt="Foto dosen" className="object-top" />
                )}
                <AvatarFallback className="text-xl font-bold">
                  {getInitials(values.nama) || "?"}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadIcon /> {fotoPreview ? "Ganti foto" : "Unggah foto"}
                  </Button>
                  {fotoPreview && (
                    <Button type="button" variant="ghost" size="sm" onClick={removeFoto}>
                      <Trash2Icon className="text-destructive" /> Hapus foto
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  JPG, PNG, atau WebP · Maksimal 2 MB · Foto diunggah saat kamu menyimpan.
                </p>
                {error("foto") && <p className="text-xs text-destructive">{error("foto")}</p>}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <FormField
                  label="Nama lengkap (dengan gelar)"
                  htmlFor="nama"
                  required
                  error={error("nama")}
                >
                  <Input
                    id="nama"
                    value={values.nama}
                    onChange={(event) => setField("nama", event.target.value)}
                    placeholder="Dr. Ahmad Fauzi, M.Kom."
                    aria-invalid={Boolean(error("nama"))}
                  />
                </FormField>
                {error("slug") ? (
                  <p className="text-xs text-destructive">{error("slug")}</p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    URL publik: <span className="font-mono">/dosen/{slug || "..."}</span>{" "}
                    — mengikuti nama (tanpa gelar) secara otomatis.
                  </p>
                )}
              </div>

              <FormField
                label="NIDN"
                htmlFor="nidn"
                required
                hint="10 digit angka."
                error={error("nidn")}
              >
                <Input
                  id="nidn"
                  inputMode="numeric"
                  maxLength={10}
                  value={values.nidn}
                  onChange={(event) => setField("nidn", event.target.value.replace(/\D/g, ""))}
                  placeholder="0012345601"
                  aria-invalid={Boolean(error("nidn"))}
                />
              </FormField>

              <FormField label="Email" htmlFor="email" required error={error("email")}>
                <Input
                  id="email"
                  type="email"
                  value={values.email}
                  onChange={(event) => setField("email", event.target.value)}
                  placeholder="nama.dosen@gmail.com → ganti setelah @ jika bukan Gmail"
                  aria-invalid={Boolean(error("email"))}
                />
              </FormField>
            </div>
          </section>

          {/* ===== JABATAN ===== */}
          <section className={sectionClass}>
            <h2 className="mb-5 text-sm font-semibold">Jabatan</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Jabatan fungsional"
                htmlFor="jabatanFungsional"
                required
                hint="Jabatan akademik. 'Tenaga Pengajar' untuk dosen yang belum berjabatan."
                error={error("jabatanFungsional")}
              >
                <Select
                  value={values.jabatanFungsional}
                  onValueChange={(value) => {
                    if (value) setField("jabatanFungsional", value as JabatanFungsional)
                  }}
                >
                  <SelectTrigger id="jabatanFungsional" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {JABATAN_FUNGSIONAL.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <div className="space-y-1.5">
                <FormField
                  label="Jabatan struktural"
                  htmlFor="jabatanStruktural"
                  hint="Kosongkan untuk dosen tanpa jabatan struktural."
                  error={error("jabatanStruktural")}
                >
                  <Select value={jabatanSelectValue} onValueChange={handleJabatanStrukturalChange}>
                    <SelectTrigger id="jabatanStruktural" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TANPA_JABATAN}>Tidak ada (dosen)</SelectItem>
                      {JABATAN_STRUKTURAL_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                      <SelectItem value={JABATAN_LAINNYA}>Lainnya...</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                {showCustomJabatan && (
                  <Input
                    aria-label="Jabatan struktural lainnya"
                    value={values.jabatanStruktural}
                    onChange={(event) => setField("jabatanStruktural", event.target.value)}
                    placeholder="Tulis jabatan struktural lainnya"
                    className="mt-1.5"
                  />
                )}
              </div>
            </div>
          </section>

          {/* ===== PENDIDIKAN ===== */}
          <section className={sectionClass}>
            <h2 className="mb-5 text-sm font-semibold">Riwayat pendidikan</h2>
            <p className="-mt-3 mb-4 text-xs text-muted-foreground">
              S1 dan S2 wajib diisi — syarat minimal untuk menjadi dosen.
            </p>
            <div className="space-y-5">
              <PendidikanFields
                jenjang="s1"
                title="S1"
                required
                values={values}
                error={error("pendidikanS1")}
                onChange={(key, value) => setField(key, value)}
              />
              <PendidikanFields
                jenjang="s2"
                title="S2"
                required
                values={values}
                error={error("pendidikanS2")}
                onChange={(key, value) => setField(key, value)}
              />
              <PendidikanFields
                jenjang="s3"
                title="S3"
                hint="Opsional"
                values={values}
                error={error("pendidikanS3")}
                onChange={(key, value) => setField(key, value)}
              />
            </div>
          </section>

          {/* ===== KEAHLIAN & MATA KULIAH ===== */}
          <section className={sectionClass}>
            <h2 className="mb-5 text-sm font-semibold">Keahlian & pengampuan</h2>
            <div className="space-y-5">
              <FormField
                label="Bidang keahlian"
                htmlFor="bidangKeahlian"
                required
                error={error("bidangKeahlian")}
              >
                <TagInput
                  id="bidangKeahlian"
                  value={values.bidangKeahlian}
                  onChange={(next) => setField("bidangKeahlian", next)}
                  placeholder="mis. Rekayasa Perangkat Lunak"
                  maxItems={10}
                  invalid={Boolean(error("bidangKeahlian"))}
                />
              </FormField>

              <FormField
                label="Mata kuliah diampu"
                htmlFor="mataKuliah"
                error={error("mataKuliah")}
              >
                <TagInput
                  id="mataKuliah"
                  value={values.mataKuliah}
                  onChange={(next) => setField("mataKuliah", next)}
                  placeholder="mis. Basis Data"
                  maxItems={30}
                  invalid={Boolean(error("mataKuliah"))}
                />
              </FormField>
            </div>
          </section>

          {/* ===== PUBLIKASI ===== */}
          <section className={sectionClass}>
            <h2 className="mb-5 text-sm font-semibold">Profil publikasi</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Tautan SINTA"
                htmlFor="sinta"
                hint="Harus diawali https://"
                error={error("sinta")}
              >
                <Input
                  id="sinta"
                  type="url"
                  value={values.sinta}
                  onChange={(event) => setField("sinta", event.target.value)}
                  placeholder="https://sinta.kemdiktisaintek.go.id/authors/profile/..."
                  aria-invalid={Boolean(error("sinta"))}
                />
              </FormField>

              <FormField
                label="Tautan Google Scholar"
                htmlFor="googleScholar"
                hint="Harus diawali https://"
                error={error("googleScholar")}
              >
                <Input
                  id="googleScholar"
                  type="url"
                  value={values.googleScholar}
                  onChange={(event) => setField("googleScholar", event.target.value)}
                  placeholder="https://scholar.google.com/citations?user=..."
                  aria-invalid={Boolean(error("googleScholar"))}
                />
              </FormField>
            </div>
          </section>
        </div>

        {/* ===== SIDEBAR AKSI ===== */}
        <aside className="space-y-4 xl:sticky xl:top-6">
          <section className="rounded-xl border bg-card p-4">
            <h2 className="mb-2 text-sm font-semibold">Simpan</h2>
            <p className="mb-3 text-xs text-muted-foreground">
              Pastikan nama, NIDN, dan jabatan sudah benar sebelum menyimpan.
            </p>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <SaveIcon />
              {isSubmitting
                ? "Menyimpan..."
                : isEditing
                  ? "Simpan perubahan"
                  : "Simpan dosen"}
            </Button>
            <Link
              href="/dashboard/sdm/dosen"
              className={`${buttonVariants({ variant: "outline" })} mt-2 w-full`}
            >
              Batal
            </Link>
          </section>

          {initial && (
            <section className="rounded-xl border bg-card p-4 text-xs text-muted-foreground">
              <h2 className="mb-2 text-sm font-semibold text-foreground">Riwayat data</h2>
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
  )
}