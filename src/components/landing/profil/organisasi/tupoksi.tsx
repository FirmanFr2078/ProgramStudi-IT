import { Reveal } from "@/components/landing/reveal"
import type { OrgPosition } from "@/types"

export function Tupoksi({ items }: { items: OrgPosition[] }) {
  return (
    <section className="mx-auto max-w-6xl border-t border-border px-4 py-12 sm:px-6 md:py-16">
      <Reveal>
        <div>
          <p className="text-sm font-medium text-primary">Tupoksi</p>
          <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight sm:text-3xl">Peran dan tanggung jawab</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">Rincian berikut menjelaskan tanggung jawab tiap posisi dalam pengelolaan kegiatan akademik dan administrasi program studi.</p>
        </div>
      </Reveal>

      <div className="mt-10 md:mt-12">
        {items.map((item, index) => (
          <Reveal key={item.id} delay={index * 60}>
            <article className="grid gap-5 border-t border-border py-6 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
              <div>
                <p className="font-mono text-xs font-bold text-primary">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-heading font-semibold text-foreground">{item.jabatan}</h3>
                {item.nama && <p className="mt-1 text-sm text-muted-foreground">{item.nama}</p>}
              </div>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-border">
                {item.tupoksi.map((task) => <li key={task}>{task}</li>)}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}