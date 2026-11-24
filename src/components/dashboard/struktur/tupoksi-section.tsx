"use client"

import { childrenOf } from "@/lib/struktur-tree"
import type { StrukturPosisiAdmin } from "@/types"
import { TupoksiCard } from "./tupoksi-card"

/** Urutan sesuai susunan di bagan: atasan dulu, lalu bawahannya baris demi baris, kiri ke kanan. */
function sortByHierarchy(posisi: StrukturPosisiAdmin[]): StrukturPosisiAdmin[] {
  const result: StrukturPosisiAdmin[] = []

  function visit(parentId: string | null) {
    for (const item of childrenOf(posisi, parentId)) {
      result.push(item)
      visit(item.id)
    }
  }

  visit(null)
  return result
}

export function TupoksiSection({
  posisi,
  onAdd,
  onUpdate,
  onDelete,
}: {
  posisi: StrukturPosisiAdmin[]
  onAdd: (posisiId: string, isi: string) => void
  onUpdate: (id: string, isi: string) => void
  onDelete: (id: string) => void
}) {
  const ordered = sortByHierarchy(posisi)

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Tupoksi</h2>
        <p className="text-sm text-muted-foreground">Tugas Pokok dan Fungsi tiap jabatan di atas.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {ordered.map((item) => (
          <TupoksiCard key={item.id} posisi={item} onAdd={onAdd} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}