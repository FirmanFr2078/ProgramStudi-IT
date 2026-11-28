"use client";

import { useState } from "react";
import { PencilIcon, SettingsIcon, Trash2Icon, PlusIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/dashboard/shared/confirm-dialog";
import { useKategoriFasilitas } from "@/hooks/dashboard/fasilitas/use-kategori-fasilitas";
import { slugify } from "@/hooks/dashboard/fasilitas/use-fasilitas-form";
import type { KategoriFasilitasRef } from "@/types";

const EMPTY_FORM = { slug: "", nama: "", urutan: 0, aktif: true };

export function KategoriManagerDialog({
  compact,
  onChange,
}: {
  compact?: boolean;
  onChange?: () => void;
}) {
  const {
    data,
    isLoading,
    errorMessage,
    fieldErrors,
    isSaving,
    createKategori,
    updateKategori,
    deleteKategori,
  } = useKategoriFasilitas();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [pendingDelete, setPendingDelete] =
    useState<KategoriFasilitasRef | null>(null);

  function startCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSlugTouched(false);
  }

  function startEdit(item: KategoriFasilitasRef) {
    setEditingId(item.id);
    setForm({
      slug: item.slug,
      nama: item.nama,
      urutan: item.urutan,
      aktif: item.aktif,
    });
    setSlugTouched(true);
  }

  async function handleSubmit() {
    const ok = editingId
      ? await updateKategori(editingId, form)
      : await createKategori(form);
    if (ok) {
      startCreate();
      onChange?.();
    }
  }

  async function handleDelete() {
    if (pendingDelete) {
      await deleteKategori(pendingDelete.id);
      onChange?.();
    }
    setPendingDelete(null);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          compact ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              title="Kelola kategori"
            >
              <SettingsIcon className="size-4" />
            </Button>
          ) : (
            <Button variant="outline">Kelola Kategori</Button>
          )
        }
      />
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Kategori Fasilitas</DialogTitle>
          <DialogDescription>
            Kategori menentukan halaman landing tempat fasilitas tampil (mis.
            Laboratorium, Ruang Kelas).
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </p>
        )}

        <div className="space-y-4">
          <div className="grid gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_auto_auto_auto]">
            <div className="space-y-1">
              <Label className="text-xs">Nama</Label>
              <Input
                value={form.nama}
                onChange={(e) => {
                  const nama = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    nama,
                    slug: slugTouched ? prev.slug : slugify(nama),
                  }));
                }}
                placeholder="mis. Laboratorium"
              />
              {fieldErrors.nama && (
                <p className="text-xs text-destructive">
                  {fieldErrors.nama[0]}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm((prev) => ({ ...prev, slug: e.target.value }));
                }}
                placeholder="laboratorium"
              />
              {fieldErrors.slug && (
                <p className="text-xs text-destructive">
                  {fieldErrors.slug[0]}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Urutan</Label>
              <Input
                type="number"
                className="w-20"
                value={form.urutan}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    urutan: Number(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="flex items-end gap-1.5 pb-1.5">
              <Checkbox
                checked={form.aktif}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, aktif: checked === true }))
                }
              />
              <Label className="text-xs">Aktif</Label>
            </div>
            <div className="flex items-end gap-1 pb-0.5">
              <Button size="sm" disabled={isSaving} onClick={handleSubmit}>
                {editingId ? (
                  "Simpan"
                ) : (
                  <>
                    <PlusIcon /> Tambah
                  </>
                )}
              </Button>
              {editingId && (
                <Button size="sm" variant="ghost" onClick={startCreate}>
                  Batal
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Memuat...
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Urutan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dipakai</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.nama}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {item.slug}
                    </TableCell>
                    <TableCell>{item.urutan}</TableCell>
                    <TableCell>
                      <Badge variant={item.aktif ? "default" : "outline"}>
                        {item.aktif ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.jumlahFasilitas} fasilitas</TableCell>
                    <TableCell className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => startEdit(item)}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setPendingDelete(item)}
                      >
                        <Trash2Icon className="text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={pendingDelete ? `Hapus kategori "${pendingDelete.nama}"?` : undefined}
        description="Kategori yang masih dipakai fasilitas tidak bisa dihapus."
        onConfirm={handleDelete}
      />
    </Dialog>
  );
}