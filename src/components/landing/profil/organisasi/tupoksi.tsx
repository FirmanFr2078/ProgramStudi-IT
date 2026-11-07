import { Reveal } from "@/components/landing/reveal"
import type { OrgPosition } from "@/types"

export function Tupoksi({ items }: { items: OrgPosition[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.35em] text-lavender uppercase">
          Tupoksi
        </p>
        <h2 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">
          Tugas Pokok dan Fungsi
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-4 md:mt-14 lg:grid-cols-2">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={i * 80}>
            <div className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-6">
              <div>
                <h3 className="font-bold">{item.jabatan}</h3>
                {item.nama && (
                  <p className="text-sm text-muted-foreground">{item.nama}</p>
                )}
              </div>
              <ul className="flex flex-col gap-2">
                {item.tupoksi.map((t, j) => (
                  <li key={j} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-lime" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}