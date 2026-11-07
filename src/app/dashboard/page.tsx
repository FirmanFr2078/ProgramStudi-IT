import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = { title: "Ringkasan" }

const stats = [
  { label: "Berita", value: "[00]" },
  { label: "Dosen", value: "[00]" },
  { label: "Event mendatang", value: "[00]" },
]

export default function DashboardPage() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Ringkasan</h1>
          <p className="text-sm text-muted-foreground">
            Kelola konten website Program Studi Teknik Informatika.
          </p>
        </div>
        <Button className="glow">Tambah berita</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className="text-3xl text-lavender">{s.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  )
}