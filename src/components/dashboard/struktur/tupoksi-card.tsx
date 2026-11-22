"use client"

import { useState } from "react"
import { PlusIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { StrukturPosisiAdmin } from "@/types"

export function TupoksiCard({
  posisi,
  onAdd,
  onUpdate,
  onDelete,
}: {
  posisi: StrukturPosisiAdmin
  onAdd: (posisiId: string, isi: string) => void
  onUpdate: (id: string, isi: string) => void
  onDelete: (id: string) => void
}) {
  const [draft, setDraft] = useState("")

  function handleAdd() {
    const isi = draft.trim()
    if (!isi) return
    onAdd(posisi.id, isi)
    setDraft("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{posisi.jabatan}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {posisi.tupoksi.length === 0 && <p className="text-sm text-muted-foreground">Belum ada poin tupoksi.</p>}

        <ul className="space-y-1.5">
          {posisi.tupoksi.map((item) => (
            <TupoksiRow key={item.id} id={item.id} isi={item.isi} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </ul>

        <div className="flex gap-2 pt-1">
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                handleAdd()
              }
            }}
            placeholder="Tambah poin tupoksi..."
            className="h-8"
          />
          <Button type="button" size="icon-sm" variant="outline" disabled={!draft.trim()} onClick={handleAdd}>
            <PlusIcon />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function TupoksiRow({
  id,
  isi,
  onUpdate,
  onDelete,
}: {
  id: string
  isi: string
  onUpdate: (id: string, isi: string) => void
  onDelete: (id: string) => void
}) {
  const [value, setValue] = useState(isi)

  return (
    <li className="flex items-start gap-2">
      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => {
          if (value.trim() && value.trim() !== isi) onUpdate(id, value.trim())
        }}
        className="h-8 flex-1 border-transparent bg-transparent px-2 shadow-none hover:border-input focus-visible:border-ring"
      />
      <Button type="button" size="icon-sm" variant="ghost" onClick={() => onDelete(id)}>
        <Trash2Icon className="text-muted-foreground" />
      </Button>
    </li>
  )
}