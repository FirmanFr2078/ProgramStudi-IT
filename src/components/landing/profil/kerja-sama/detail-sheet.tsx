"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import type { Mitra } from "@/types"

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  })
}

export function DetailMitraSheet({
  mitra,
  onClose,
}: {
  mitra: Mitra | null
  onClose: () => void
}) {
  return (
    <Sheet open={!!mitra} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="overflow-y-auto">
        {mitra && (
          <>
            <SheetHeader>
              <p className="font-mono text-[11px] tracking-wider text-lavender uppercase">
                {mitra.kategori}
              </p>
              <SheetTitle>{mitra.nama}</SheetTitle>
              <SheetDescription>{mitra.ringkasan}</SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-5 px-4 pb-6">
              <div className="flex flex-wrap gap-1.5">
                {mitra.lingkup.map((l) => (
                  <span
                    key={l}
                    className="rounded-full bg-accent px-2.5 py-1 text-xs text-lavender"
                  >
                    {l}
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                {mitra.deskripsi.map((p, i) => (
                  <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>

              <dl className="flex flex-col gap-2 border-t pt-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Mulai kerja sama</dt>
                  <dd>{formatTanggal(mitra.mulai)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>
                    {mitra.berakhir
                      ? `Berakhir ${formatTanggal(mitra.berakhir)}`
                      : "Masih berjalan"}
                  </dd>
                </div>
                {mitra.pic && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Kontak</dt>
                    <dd className="text-right">{mitra.pic}</dd>
                  </div>
                )}
              </dl>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}