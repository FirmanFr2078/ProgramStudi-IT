"use client"

import type { StrukturPosisiAdmin } from "@/types"
import { TupoksiCard } from "./tupoksi-card"

function sortByHierarchy(posisi: StrukturPosisiAdmin[]): StrukturPosisiAdmin[] {
  const byParent = new Map<string | null, StrukturPosisiAdmin[]>()
  for (const item of posisi) {
    const list = byParent.get(item.parentId) ?? []
    list.push(item)
    byParent.set(item.parentId, list)
  }
  for (const list of byParent.values()) list.sort((a, b) => a.urutan - b.urutan)

  const result: StrukturPosisiAdmin[] = []
  function visit(parentId: string | null) {
    for (const item of byParent.get(parentId) ?? []) {
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
  onAdd: (posisiId: string, isi: string) => Promise<unknown>
  onUpdate: (id: string, isi: string) => Promise<unknown>
  onDelete: (id: string) => Promise<void>
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