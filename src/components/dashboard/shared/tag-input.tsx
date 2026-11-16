"use client"

import { useState, type KeyboardEvent } from "react"
import { XIcon } from "lucide-react"

import { Input } from "@/components/ui/input"

type TagInputProps = {
  id?: string
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  maxItems?: number
  maxLength?: number
  invalid?: boolean
  disabled?: boolean
}

/**
 * Input daftar teks pendek (bidang keahlian, mata kuliah, tugas, dst).
 * Enter atau koma menambah item, Backspace di kolom kosong menghapus item
 * terakhir, dan teks yang masih diketik ikut tersimpan saat kolom ditinggalkan.
 * Tidak pernah men-submit form induknya.
 */
export function TagInput({
  id,
  value,
  onChange,
  placeholder = "Ketik lalu tekan Enter",
  maxItems = 20,
  maxLength = 100,
  invalid,
  disabled,
}: TagInputProps) {
  const [draft, setDraft] = useState("")

  function addTags(parts: string[]) {
    const next = [...value]

    for (const part of parts) {
      const text = part.trim().replace(/\s+/g, " ").slice(0, maxLength)
      if (!text || next.length >= maxItems) continue
      if (next.some((item) => item.toLowerCase() === text.toLowerCase())) continue
      next.push(text)
    }

    if (next.length !== value.length) onChange(next)
  }

  function handleChange(text: string) {
    // Tempel "a, b, c" -> semua langsung jadi item, sisa setelah koma terakhir tetap di kolom
    if (text.includes(",")) {
      const parts = text.split(",")
      const rest = parts.pop() ?? ""
      addTags(parts)
      setDraft(rest)
      return
    }
    setDraft(text)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault() // jangan submit form
      addTags([draft])
      setDraft("")
      return
    }

    if (event.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  function handleBlur() {
    if (draft.trim()) {
      addTags([draft])
      setDraft("")
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  const isFull = value.length >= maxItems

  return (
    <div className="space-y-2">
      <Input
        id={id}
        value={draft}
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={isFull ? `Maksimal ${maxItems} item tercapai` : placeholder}
        disabled={disabled || isFull}
        aria-invalid={invalid}
      />

      {value.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {value.map((item, index) => (
            <li
              key={item.toLowerCase()}
              className="inline-flex max-w-full items-center gap-1 rounded-full bg-secondary py-1 pr-1.5 pl-2.5 text-xs text-secondary-foreground"
            >
              <span className="truncate">{item}</span>
              <button
                type="button"
                onClick={() => removeAt(index)}
                disabled={disabled}
                aria-label={`Hapus ${item}`}
                className="flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              >
                <XIcon className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-[11px] text-muted-foreground">
        Tekan Enter atau koma untuk menambah · {value.length}/{maxItems}
      </p>
    </div>
  )
}