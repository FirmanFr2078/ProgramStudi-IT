"use client";

import Link from "next/link";
import { useState } from "react";
import { PencilIcon, SettingsIcon, Trash2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResourceCardMedia } from "@/components/dashboard/shared/resource-card/resource-card-media";
import { ResourceList } from "@/components/dashboard/shared/resource-list";
import { KategoriManagerDialog } from "@/components/dashboard/fasilitas/kategori-manager-dialog";
import { useFasilitasList } from "@/hooks/dashboard/fasilitas/use-fasilitas-list";
import type { FasilitasAdmin, StatusFasilitas } from "@/types";

function statusVariant(status: StatusFasilitas) {
  if (status === "Aktif") return "default" as const;
  if (status === "Renovasi") return "secondary" as const;
  return "outline" as const;
}

function attributionText(item: FasilitasAdmin) {
  if (item.updatedBy) return `Diubah terakhir oleh ${item.updatedBy.nama}`;
  if (item.createdBy) return `Dibuat oleh ${item.createdBy.nama}`;
  return null;
}

export function FasilitasListView() {
  const { data, isLoading, errorMessage, deletingId, deleteFasilitas } =
    useFasilitasList();
  const [kategori, setKategori] = useState("Semua");

  const kategoriOptions = ["Semua", ...new Set(data.map((item) => item.kategori))];
  const items =
    kategori === "Semua" ? data : data.filter((item) => item.kategori === kategori);

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Memuat data...
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {errorMessage && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <ResourceList
        items={items}
        getItemId={(item) => item.id}
        searchPlaceholder="Cari nama fasilitas..."
        searchFilter={(item, q) =>
          item.nama.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q)
        }
        filterSlot={
          <div className="flex items-center gap-2">
            <Select value={kategori} onValueChange={(value) => setKategori(value ?? "Semua")}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {kategoriOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <KategoriManagerDialog />
          </div>
        }
        addHref="/dashboard/fasilitas/tambah"
        addLabel="Tambah Fasilitas"
        emptyMessage="Belum ada fasilitas."
        onDelete={(item) => deleteFasilitas(item.id)}
        getDeleteLabel={(item) => item.nama}
        renderCard={(item, { requestDelete }) => (
          <ResourceCardMedia
            image={item.foto}
            imageAlt={item.nama}
            title={item.nama}
            description={item.gedungNama ? `${item.gedungNama}${item.lantai ? ` · Lt. ${item.lantai}` : ""}` : item.lantai ?? undefined}
            badge={
              <div className="flex items-center gap-1">
                <Badge variant="outline">{item.kategori}</Badge>
                <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
                {!item.tampilPublik && <Badge variant="secondary">Draft</Badge>}
              </div>
            }
            footerLabel={attributionText(item)}
            footerActions={
              <>
                <Link
                  href={`/dashboard/fasilitas/${item.id}`}
                  className={buttonVariants({ variant: "ghost", size: "icon-xs" })}
                  title="Kelola alat & galeri"
                >
                  <SettingsIcon />
                </Link>
                <Link
                  href={`/dashboard/fasilitas/${item.id}/edit`}
                  className={buttonVariants({ variant: "ghost", size: "icon-xs" })}
                >
                  <PencilIcon />
                </Link>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  disabled={deletingId === item.id}
                  onClick={requestDelete}
                >
                  <Trash2Icon />
                </Button>
              </>
            }
          />
        )}
      />
    </div>
  );
}