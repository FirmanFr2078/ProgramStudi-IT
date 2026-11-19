"use client"

import { useMemo } from "react"
import {
  applyNodeChanges,
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
  type NodeChange,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

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
    <div className="flex flex-col gap-6">
      {board.errorMessage && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {board.errorMessage}
        </p>
      )}

      <div className="h-140 w-full overflow-hidden rounded-xl border bg-muted/20">
        <ReactFlowProvider>
          <ReactFlow
            nodes={builtNodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={handleNodesChange}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={24} />
            <Controls showInteractive={false} />
          </ReactFlow>
        </ReactFlowProvider>
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