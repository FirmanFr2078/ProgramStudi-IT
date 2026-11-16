"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import type { IdentitasItem, ProfilLulusanItem, ProfilProdiAdmin } from "@/types"

const API_URL = "/api/dashboard/profil"

export type TextListKey = "sambutanIsi" | "sejarah" | "misi" | "tujuan"

export type ProfilFormValues = {
  sambutanIsi: string[]
  sejarah: string[]
  visi: string
  misi: string[]
  tujuan: string[]
  profilLulusan: ProfilLulusanItem[]
  identitas: IdentitasItem[]
}

type FieldErrors = Record<string, string[] | undefined>

type FormResponse = {
  success: boolean
  data?: ProfilProdiAdmin
  message?: string
  errors?: FieldErrors
}

const EMPTY_VALUES: ProfilFormValues = {
  sambutanIsi: [""],
  sejarah: [""],
  visi: "",
  misi: [""],
  tujuan: [""],
  profilLulusan: [{ judul: "", deskripsi: "" }],
  identitas: [{ label: "", value: "" }],
}

function toFormValues(data: ProfilProdiAdmin): ProfilFormValues {
  return {
    sambutanIsi: data.sambutanIsi.length ? data.sambutanIsi : [""],
    sejarah: data.sejarah.length ? data.sejarah : [""],
    visi: data.visi,
    misi: data.misi.length ? data.misi : [""],
    tujuan: data.tujuan.length ? data.tujuan : [""],
    profilLulusan: data.profilLulusan.length ? data.profilLulusan : [{ judul: "", deskripsi: "" }],
    identitas: data.identitas.length ? data.identitas : [{ label: "", value: "" }],
  }
}

function buildPayload(values: ProfilFormValues) {
  const cleanTextList = (list: string[]) => list.map((item) => item.trim()).filter(Boolean)

  return {
    sambutanIsi: cleanTextList(values.sambutanIsi),
    sejarah: cleanTextList(values.sejarah),
    visi: values.visi.trim(),
    misi: cleanTextList(values.misi),
    tujuan: cleanTextList(values.tujuan),
    profilLulusan: values.profilLulusan
      .map((item) => ({ judul: item.judul.trim(), deskripsi: item.deskripsi.trim() }))
      .filter((item) => item.judul || item.deskripsi),
    identitas: values.identitas
      .map((item) => ({ label: item.label.trim(), value: item.value.trim() }))
      .filter((item) => item.label || item.value),
  }
}

export function useProfilForm(initial: ProfilProdiAdmin | null) {
  const router = useRouter()

  const [values, setValues] = useState<ProfilFormValues>(
    initial ? toFormValues(initial) : EMPTY_VALUES,
  )
  const [updatedAt, setUpdatedAt] = useState<string | null>(initial?.updatedAt ?? null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function setField<K extends keyof ProfilFormValues>(key: K, value: ProfilFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function addTextItem(key: TextListKey) {
    setValues((prev) => ({ ...prev, [key]: [...prev[key], ""] }))
  }

  function updateTextItem(key: TextListKey, index: number, value: string) {
    setValues((prev) => ({
      ...prev,
      [key]: prev[key].map((item, i) => (i === index ? value : item)),
    }))
  }

  function removeTextItem(key: TextListKey, index: number) {
    setValues((prev) => ({
      ...prev,
      [key]: prev[key].length > 1 ? prev[key].filter((_, i) => i !== index) : prev[key],
    }))
  }

  function moveTextItem(key: TextListKey, index: number, direction: -1 | 1) {
    setValues((prev) => {
      const list = [...prev[key]]
      const target = index + direction
      if (target < 0 || target >= list.length) return prev
      ;[list[index], list[target]] = [list[target], list[index]]
      return { ...prev, [key]: list }
    })
  }

  function addProfilLulusan() {
    setValues((prev) => ({
      ...prev,
      profilLulusan: [...prev.profilLulusan, { judul: "", deskripsi: "" }],
    }))
  }

  function updateProfilLulusan(index: number, field: "judul" | "deskripsi", value: string) {
    setValues((prev) => ({
      ...prev,
      profilLulusan: prev.profilLulusan.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }))
  }

  function removeProfilLulusan(index: number) {
    setValues((prev) => ({
      ...prev,
      profilLulusan:
        prev.profilLulusan.length > 1
          ? prev.profilLulusan.filter((_, i) => i !== index)
          : prev.profilLulusan,
    }))
  }

  function addIdentitas() {
    setValues((prev) => ({ ...prev, identitas: [...prev.identitas, { label: "", value: "" }] }))
  }

  function updateIdentitas(index: number, field: "label" | "value", value: string) {
    setValues((prev) => ({
      ...prev,
      identitas: prev.identitas.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  function removeIdentitas(index: number) {
    setValues((prev) => ({
      ...prev,
      identitas:
        prev.identitas.length > 1 ? prev.identitas.filter((_, i) => i !== index) : prev.identitas,
    }))
  }

  async function submit() {
    if (isSubmitting) return

    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    setFieldErrors({})

    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(buildPayload(values)),
      })
      const result = (await response.json()) as FormResponse

      if (!response.ok || !result.success) {
        if (result.errors) setFieldErrors(result.errors)
        setErrorMessage(
          result.message ??
            (result.errors
              ? "Periksa kembali isian yang ditandai."
              : "Gagal menyimpan Profil Program Studi."),
        )
        return
      }

      if (result.data) {
        setValues(toFormValues(result.data))
        setUpdatedAt(result.data.updatedAt)
      }
      setSuccessMessage("Profil Program Studi berhasil disimpan.")
      router.refresh()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    values,
    setField,
    addTextItem,
    updateTextItem,
    removeTextItem,
    moveTextItem,
    addProfilLulusan,
    updateProfilLulusan,
    removeProfilLulusan,
    addIdentitas,
    updateIdentitas,
    removeIdentitas,
    fieldErrors,
    isSubmitting,
    errorMessage,
    successMessage,
    updatedAt,
    submit,
  }
}