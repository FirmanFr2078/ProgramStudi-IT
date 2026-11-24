"use client"

import { PlusIcon, UserIcon } from "lucide-react"
import { cn } from "cn"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { CreateTarget } from "@/hooks/dashboard/struktur/use-struktur-board"
import { getInitials } from "@/lib/initials"
import type { StrukturPosisiAdmin } from "@/types"

type Props = {
  posisi: StrukturPosisiAdmin
  hasChildren: boolean
  readOnly?: boolean
  onEdit?: (id: string) => void
  onCreate?: (target: CreateTarget) => void
}

/** (+) di tepi kartu: kotak putus-putus kecil, sengaja beda bentuk dari (+) bulat di garis. */
function CardPlus({ label, className, onClick }: { label: string; className: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      title={label}
      aria-label={label}
      className={cn(
        "absolute z-10 flex size-5 items-center justify-center rounded-md border border-dashed bg-background text-muted-foreground opacity-0 shadow-sm transition-opacity hover:text-primary focus-visible:opacity-100 group-hover:opacity-100",
        className,
      )}
    >
      <PlusIcon className="size-3" />
    </button>
  )
}

function kaprodiMessage(posisi: StrukturPosisiAdmin): string | null {
  if (posisi.kaprodiInvalid === "kosong") return "Invalid data jabatan Kaprodi"
  if (posisi.kaprodiInvalid === "ganda") return "Invalid: lebih dari satu Kaprodi"
  return null
}

export function PosisiNode({ posisi, hasChildren, readOnly = false, onEdit, onCreate }: Props) {
  const namaTampil = posisi.dosenId ? posisi.dosenNama : posisi.nama
  const invalidMessage = posisi.isKaprodi ? kaprodiMessage(posisi) : null
  const isRoot = posisi.parentId === null

  return (
    <div className="group relative h-full w-full">
      {!readOnly && onCreate && (
        <>
          {/* Atas: hanya untuk posisi paling atas -- di posisi lain sudah ada garis dari atasannya. */}
          {isRoot && (
            <CardPlus
              label="Tambah atasan"
              className="-top-2.5 left-1/2 -translate-x-1/2"
              onClick={() => onCreate({ kind: "above", referenceId: posisi.id })}
            />
          )}
          {/* Bawah: hanya kalau belum punya bawahan -- kalau sudah, garisnya sudah ada. */}
          {!hasChildren && (
            <CardPlus
              label="Tambah bawahan"
              className="-bottom-2.5 left-1/2 -translate-x-1/2"
              onClick={() => onCreate({ kind: "child", parentId: posisi.id })}
            />
          )}
          {/* Kiri/kanan: setara (satu baris). Kaprodi tidak punya, dan posisi paling atas belum punya atasan. */}
          {!posisi.isKaprodi && !isRoot && (
            <>
              <CardPlus
                label="Tambah setara di kiri"
                className="top-1/2 -left-2.5 -translate-y-1/2"
                onClick={() => onCreate({ kind: "side", referenceId: posisi.id, side: "kiri" })}
              />
              <CardPlus
                label="Tambah setara di kanan"
                className="top-1/2 -right-2.5 -translate-y-1/2"
                onClick={() => onCreate({ kind: "side", referenceId: posisi.id, side: "kanan" })}
              />
            </>
          )}
        </>
      )}

      <button
        type="button"
        disabled={readOnly}
        onClick={() => onEdit?.(posisi.id)}
        className={cn(
          "flex h-full w-full items-center gap-3 rounded-xl border bg-card px-3 text-left shadow-sm transition-colors enabled:hover:border-primary/50 disabled:cursor-default",
          posisi.isKaprodi && "border-primary/60 bg-primary/5",
          invalidMessage && "border-destructive/50 bg-destructive/5",
        )}
      >
        <Avatar className="size-10 shrink-0 border">
          {posisi.dosenFoto && (
            <AvatarImage src={posisi.dosenFoto} alt={namaTampil ?? posisi.jabatan} className="object-cover object-top" />
          )}
          <AvatarFallback className="text-xs font-semibold">
            {invalidMessage ? (
              <UserIcon className="size-4 text-muted-foreground" />
            ) : namaTampil ? (
              getInitials(namaTampil)
            ) : (
              "?"
            )}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{posisi.jabatan}</p>
          {invalidMessage ? (
            <p className="truncate text-xs font-medium text-destructive">{invalidMessage}</p>
          ) : (
            <p className="truncate text-xs text-muted-foreground">
              {namaTampil ?? "Belum diisi"}
              {posisi.dosenNidn && <span> · NIDN: {posisi.dosenNidn}</span>}
            </p>
          )}
        </div>
      </button>
    </div>
  )
}