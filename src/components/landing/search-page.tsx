"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { SearchIcon } from "lucide-react"

import type { Kabar } from "@/types"

export function SearchPage({ kabar }: { kabar: Kabar[] }) {
  const [query, setQuery] = useState("")
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return []
    return kabar.filter((item) =>
      [item.judul, item.ringkasan, item.kategori].some((value) => value.toLowerCase().includes(normalized))
    )
  }, [kabar, query])

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24">
      <p className="text-sm font-medium text-muted-foreground">Pencarian</p>
      <h1 className="mt-2 font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">Temukan informasi.</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">Cari kabar dan pengumuman yang tersedia di situs Program Studi Teknik Informatika.</p>
      <label className="mt-8 flex min-h-12 items-center gap-3 rounded-lg border border-border bg-card px-4 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
        <SearchIcon className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Kata kunci pencarian</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari kabar atau pengumuman" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
      </label>
      <div className="mt-8 divide-y divide-border border-y border-border">
        {query.trim() && results.length === 0 && <p className="px-4 py-10 text-sm text-muted-foreground">Tidak ada hasil untuk “{query}”.</p>}
        {results.map((item) => (
          <Link key={item.slug} href={`/informasi/kabar/${item.slug}`} className="block px-4 py-5 transition-colors hover:bg-accent/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{item.kategori}</p>
            <h2 className="mt-2 font-heading text-lg font-bold">{item.judul}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.ringkasan}</p>
          </Link>
        ))}
        {!query.trim() && <p className="px-4 py-10 text-sm text-muted-foreground">Masukkan kata kunci untuk memulai pencarian.</p>}
      </div>
    </section>
  )
}