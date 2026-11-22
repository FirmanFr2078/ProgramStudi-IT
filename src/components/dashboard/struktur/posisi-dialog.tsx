"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { KETUA_PROGRAM_STUDI } from "@/config/structural-roles"
import type { DialogState } from "@/hooks/dashboard/struktur/use-struktur-board"
import type { DosenAdmin, StrukturPosisiAdmin } from "@/types"

const ARAH_LABEL: Record<string, string> = { atas: "atas", bawah: "bawah", kiri: "kiri", kanan: "kanan" }

type FormValues = { sumber: "dosen" | "custom"; dosenId: string | null; nama: string; jabatan: string }
const EMPTY: FormValues = { sumber: "custom", dosenId: null, nama: "", jabatan: "" }

function toFormValues(posisi: StrukturPosisiAdmin | undefined): FormValues {
  if (!posisi) return EMPTY
  return {
    sumber: posisi.dosenId ? "dosen" : "custom",
    dosenId: posisi.dosenId,
    nama: posisi.nama ?? "",
    jabatan: posisi.jabatan,
  }
}

function countDescendants(all: StrukturPosisiAdmin[], id: string): number {
  const children = all.filter((item) => item.parentId === id)
  return children.reduce((sum, child) => sum + 1 + countDescendants(all, child.id), 0)
}

function PosisiForm({
  dialog,
  editing,
  posisi,
  dosenOptions,
  isSaving,
  onSubmit,
  onDeletePosisi,
  onClose,
}: {
  dialog: Extract<DialogState, { mode: "create" | "edit" }>
  editing: StrukturPosisiAdmin | undefined
  posisi: StrukturPosisiAdmin[]
  dosenOptions: DosenAdmin[]
  isSaving: boolean
  onSubmit: (values: { jabatan: string; dosenId: string | null; nama: string | null }) => void
  onDeletePosisi: (id: string) => void
  onClose: () => void
}) {
  const isKaprodi = editing?.isKaprodi ?? false
  const [values, setValues] = useState<FormValues>(() => (dialog.mode === "edit" ? toFormValues(editing) : EMPTY))

  const title =
    dialog.mode === "create" ? `Tambah posisi (${ARAH_LABEL[dialog.arah]})` : `Ubah posisi${editing ? ` — ${editing.jabatan}` : ""}`

  // Kaprodi: dosen yang bisa dipilih dibatasi cuma yang di SDM udah ditandai
  // jabatan struktural "Ketua Program Studi" -- biar nggak salah pilih orang.
  const availableDosen = isKaprodi
    ? dosenOptions.filter((dosen) => dosen.jabatanStruktural === KETUA_PROGRAM_STUDI)
    : dosenOptions

  function handleSubmit() {
    onSubmit({
      jabatan: isKaprodi ? KETUA_PROGRAM_STUDI : values.jabatan.trim(),
      dosenId: values.sumber === "dosen" ? values.dosenId : null,
      nama: values.sumber === "custom" ? values.nama.trim() || null : null,
    })
  }

  function handleDelete() {
    if (!editing) return
    const descendantCount = countDescendants(posisi, editing.id)
    const message =
      descendantCount > 0
        ? `Hapus "${editing.jabatan}"? ${descendantCount} posisi di bawahnya ikut terhapus.`
        : `Hapus "${editing.jabatan}"?`

    if (window.confirm(message)) {
      onDeletePosisi(editing.id)
      onClose()
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>

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
                {availableDosen.map((dosen) => (
                  <SelectItem key={dosen.id} value={dosen.id}>
                    {dosen.nama} — {dosen.nidn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isKaprodi && availableDosen.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Belum ada dosen yang ditandai Ketua &quout;Program Studi&rquout; di halaman SDM &gt; Dosen. Tandai dulu di sana, atau pakai mode Custom.
              </p>
            )}
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
            value={isKaprodi ? KETUA_PROGRAM_STUDI : values.jabatan}
            disabled={isKaprodi}
            onChange={(event) => setValues((prev) => ({ ...prev, jabatan: event.target.value }))}
            placeholder='Misal: "Koordinator PKL"'
          />
          {isKaprodi && <p className="text-xs text-muted-foreground">Jabatan Ketua Program Studi nggak bisa diubah di sini.</p>}
        </div>
      </div>

      <DialogFooter className="justify-between sm:justify-between">
        {dialog.mode === "edit" && editing && !editing.isKaprodi ? (
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Hapus posisi
          </Button>
        ) : (
          <span />
        )}

        <Button
          type="button"
          disabled={isSaving || (!isKaprodi && !values.jabatan.trim()) || (values.sumber === "dosen" && !values.dosenId)}
          onClick={handleSubmit}
        >
          {isSaving ? "Menyimpan..." : "Simpan"}
        </Button>
      </DialogFooter>
    </>
  )
}

export function PosisiDialog({
  dialog,
  posisi,
  dosenOptions,
  isSaving,
  onClose,
  onSubmit,
  onDeletePosisi,
}: {
  dialog: DialogState
  posisi: StrukturPosisiAdmin[]
  dosenOptions: DosenAdmin[]
  isSaving: boolean
  onClose: () => void
  onSubmit: (values: { jabatan: string; dosenId: string | null; nama: string | null }) => void
  onDeletePosisi: (id: string) => void
}) {
  const editing = dialog.mode === "edit" ? posisi.find((item) => item.id === dialog.posisiId) : undefined
  const isOpen = dialog.mode !== "closed"

  const formKey =
    dialog.mode === "edit"
      ? `edit-${dialog.posisiId}`
      : dialog.mode === "create"
        ? `create-${dialog.referenceId}-${dialog.arah}`
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
            isSaving={isSaving}
            onSubmit={onSubmit}
            onDeletePosisi={onDeletePosisi}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}