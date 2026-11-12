import type { ReactNode } from "react"
import { cn } from "cn"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type DashboardCardProps = {
  title: ReactNode
  description?: ReactNode
  media?: ReactNode // slot gambar/thumbnail di atas card, opsional
  children?: ReactNode // isi utama card (badge kategori, tanggal, dll)
  footerInfo?: ReactNode // mis. "Dibuat oleh ..." / "Diubah terakhir oleh ..."
  footerActions?: ReactNode // mis. tombol Edit/Hapus
  className?: string
}

/**
 * Kartu dasar buat semua modul dashboard. footerInfo & footerActions
 * SENGAJA opsional & independen satu sama lain -- combo-nya ada 3:
 * cuma info, cuma actions, atau keduanya. Footer-nya sendiri cuma
 * muncul kalau salah satu diisi, biar card read-only (tanpa aksi) ga
 * punya footer kosong yang aneh.
 */
export function DashboardCard({
  title,
  description,
  media,
  children,
  footerInfo,
  footerActions,
  className,
}: DashboardCardProps) {
  const hasFooter = Boolean(footerInfo || footerActions)

  return (
    <Card className={cn("flex h-full flex-col", className)}>
      {media}
      <CardHeader>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        {description && <CardDescription className="line-clamp-2">{description}</CardDescription>}
      </CardHeader>

      {children && <CardContent className="flex-1">{children}</CardContent>}

      {hasFooter && (
        <CardFooter className="flex items-center justify-between gap-2">
          <span className="truncate text-xs text-muted-foreground">{footerInfo}</span>
          {footerActions && <div className="flex shrink-0 gap-1">{footerActions}</div>}
        </CardFooter>
      )}
    </Card>
  )
}