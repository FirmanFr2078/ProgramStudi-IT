"use client"

import { Handle, Position } from "@xyflow/react"
import { PlusIcon } from "lucide-react"
import { cn } from "cn"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/initials"
import type { StrukturArah, StrukturPosisiAdmin } from "@/types"

export type PosisiNodeData = {
  posisi: StrukturPosisiAdmin
  onEdit: (id: string) => void
  onArah: (id: string, arah: StrukturArah) => void
}

function ArahButton({
  arah,
  className,
  onClick,
}: {
  arah: StrukturArah
  className: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      title={`Tambah posisi ${arah}`}
      className={cn(
        "absolute z-10 flex size-6 items-center justify-center rounded-full border bg-background text-muted-foreground opacity-0 shadow-sm transition-opacity hover:text-primary group-hover:opacity-100",
        className,
      )}
      aria-label={`Tambah posisi ${arah}`}
    >
      <PlusIcon className="size-3.5" />
    </button>
  )
}

export function PosisiNode({ data }: { data: PosisiNodeData }) {
  const { posisi, onEdit, onArah } = data
  const namaTampil = posisi.dosenId ? posisi.dosenNama : posisi.nama

  return (
    <div className="group relative">
      {/* Atas & bawah selalu ada -- termasuk buat Kaprodi. Kiri/kanan cuma buat
          posisi selain Kaprodi (Kaprodi itu unik, nggak butuh "sejajar"). */}
      <ArahButton arah="atas" className="-top-3 left-1/2 -translate-x-1/2" onClick={() => onArah(posisi.id, "atas")} />
      <ArahButton arah="bawah" className="-bottom-3 left-1/2 -translate-x-1/2" onClick={() => onArah(posisi.id, "bawah")} />
      {!posisi.isKaprodi && (
        <>
          <ArahButton arah="kiri" className="top-1/2 -left-3 -translate-y-1/2" onClick={() => onArah(posisi.id, "kiri")} />
          <ArahButton arah="kanan" className="top-1/2 -right-3 -translate-y-1/2" onClick={() => onArah(posisi.id, "kanan")} />
        </>
      )}

      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />

      <button
        type="button"
        onClick={() => onEdit(posisi.id)}
        className={cn(
          "flex w-56 items-center gap-3 rounded-xl border bg-card px-3 py-2.5 text-left shadow-sm transition-colors hover:border-primary/50",
          posisi.isKaprodi && "border-primary/60 bg-primary/5",
        )}
      >
        <Avatar className="size-10 shrink-0 border">
          {posisi.dosenFoto && (
            <AvatarImage src={posisi.dosenFoto} alt={namaTampil ?? posisi.jabatan} className="object-cover object-top" />
          )}
          <AvatarFallback className="text-xs font-semibold">
            {namaTampil ? getInitials(namaTampil) : "?"}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{posisi.jabatan}</p>
          <p className="truncate text-xs text-muted-foreground">
            {namaTampil ?? "Belum diisi"}
            {posisi.dosenNidn && <span> · NIDN: {posisi.dosenNidn}</span>}
          </p>
        </div>
      </button>
    </div>
  )
}