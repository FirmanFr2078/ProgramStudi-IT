"use client"

import { InfoIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { availableDosenOptions, useStrukturBoard } from "@/hooks/dashboard/struktur/use-struktur-board"
import type { StrukturPosisiAdmin } from "@/types"
import { PosisiDialog } from "./posisi-dialog"
import { StrukturCanvas } from "./struktur-canvas"
import { TupoksiSection } from "./tupoksi-section"

function BoardInfo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className="flex size-7 items-center justify-center rounded-full border bg-card text-muted-foreground shadow-sm transition-colors hover:text-primary"
          aria-label="Keterangan board"
        >
          <InfoIcon className="size-3.5" />
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-64 text-left">
          <div className="space-y-1">
            <p>
              <strong>+ kotak di tepi kartu</strong> : tambah atasan, bawahan, atau posisi setara (kiri/kanan)
            </p>
            <p>
              <strong>+ bulat di garis</strong> : sisipkan posisi atau level baru
            </p>
            <p>klik kartu : ubah data posisi</p>
            <p>seret latar : geser · Ctrl + scroll : zoom</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function StrukturBoard({ initialData }: { initialData: StrukturPosisiAdmin[] }) {
  const board = useStrukturBoard(initialData)
  const editingId = board.dialog.mode === "edit" ? board.dialog.posisiId : null

  return (
    <div className="flex flex-col gap-3">
      {board.errorMessage && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {board.errorMessage}
        </p>
      )}

      <StrukturCanvas
        posisi={board.posisi}
        onEdit={board.openEditDialog}
        onCreate={board.openCreateDialog}
        className="bg-board-glow h-105 w-full rounded-xl border bg-muted/10"
        topRight={<BoardInfo />}
        bottomRight={
          <>
            {board.isDirty && (
              <Button type="button" variant="outline" size="sm" disabled={board.isSaving} onClick={board.discardDraft}>
                Batal
              </Button>
            )}
            <Button type="button" size="sm" disabled={!board.isDirty || board.isSaving} onClick={board.commitDraft}>
              {board.isSaving ? "Menyimpan..." : "Simpan Struktur"}
            </Button>
          </>
        }
      />

      <TupoksiSection
        posisi={board.posisi}
        onAdd={board.addTupoksi}
        onUpdate={board.updateTupoksiItem}
        onDelete={board.deleteTupoksiItem}
      />

      <PosisiDialog
        dialog={board.dialog}
        posisi={board.posisi}
        dosenOptions={availableDosenOptions(board.dosenOptions, board.posisi, editingId)}
        onClose={board.closeDialog}
        onSubmit={board.submitPosisi}
        onDelete={(id, mode) => {
          board.deletePosisiNode(id, mode)
          board.closeDialog()
        }}
      />
    </div>
  )
}