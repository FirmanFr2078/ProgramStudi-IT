"use client"

import { useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import { PlusIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog"

type ManagedListProps<T> = {
  items: T[] // list yang SUDAH difilter parent kalau ada filter dropdown (lihat filterSlot)
  getItemId: (item: T) => string
  renderCard: (item: T, actions: { requestDelete: () => void }) => ReactNode
  searchPlaceholder?: string
  searchFilter: (item: T, query: string) => boolean // parent yang nentuin field mana yg dicari
  filterSlot?: ReactNode // slot dropdown filter (mis. kategori) -- dikontrol & diterapkan parent
  addHref?: string
  addLabel?: string
  onDelete?: (item: T) => Promise<void> | void
  getDeleteLabel?: (item: T) => string // buat judul dialog konfirmasi, mis. judul berita
  pageSize?: number
  emptyMessage?: string
  gridClassName?: string
}

/**
 * Pembungkus list buat semua modul dashboard: search + filter slot +
 * pagination + confirm-delete + render per-item via renderCard.
 * Bukan tabel -- setiap item dirender sbg kartu (lewat DashboardCard,
 * biasanya), karena konten tiap modul beda-beda bentuk (ada gambar,
 * ada yang nggak).
 */
export function ManagedList<T>({
  items,
  getItemId,
  renderCard,
  searchPlaceholder = "Cari...",
  searchFilter,
  filterSlot,
  addHref,
  addLabel = "Tambah",
  onDelete,
  getDeleteLabel,
  pageSize = 9,
  emptyMessage = "Belum ada data.",
  gridClassName = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
}: ManagedListProps<T>) {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<T | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? items.filter((item) => searchFilter(item, q)) : items
  }, [items, query, searchFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function handleSearchChange(value: string) {
    setQuery(value)
    setPage(1) // reset ke hal. 1 tiap query berubah -- biar ga nyasar ke halaman kosong
  }

  async function handleConfirmDelete() {
    if (!pendingDelete || !onDelete) return
    setIsDeleting(true)
    try {
      await onDelete(pendingDelete)
      setPendingDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9"
            />
          </div>
          {filterSlot}
        </div>

        {addHref && (
          <Button render={<Link href={addHref} />}>
            <PlusIcon className="size-4" />
            {addLabel}
          </Button>
        )}
      </div>

      {paged.length === 0 ? (
        <p className="rounded-2xl border py-16 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <div className={gridClassName}>
          {paged.map((item) => (
            <div key={getItemId(item)}>
              {renderCard(item, { requestDelete: () => setPendingDelete(item) })}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Sebelumnya
          </Button>
          <span className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Berikutnya
          </Button>
        </div>
      )}

      {onDelete && (
        <ConfirmDialog
          open={pendingDelete !== null}
          onOpenChange={(open) => !open && setPendingDelete(null)}
          title={pendingDelete ? `Hapus "${getDeleteLabel?.(pendingDelete) ?? ""}"?` : undefined}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        />
      )}
    </div>
  )
}