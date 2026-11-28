"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, PencilIcon, PlusIcon, Trash2Icon, UploadIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/dashboard/shared/confirm-dialog";
import { useFasilitasAlat } from "@/hooks/dashboard/fasilitas/use-fasilitas-alat";
import { useFasilitasBerkas } from "@/hooks/dashboard/fasilitas/use-fasilitas-berkas";
import {
  JENIS_BERKAS_FASILITAS,
  JENIS_BERKAS_FOTO,
  KEPEMILIKAN_ASET,
  KONDISI_ASET,
  AlatInput,
  type AlatAdmin,
  type FasilitasAdmin,
  type JenisBerkasFasilitas,
} from "@/types";

const EMPTY_ALAT: Omit<AlatInput, "fasilitasId"> = {
  nama: "",
  jumlahUnit: 1,
  tahunPerolehan: null,
  kepemilikan: "Milik Sendiri",
  kondisi: "Baik",
  spesifikasi: null,
  tampilPublik: true,
};

function AlatPanel({ fasilitasId, initial }: { fasilitasId: string; initial: AlatAdmin[] }) {
  const { data, isSaving, errorMessage, fieldErrors, addAlat, editAlat, removeAlat } =
    useFasilitasAlat(fasilitasId, initial);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_ALAT);
  const [pendingDelete, setPendingDelete] = useState<AlatAdmin | null>(null);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_ALAT);
    setOpen(true);
  }

  function openEdit(item: AlatAdmin) {
    setEditingId(item.id);
    setForm({
      nama: item.nama,
      jumlahUnit: item.jumlahUnit,
      tahunPerolehan: item.tahunPerolehan,
      kepemilikan: item.kepemilikan,
      kondisi: item.kondisi,
      spesifikasi: item.spesifikasi,
      tampilPublik: item.tampilPublik,
    });
    setOpen(true);
  }

  async function handleSubmit() {
    const ok = editingId ? await editAlat(editingId, form) : await addAlat(form);
    if (ok) setOpen(false);
  }

  return (
    <div className="space-y-3">
      {errorMessage && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <div className="flex justify-end">
        <Button size="sm" onClick={openCreate}>
          <PlusIcon /> Tambah Alat
        </Button>
      </div>

      {data.length === 0 ? (
        <p className="rounded-xl border py-10 text-center text-sm text-muted-foreground">
          Belum ada alat tercatat.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Tahun</TableHead>
              <TableHead>Kepemilikan</TableHead>
              <TableHead>Kondisi</TableHead>
              <TableHead>Publik</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nama}</TableCell>
                <TableCell>{item.jumlahUnit}</TableCell>
                <TableCell>{item.tahunPerolehan ?? "-"}</TableCell>
                <TableCell>{item.kepemilikan}</TableCell>
                <TableCell>
                  <Badge variant={item.kondisi === "Baik" ? "default" : "secondary"}>
                    {item.kondisi}
                  </Badge>
                </TableCell>
                <TableCell>{item.tampilPublik ? "Ya" : "Tidak"}</TableCell>
                <TableCell className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon-xs" onClick={() => openEdit(item)}>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Alat" : "Tambah Alat"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Nama alat</Label>
              <Input
                value={form.nama}
                onChange={(e) => setForm((p) => ({ ...p, nama: e.target.value }))}
              />
              {fieldErrors.nama && (
                <p className="text-xs text-destructive">{fieldErrors.nama[0]}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Jumlah unit</Label>
                <Input
                  type="number"
                  value={form.jumlahUnit}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, jumlahUnit: Number(e.target.value) || 1 }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Tahun perolehan</Label>
                <Input
                  type="number"
                  value={form.tahunPerolehan ?? ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      tahunPerolehan: e.target.value === "" ? null : Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Kepemilikan</Label>
                <Select
                  value={form.kepemilikan}
                  onValueChange={(v) =>
                    v && setForm((p) => ({ ...p, kepemilikan: v as typeof p.kepemilikan }))
                  }
                >
                  <SelectTrigger className="w-full">
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
              </div>
              <div className="space-y-1">
                <Label>Kondisi</Label>
                <Select
                  value={form.kondisi}
                  onValueChange={(v) =>
                    v && setForm((p) => ({ ...p, kondisi: v as typeof p.kondisi }))
                  }
                >
                  <SelectTrigger className="w-full">
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
              </div>
            </div>
            <div className="space-y-1">
              <Label>Spesifikasi (opsional)</Label>
              <Input
                value={form.spesifikasi ?? ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, spesifikasi: e.target.value || null }))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={form.tampilPublik}
                onCheckedChange={(checked) =>
                  setForm((p) => ({ ...p, tampilPublik: checked === true }))
                }
              />
              <Label className="text-sm font-normal">Tampilkan di ringkasan publik</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button disabled={isSaving} onClick={handleSubmit}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={pendingDelete ? `Hapus alat "${pendingDelete.nama}"?` : undefined}
        onConfirm={async () => {
          if (pendingDelete) await removeAlat(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

function BerkasPanel({
  fasilitasId,
  initial,
}: {
  fasilitasId: string;
  initial: FasilitasAdmin["berkas"];
}) {
  const { data, isSaving, errorMessage, addBerkas, removeBerkas } = useFasilitasBerkas(
    fasilitasId,
    initial,
  );
  const [jenis, setJenis] = useState<JenisBerkasFasilitas>("Foto");
  const [label, setLabel] = useState("");
  const [pendingDelete, setPendingDelete] = useState<(typeof data)[number] | null>(null);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !label.trim()) return;
    const ok = await addBerkas({ file, jenis, label: label.trim() });
    if (ok) setLabel("");
  }

  const galeri = data.filter((item) => JENIS_BERKAS_FOTO.includes(item.jenis));
  const dokumen = data.filter((item) => !JENIS_BERKAS_FOTO.includes(item.jenis));

  return (
    <div className="space-y-5">
      {errorMessage && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <div className="flex flex-wrap items-end gap-2 rounded-xl border p-3">
        <div className="space-y-1">
          <Label className="text-xs">Jenis</Label>
          <Select value={jenis} onValueChange={(v) => v && setJenis(v as JenisBerkasFasilitas)}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {JENIS_BERKAS_FASILITAS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-1">
          <Label className="text-xs">Label</Label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="mis. Tampak depan lab"
          />
        </div>
        <label className={buttonVariants({ variant: "outline" }) + " cursor-pointer"}>
          <UploadIcon />
          {isSaving ? "Mengunggah..." : "Unggah"}
          <input
            type="file"
            className="hidden"
            accept={jenis === "Foto" ? "image/jpeg,image/png,image/webp" : "application/pdf"}
            disabled={!label.trim() || isSaving}
            onChange={handleUpload}
          />
        </label>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Galeri foto</h3>
        {galeri.length === 0 ? (
          <p className="rounded-xl border py-8 text-center text-sm text-muted-foreground">
            Belum ada foto.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {galeri.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-lg border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.label} className="aspect-video w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-background/90 px-2 py-1">
                  <span className="truncate text-xs">{item.label}</span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setPendingDelete(item)}
                  >
                    <Trash2Icon className="text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Dokumen</h3>
        {dokumen.length === 0 ? (
          <p className="rounded-xl border py-8 text-center text-sm text-muted-foreground">
            Belum ada dokumen.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dokumen.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <a href={item.url} target="_blank" rel="noreferrer" className="underline">
                      {item.label}
                    </a>
                  </TableCell>
                  <TableCell>{item.jenis}</TableCell>
                  <TableCell className="text-right">
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

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={pendingDelete ? `Hapus "${pendingDelete.label}"?` : undefined}
        onConfirm={async () => {
          if (pendingDelete) await removeBerkas(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

export function FasilitasDetailView({ fasilitas }: { fasilitas: FasilitasAdmin }) {
  const [tab, setTab] = useState<"alat" | "berkas">("alat");

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link
            href="/dashboard/fasilitas"
            className="mb-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:underline"
          >
            <ArrowLeftIcon className="size-3" /> Kembali ke daftar
          </Link>
          <h1 className="text-xl font-bold">{fasilitas.nama}</h1>
          <p className="text-sm text-muted-foreground">
            {fasilitas.kategori}
            {fasilitas.gedungNama ? ` · ${fasilitas.gedungNama}` : ""}
          </p>
        </div>
        <Link
          href={`/dashboard/fasilitas/${fasilitas.id}/edit`}
          className={buttonVariants({ variant: "outline" })}
        >
          <PencilIcon /> Edit data utama
        </Link>
      </div>

      <div className="flex gap-2 border-b">
        <button
          type="button"
          onClick={() => setTab("alat")}
          className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
            tab === "alat"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Alat ({fasilitas.alat.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("berkas")}
          className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
            tab === "berkas"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Galeri & Dokumen ({fasilitas.berkas.length})
        </button>
      </div>

      {tab === "alat" ? (
        <AlatPanel fasilitasId={fasilitas.id} initial={fasilitas.alat} />
      ) : (
        <BerkasPanel fasilitasId={fasilitas.id} initial={fasilitas.berkas} />
      )}
    </div>
  );
}