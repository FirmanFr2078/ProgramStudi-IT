"use client"

import { useMemo } from "react"
import {
  applyNodeChanges,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeChange,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { InfoIcon, Maximize2Icon, ZoomInIcon, ZoomOutIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { StrukturArah, StrukturPosisiAdmin } from "@/types"
import { useStrukturBoard } from "@/hooks/dashboard/struktur/use-struktur-board"
import { PosisiDialog } from "./posisi-dialog"
import { PosisiNode, type PosisiNodeData } from "./posisi-node"
import { TupoksiSection } from "./tupoksi-section"

const nodeTypes = { posisi: PosisiNode }

function buildGraph(
  posisi: StrukturPosisiAdmin[],
  handlers: { onEdit: (id: string) => void; onArah: (id: string, arah: StrukturArah) => void },
) {
  const nodes: Node<PosisiNodeData>[] = posisi.map((item) => ({
    id: item.id,
    type: "posisi",
    position: { x: item.posX, y: item.posY },
    data: { posisi: item, onEdit: handlers.onEdit, onArah: handlers.onArah },
    draggable: true,
  }))

  const edges: Edge[] = posisi
    .filter((item): item is StrukturPosisiAdmin & { parentId: string } => item.parentId !== null)
    .map((item) => ({
      id: `${item.parentId}-${item.id}`,
      source: item.parentId,
      target: item.id,
      type: "smoothstep",
    }))

  return { nodes, edges }
}

function BoardControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow()

  const buttonClassName =
    "flex size-8 items-center justify-center rounded-lg border bg-card text-muted-foreground shadow-sm transition-colors hover:border-primary/50 hover:text-primary"

  return (
    <Panel position="bottom-left" className="flex gap-1.5">
      <button type="button" title="Perbesar" aria-label="Perbesar" onClick={() => zoomIn()} className={buttonClassName}>
        <ZoomInIcon className="size-4" />
      </button>
      <button type="button" title="Perkecil" aria-label="Perkecil" onClick={() => zoomOut()} className={buttonClassName}>
        <ZoomOutIcon className="size-4" />
      </button>
      <button
        type="button"
        title="Kembalikan tampilan"
        aria-label="Kembalikan tampilan"
        onClick={() => fitView({ padding: 0.4, maxZoom: 1 })}
        className={buttonClassName}
      >
        <Maximize2Icon className="size-4" />
      </button>
    </Panel>
  )
}

export function StrukturBoard({ initialData }: { initialData: StrukturPosisiAdmin[] }) {
  const board = useStrukturBoard(initialData)

  const { nodes: builtNodes, edges } = useMemo(
    () => buildGraph(board.posisi, { onEdit: board.openEditDialog, onArah: board.openCreateDialog }),
    [board.posisi, board.openEditDialog, board.openCreateDialog],
  )

  function handleNodesChange(changes: NodeChange<Node<PosisiNodeData>>[]) {
    const updated = applyNodeChanges(changes, builtNodes)
    for (const change of changes) {
      if (change.type === "position" && change.dragging === false) {
        const node = updated.find((item) => item.id === change.id)
        if (node) board.movePosisiNode(node.id, Math.round(node.position.x), Math.round(node.position.y))
      }
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {board.errorMessage && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {board.errorMessage}
        </p>
      )}

      {board.isDirty && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2">
          <p className="text-sm text-amber-700 dark:text-amber-400">Ada perubahan struktur yang belum disimpan.</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" disabled={board.isSaving} onClick={board.discardDraft}>
              Batal
            </Button>
            <Button type="button" size="sm" disabled={board.isSaving} onClick={board.commitDraft}>
              {board.isSaving ? "Menyimpan..." : "Simpan Struktur"}
            </Button>
          </div>
        </div>
      )}

      <div className="bg-grid-board relative h-105 w-full overflow-hidden rounded-xl border bg-muted/10">
        <ReactFlowProvider>
          <ReactFlow
            nodes={builtNodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={handleNodesChange}
            fitView
            fitViewOptions={{ padding: 0.4, maxZoom: 1 }}
            minZoom={0.4}
            maxZoom={1.5}
            proOptions={{ hideAttribution: true }}
          >
            <BoardControls />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

      <div className="flex flex-wrap items-start gap-x-5 gap-y-1.5 rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <InfoIcon className="size-3.5 shrink-0" />
          Tombol (+) di tepi kartu = tambah posisi ke arah itu
        </span>
        <span>Klik kartu untuk mengubah datanya</span>
        <span>Tombol di pojok kiri bawah board = perbesar / perkecil / kembalikan tampilan</span>
        <span>Perubahan baru permanen setelah klik <strong className="text-foreground">Simpan Struktur</strong></span>
      </div>

      <TupoksiSection
        posisi={board.posisi}
        onAdd={board.addTupoksi}
        onUpdate={board.updateTupoksiItem}
        onDelete={board.deleteTupoksiItem}
      />

      <PosisiDialog
        dialog={board.dialog}
        posisi={board.posisi}
        dosenOptions={board.dosenOptions}
        isSaving={board.isSaving}
        onClose={board.closeDialog}
        onSubmit={board.submitPosisi}
        onDeletePosisi={board.deletePosisiNode}
      />
    </div>
  )
}