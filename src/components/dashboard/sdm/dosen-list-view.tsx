"use client"

import Link from "next/link"
import { useState } from "react"
import { MailIcon, PencilIcon, Trash2Icon } from "lucide-react"

import { CardFooterRow } from "@/components/dashboard/shared/resource-card/card-footer-row"
import { ResourceList } from "@/components/dashboard/shared/resource-list"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDosenList } from "@/hooks/dashboard/sdm/use-dosen-list"
import { getInitials } from "@/lib/initials"
import { JABATAN_FUNGSIONAL, type DosenAdmin } from "@/types"

const SEMUA = "Semua"

function attributionText(item: DosenAdmin) {
  if (item.updatedBy) return `Diubah terakhir oleh ${item.updatedBy.nama}`
  if (item.createdBy) return `Dibuat oleh ${item.createdBy.nama}`
  return "Belum ada riwayat"
}

export function DosenListView() {
  const { data, isLoading, errorMessage, deletingId, deleteDosen } = useDosenList()
  const [jabatan, setJabatan] = useState<string>(SEMUA)

  const items = jabatan === SEMUA ? data : data.filter((item) => item.jabatanFungsional === jabatan)

  if (isLoading) {
    return <p className="py-16 text-center text-sm text-muted-foreground">Memuat data...</p>
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
        searchPlaceholder="Cari nama, NIDN, email, atau keahlian..."
        searchFilter={(item, q) =>
          item.nama.toLowerCase().includes(q) ||
          item.nidn.includes(q) ||
          item.email.toLowerCase().includes(q) ||
          item.bidangKeahlian.some((bidang) => bidang.toLowerCase().includes(q))
        }
        filterSlot={
          <Select value={jabatan} onValueChange={(value) => value && setJabatan(value)}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SEMUA}>Semua jabatan</SelectItem>
              {JABATAN_FUNGSIONAL.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
        addHref="/dashboard/sdm/dosen/tambah"
        addLabel="Tambah Dosen"
        emptyMessage="Belum ada data dosen."
        onDelete={(item) => deleteDosen(item.id)}
        getDeleteLabel={(item) => item.nama}
        renderCard={(item, { requestDelete }) => (
          <Card size="sm" className="h-full gap-0">
            <div className="flex items-start gap-3 px-(--card-spacing) pt-1 pb-3">
              <Avatar className="size-14 shrink-0">
                {item.foto && (
                  <AvatarImage src={item.foto} alt={`Foto ${item.nama}`} className="object-top" />
                )}
                <AvatarFallback className="font-bold">{getInitials(item.nama)}</AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-1 text-sm leading-snug font-semibold" title={item.nama}>
                  {item.nama}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                  {item.jabatanStruktural ?? "Dosen"}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <Badge variant="secondary">{item.jabatanFungsional}</Badge>
                  <Badge variant="outline">NIDN {item.nidn}</Badge>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-1 px-(--card-spacing) pb-3 text-xs text-muted-foreground">
              <p className="line-clamp-2">{item.bidangKeahlian.join(" · ")}</p>
              <p className="flex items-center gap-1.5">
                <MailIcon className="size-3 shrink-0" />
                <span className="truncate">{item.email}</span>
              </p>
            </div>

            <CardFooterRow
              label={attributionText(item)}
              actions={
                <>
                  <Link
                    href={`/dashboard/sdm/dosen/${item.id}/edit`}
                    aria-label={`Edit ${item.nama}`}
                    className={buttonVariants({ variant: "ghost", size: "icon-xs" })}
                  >
                    <PencilIcon />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Hapus ${item.nama}`}
                    disabled={deletingId === item.id}
                    onClick={requestDelete}
                  >
                    <Trash2Icon />
                  </Button>
                </>
              }
            />
          </Card>
        )}
      />
    </div>
  )
}