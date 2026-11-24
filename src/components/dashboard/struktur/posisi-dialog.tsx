"use client"

import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "cn"
import type { DialogState, PosisiFormValues } from "@/hooks/dashboard/struktur/use-struktur-board"
import { canBeLurus, idsRemoved, planDelete, type DeleteMode, type Jalur } from "@/lib/struktur-tree"
import { STRUKTUR_MAX_JARAK_KOSONG } from "@/types"
import type { DosenAdmin, StrukturPosisiAdmin } from "@/types"

type FormValues = { sumber: "dosen" | "custom"; dosenId: string | null; nama: string; jabatan: string; jalur: Jalur; jarakKosong: number }
type WizardMode = "tembus" | "tiga"

const JALUR_LABEL: Record<Jalur, string> = {
  lurus: "Lurus (di garis utama)",
  kiri: "Kiri (di sisi kiri garis)",
  kanan: "Kanan (di sisi kanan garis)",
}

const JALUR_HINT: Record<Jalur, string> = {
  lurus: "Tepat di bawah atasannya, di garis utama. Hanya satu per baris, dan hanya di baris terakhir.",
  kiri: "Di sisi kiri garis utama, selevel dengan kartu lain di baris yang sama.",
  kanan: "Di sisi kanan garis utama, selevel dengan kartu lain di baris yang sama.",
}

function toFormValues(posisi: StrukturPosisiAdmin | undefined): FormValues {
  if (!posisi) return { sumber: "custom", dosenId: null, nama: "", jabatan: "", jalur: "lurus", jarakKosong: 0 }
  return {
    sumber: posisi.dosenId ? "dosen" : "custom",
    dosenId: posisi.dosenId,
    nama: posisi.nama ?? "",
    jabatan: posisi.jabatan,
    jalur: posisi.jalur,
    jarakKosong: posisi.jarakKosong,
  }
}

function dialogTitle(dialog: DialogState, editing: StrukturPosisiAdmin | undefined): string {
  if (dialog.mode === "edit") return `Ubah posisi${editing ? ` — ${editing.jabatan}` : ""}`
  if (dialog.mode !== "create") return ""
  switch (dialog.target.kind) {
    case "child":
      return "Tambah bawahan"
    case "side":
      return dialog.target.side === "kiri" ? "Tambah posisi setara (kiri)" : "Tambah posisi setara (kanan)"
    case "spine":
      return "Sisipkan posisi / level di garis"
    case "skip":
      return "Sisipkan posisi di baris kosong"
    case "above":
      return "Tambah atasan"
  }
}

// ============================================================
// HAPUS
// ============================================================

function DeleteChoice({
  editing,
  posisi,
  onConfirm,
  onCancel,
}: {
  editing: StrukturPosisiAdmin
  posisi: StrukturPosisiAdmin[]
  onConfirm: (mode: DeleteMode) => void
  onCancel: () => void
}) {
  const plan = planDelete(posisi, editing.id)
  const [mode, setMode] = useState<DeleteMode>("cascade")

  const needsChoice = plan.otherChildIds.length > 0
  const cascadeCount = Math.max(0, idsRemoved(posisi, editing.id, "cascade").length - 1)

  if (!needsChoice) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Hapus &quot;{editing.jabatan}&quot;?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {plan.pathChildId
            ? "Posisi di bawahnya (jalur menuju Ketua Program Studi) otomatis tersambung ke atasannya."
            : "Posisi ini tidak punya bawahan."}
        </p>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="button" variant="destructive" onClick={() => onConfirm("cascade")}>
            Hapus
          </Button>
        </DialogFooter>
      </>
    )
  }

  const options: { value: DeleteMode; title: string; description: string; disabled: boolean }[] = [
    {
      value: "cascade",
      title: "Hapus beserta turunannya",
      description:
        cascadeCount > 0
          ? `${cascadeCount} posisi di bawahnya ikut terhapus.`
          : "Hanya posisi ini yang terhapus.",
      disabled: false,
    },
    {
      value: "promote",
      title: "Naikkan turunannya",
      description: plan.canPromote
        ? "Bawahan langsungnya menggantikan tempat posisi ini."
        : "Tidak bisa: posisi ini paling atas dan tidak ada atasan untuk menampung bawahannya.",
      disabled: !plan.canPromote,
    },
  ]

  return (
    <>
      <DialogHeader>
        <DialogTitle>Hapus &quot;{editing.jabatan}&quot;?</DialogTitle>
      </DialogHeader>

      {plan.pathChildId && (
        <p className="text-sm text-muted-foreground">
          Jalur menuju Ketua Program Studi selalu dipertahankan dan tersambung otomatis.
        </p>
      )}

      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={option.disabled}
            onClick={() => setMode(option.value)}
            className={cn(
              "w-full rounded-lg border px-3 py-2.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              mode === option.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
            )}
          >
            <p className="text-sm font-medium">{option.title}</p>
            <p className="text-xs text-muted-foreground">{option.description}</p>
          </button>
        ))}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="button" variant="destructive" onClick={() => onConfirm(mode)}>
          Hapus
        </Button>
      </DialogFooter>
    </>
  )
}

// ============================================================
// KARTU KAPRODI (hanya info -- datanya diambil dari modul Dosen)
// ============================================================

function KaprodiInfo({ editing, onClose }: { editing: StrukturPosisiAdmin; onClose: () => void }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Ketua Program Studi</DialogTitle>
      </DialogHeader>

      <div className="space-y-3 text-sm">
        <p className="text-muted-foreground">
          Kartu ini diambil otomatis dari dosen yang jabatan strukturalnya &quot;Ketua Program Studi&quot;, jadi tidak
          diubah dari sini.
        </p>

        {editing.kaprodiInvalid === "kosong" && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive">
            Belum ada dosen yang ditandai sebagai Ketua Program Studi.
          </p>
        )}
        {editing.kaprodiInvalid === "ganda" && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive">
            Ada lebih dari satu dosen yang ditandai sebagai Ketua Program Studi. Sisakan satu saja.
          </p>
        )}
        {!editing.kaprodiInvalid && editing.dosenNama && (
          <p>
            <span className="font-medium">{editing.dosenNama}</span>
            {editing.dosenNidn && <span className="text-muted-foreground"> · NIDN: {editing.dosenNidn}</span>}
          </p>
        )}

        <Link href="/dashboard/sdm/dosen" className="inline-block text-primary underline underline-offset-4">
          Buka menu Dosen
        </Link>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Tutup
        </Button>
      </DialogFooter>
    </>
  )
}

// ============================================================
// WIZARD MODE (langkah 1 dari 2) -- cuma untuk "child" dan "spine",
// karena cuma 2 target itu yang SELALU membuat baris/level baru dari nol.
// ============================================================

function ModeWizard({ onPick }: { onPick: (mode: WizardMode) => void }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Pilih mode baris baru</DialogTitle>
      </DialogHeader>
      <p className="text-xs text-muted-foreground">Langkah 1 dari 2</p>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => onPick("tembus")}
          className="w-full rounded-lg border border-border px-3 py-3 text-left transition-colors hover:border-primary/40"
        >
          <p className="text-sm font-medium">Tembus (lewati level ini)</p>
          <p className="text-xs text-muted-foreground">
            Garis otoritas tetap lurus ke bawah walau cuma 1 sisi terisi. Baris ini selamanya tidak bisa punya kartu
            &quot;lurus&quot; di tengah.
          </p>
        </button>
        <button
          type="button"
          onClick={() => onPick("tiga")}
          className="w-full rounded-lg border border-border px-3 py-3 text-left transition-colors hover:border-primary/40"
        >
          <p className="text-sm font-medium">3 Posisi Terisi (isi tengah dulu)</p>
          <p className="text-xs text-muted-foreground">
            Kartu tengah dibuat lebih dulu. (+) kiri/kanan baru muncul setelah kartu tengah ada.
          </p>
        </button>
      </div>
    </>
  )
}

// ============================================================
// FORM
// ============================================================

function PosisiForm({
  dialog,
  editing,
  posisi,
  dosenOptions,
  onSubmit,
  onDelete,
  onClose,
}: {
  dialog: DialogState
  editing: StrukturPosisiAdmin | undefined
  posisi: StrukturPosisiAdmin[]
  dosenOptions: DosenAdmin[]
  onSubmit: (values: PosisiFormValues) => void
  onDelete: (id: string, mode: DeleteMode) => void
  onClose: () => void
}) {
  const [values, setValues] = useState<FormValues>(() => toFormValues(editing))
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [wizardMode, setWizardMode] = useState<WizardMode | null>(null)

  if (editing?.isKaprodi) {
    return <KaprodiInfo editing={editing} onClose={onClose} />
  }

  if (confirmingDelete && editing) {
    return (
      <DeleteChoice
        editing={editing}
        posisi={posisi}
        onConfirm={(mode) => onDelete(editing.id, mode)}
        onCancel={() => setConfirmingDelete(false)}
      />
    )
  }

  // "child"/"spine" SELALU bikin baris baru dari nol -> wajib wizard dulu, sebelum form.
  const needsWizard = dialog.mode === "create" && (dialog.target.kind === "child" || dialog.target.kind === "spine")
  if (needsWizard && !wizardMode) {
    return <ModeWizard onPick={setWizardMode} />
  }

  const isWizardTembus = needsWizard && wizardMode === "tembus"
  const isWizardTiga = needsWizard && wizardMode === "tiga"
  const isSkipTarget = dialog.mode === "create" && dialog.target.kind === "skip"

  // Jalur hanya ditanyakan kalau memang ada pilihan: bawahan pertama, sisip di garis, sisip di baris
  // kosong, atau ubah posisi.
  const showJalur =
    (dialog.mode === "create" && (dialog.target.kind === "child" || dialog.target.kind === "spine" || dialog.target.kind === "skip")) ||
    (dialog.mode === "edit" && !!editing && editing.parentId !== null)

  const lurusAllowed = dialog.mode === "edit" && editing ? editing.jalur === "lurus" || canBeLurus(posisi, editing.id) : true

  // Opsi jalur yang ditampilkan di Select, tergantung konteks dialog.
  const jalurOptions: Jalur[] = isWizardTiga
    ? [] // dipaksa "lurus", selector disembunyikan sama sekali
    : isWizardTembus || isSkipTarget
      ? ["kiri", "kanan"]
      : ["lurus", "kiri", "kanan"]
  const showJalurSelect = showJalur && jalurOptions.length > 0
  const selectValue = jalurOptions.includes(values.jalur) ? values.jalur : jalurOptions[0]

  function handleSubmit() {
    const jalurToSend: Jalur = isWizardTiga ? "lurus" : showJalurSelect ? selectValue : values.jalur
    onSubmit({
      jabatan: values.jabatan.trim(),
      dosenId: values.sumber === "dosen" ? values.dosenId : null,
      nama: values.sumber === "custom" ? values.nama.trim() || null : null,
      jalur: jalurToSend,
      jarakKosong: isWizardTembus ? values.jarakKosong : 0,
    })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{dialogTitle(dialog, editing)}</DialogTitle>
      </DialogHeader>
      {needsWizard && <p className="text-xs text-muted-foreground">Langkah 2 dari 2</p>}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Sumber</Label>
          <Select
            value={values.sumber}
            onValueChange={(value) => value && setValues((prev) => ({ ...prev, sumber: value as "dosen" | "custom" }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dosen">Ambil dari data dosen</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {values.sumber === "dosen" ? (
          <div className="space-y-1.5">
            <Label>Dosen</Label>
            <Select
              value={values.dosenId ?? ""}
              onValueChange={(value) => value && setValues((prev) => ({ ...prev, dosenId: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih dosen" />
              </SelectTrigger>
              <SelectContent>
                {dosenOptions.map((dosen) => (
                  <SelectItem key={dosen.id} value={dosen.id}>
                    {dosen.nama} — {dosen.nidn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-1.5">
            <Label htmlFor="posisi-nama">Nama (opsional)</Label>
            <Input
              id="posisi-nama"
              value={values.nama}
              onChange={(event) => setValues((prev) => ({ ...prev, nama: event.target.value }))}
              placeholder="Kosongkan kalau belum ada orangnya"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="posisi-jabatan">Jabatan</Label>
          <Input
            id="posisi-jabatan"
            value={values.jabatan}
            onChange={(event) => setValues((prev) => ({ ...prev, jabatan: event.target.value }))}
            placeholder='Misal: "Koordinator PKL"'
          />
        </div>

        {isWizardTiga && (
          <p className="rounded-lg border border-dashed px-3 py-2 text-xs text-muted-foreground">
            Kartu ini otomatis jadi kartu tengah (jalur &quot;lurus&quot;) karena dipilih mode 3 Posisi Terisi.
          </p>
        )}

        {showJalurSelect && (
          <div className="space-y-1.5">
            <Label>Jalur</Label>
            <Select
              value={selectValue}
              onValueChange={(value) => value && setValues((prev) => ({ ...prev, jalur: value as Jalur }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {jalurOptions.map((jalur) => (
                  <SelectItem key={jalur} value={jalur} disabled={jalur === "lurus" && !lurusAllowed}>
                    {JALUR_LABEL[jalur]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{JALUR_HINT[selectValue]}</p>
            {dialog.mode === "edit" && jalurOptions.includes("lurus") && !lurusAllowed && (
              <p className="text-xs text-muted-foreground">
                &quot;Lurus&quot; tidak tersedia: baris ini terkunci mode Tembus, sudah punya kartu lurus lain, atau
                bukan baris terakhir.
              </p>
            )}
          </div>
        )}

        {isWizardTembus && (
          <div className="space-y-1.5">
            <Label htmlFor="posisi-jarak-kosong">Lewati berapa baris kosong?</Label>
            <Input
              id="posisi-jarak-kosong"
              type="number"
              min={0}
              max={STRUKTUR_MAX_JARAK_KOSONG}
              value={values.jarakKosong}
              onChange={(event) => {
                const raw = Number(event.target.value)
                const clamped = Number.isFinite(raw) ? Math.max(0, Math.min(STRUKTUR_MAX_JARAK_KOSONG, Math.trunc(raw))) : 0
                setValues((prev) => ({ ...prev, jarakKosong: clamped }))
              }}
            />
            <p className="text-xs text-muted-foreground">
              0 = langsung di bawah atasan. Garis tetap lurus turun melewati baris kosong ini, dan tiap barisnya dapat
              titik sisip sendiri (bisa diisi belakangan).
            </p>
          </div>
        )}
      </div>

      <DialogFooter className="justify-between sm:justify-between">
        {dialog.mode === "edit" && editing ? (
          <Button type="button" variant="destructive" onClick={() => setConfirmingDelete(true)}>
            Hapus posisi
          </Button>
        ) : needsWizard ? (
          <Button type="button" variant="outline" onClick={() => setWizardMode(null)}>
            Kembali
          </Button>
        ) : (
          <span />
        )}

        <Button
          type="button"
          disabled={!values.jabatan.trim() || (values.sumber === "dosen" && !values.dosenId)}
          onClick={handleSubmit}
        >
          Simpan
        </Button>
      </DialogFooter>
    </>
  )
}

export function PosisiDialog({
  dialog,
  posisi,
  dosenOptions,
  onClose,
  onSubmit,
  onDelete,
}: {
  dialog: DialogState
  posisi: StrukturPosisiAdmin[]
  dosenOptions: DosenAdmin[]
  onClose: () => void
  onSubmit: (values: PosisiFormValues) => void
  onDelete: (id: string, mode: DeleteMode) => void
}) {
  const editing = dialog.mode === "edit" ? posisi.find((item) => item.id === dialog.posisiId) : undefined
  const isOpen = dialog.mode !== "closed"

  const formKey =
    dialog.mode === "edit"
      ? `edit-${dialog.posisiId}`
      : dialog.mode === "create"
        ? `create-${JSON.stringify(dialog.target)}`
        : "closed"

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {dialog.mode !== "closed" && (
          <PosisiForm
            key={formKey}
            dialog={dialog}
            editing={editing}
            posisi={posisi}
            dosenOptions={dosenOptions}
            onSubmit={onSubmit}
            onDelete={onDelete}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}