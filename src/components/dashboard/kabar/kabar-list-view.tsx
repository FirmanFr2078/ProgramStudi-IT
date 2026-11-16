"use client";

import Link from "next/link";
import { useState } from "react";
import { PencilIcon, Trash2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ResourceCardMedia } from "@/components/dashboard/shared/resource-card/resource-card-media";
import { ResourceList } from "@/components/dashboard/shared/resource-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useKabarList } from "@/hooks/dashboard/kabar/use-kabar-list";
import type { KabarAdmin } from "@/types";

const KATEGORI_OPTIONS = ["Semua", "Berita", "Pengumuman"] as const;

function attributionText(item: KabarAdmin) {
  if (item.updatedBy) return `Diubah terakhir oleh ${item.updatedBy.nama}`;
  if (item.createdBy) return `Dibuat oleh ${item.createdBy.nama}`;
  return null;
}

export function KabarListView() {
  const { data, isLoading, errorMessage, deletingId, deleteKabar } =
    useKabarList();
  const [kategori, setKategori] =
    useState<(typeof KATEGORI_OPTIONS)[number]>("Semua");

  const items =
    kategori === "Semua"
      ? data
      : data.filter((item) => item.kategori === kategori);

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
        searchPlaceholder="Cari judul atau ringkasan..."
        searchFilter={(item, q) =>
          item.judul.toLowerCase().includes(q) ||
          item.ringkasan.toLowerCase().includes(q) ||
          item.slug.toLowerCase().includes(q)
        }
        filterSlot={
          <Select
            value={kategori}
            onValueChange={(v) => setKategori(v as typeof kategori)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {KATEGORI_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
        addHref="/dashboard/kabar/tambah"
        addLabel="Tambah Kabar"
        emptyMessage="Belum ada kabar."
        onDelete={(item) => deleteKabar(item.id)}
        getDeleteLabel={(item) => item.judul}
        renderCard={(item, { requestDelete }) => (
          <ResourceCardMedia
            image={item.gambar}
            imageAlt={item.judul}
            title={item.judul}
            description={item.ringkasan}
            badge={
              <Badge
                variant={
                  item.kategori === "Pengumuman" ? "secondary" : "default"
                }
              >
                {item.kategori}
              </Badge>
            }
            footerLabel={attributionText(item)}
            footerActions={
              <>
                <Link
                  href={`/dashboard/kabar/${item.id}/edit`}
                  className={buttonVariants({
                    variant: "ghost",
                    size: "icon-xs",
                  })}
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
