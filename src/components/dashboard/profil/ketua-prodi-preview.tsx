import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/initials"
import type { ProfilProdiSambutanDosen } from "@/types"

export function KetuaProdiPreview({
  ketuaProdi,
}: {
  ketuaProdi: ProfilProdiSambutanDosen | null
}) {
  if (!ketuaProdi) {
    return (
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-3 text-sm text-amber-700 dark:text-amber-400">
        <p className="font-medium">Ketua Program Studi belum ditetapkan.</p>

        <p className="mt-1 text-xs opacity-90">
          Buka menu SDM → Dosen, lalu atur jabatan struktural satu dosen menjadi
          <span className="font-semibold"> Ketua Program Studi</span>.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-muted/25 p-3">
      <div className="flex items-center gap-3">
        <Avatar className="size-14 shrink-0 border">
          {ketuaProdi.foto && (
            <AvatarImage
              src={ketuaProdi.foto}
              alt={`Foto ${ketuaProdi.nama}`}
              className="object-cover object-top"
            />
          )}

          <AvatarFallback className="font-semibold">
            {getInitials(ketuaProdi.nama)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {ketuaProdi.nama}
          </p>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {ketuaProdi.jabatanFungsional}{" "}
            <span aria-hidden="true">·</span>{" "}
            NIDN: {ketuaProdi.nidn}
          </p>

          <p className="mt-1 text-xs font-medium text-primary">
            {ketuaProdi.jabatanStruktural}
          </p>
        </div>
      </div>
    </div>
  )
}