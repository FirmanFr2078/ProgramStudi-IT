"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { siteConfig } from "@/config/site"

export function ContactForm() {
  const [values, setValues] = useState({ nama: "", email: "", pesan: "" })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const subject = encodeURIComponent(
      `Pesan dari ${values.nama || "pengunjung website"}`
    )
    const body = encodeURIComponent(
      `${values.pesan}\n\n—\nDikirim oleh: ${values.nama}\nEmail: ${values.email}`
    )
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border bg-card p-6"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="nama" className="text-sm font-medium">
          Nama
        </label>
        <Input
          id="nama"
          required
          value={values.nama}
          onChange={(e) => setValues((v) => ({ ...v, nama: e.target.value }))}
          placeholder="Nama lengkap"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          required
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          placeholder="nama@email.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="pesan" className="text-sm font-medium">
          Pesan
        </label>
        <textarea
          id="pesan"
          required
          rows={5}
          value={values.pesan}
          onChange={(e) => setValues((v) => ({ ...v, pesan: e.target.value }))}
          placeholder="Tulis pertanyaan atau pesanmu di sini…"
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
      </div>

      <Button type="submit" size="lg" className="glow mt-1 w-fit rounded-full px-6">
        Kirim Pesan
      </Button>
    </form>
  )
}