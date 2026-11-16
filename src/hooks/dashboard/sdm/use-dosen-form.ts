"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { slugFromNama } from "@/lib/slug"
import type { DosenAdmin, JabatanFungsional } from "@/types"

export const FOTO_MAX_SIZE = 2 * 1024 * 1024
export const FOTO_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

const LIST_URL = "/dashboard/sdm/dosen"
const API_URL = "/api/dashboard/sdm/dosen"

// Semua isian form berupa string/array supaya mudah dipasang ke <Input>.
// Konversi ke bentuk payload API ada di buildPayload().
export type DosenFormValues = {
  nama: string
  nidn: string
  email: string
  jabatanStruktural: string
  jabatanFungsional: JabatanFungsional
  s1Bidang: string
  s1Kampus: string
  s2Bidang: string
  s2Kampus: string
  s3Bidang: string
  s3Kampus: string
  bidangKeahlian: string[]
  mataKuliah: string[]
  sinta: string
  googleScholar: string
  foto: string | null // path di Storage (bukan URL), null = tanpa foto
}

type FieldErrors = Record<string, string[] | undefined>

type FormResponse = {
  success: boolean
  data?: DosenAdmin
  message?: string
  errors?: FieldErrors
}

type UploadResponse = {
  success: boolean
  data?: { path: string; url: string }
  message?: string
}

const EMPTY_VALUES: DosenFormValues = {
  nama: "",
  nidn: "",
  email: "",
  jabatanStruktural: "",
  jabatanFungsional: "Tenaga Pengajar",
  s1Bidang: "",
  s1Kampus: "",
  s2Bidang: "",
  s2Kampus: "",
  s3Bidang: "",
  s3Kampus: "",
  bidangKeahlian: [],
  mataKuliah: [],
  sinta: "",
  googleScholar: "",
  foto: null,
}

function toFormValues(dosen: DosenAdmin): DosenFormValues {
  return {
    nama: dosen.nama,
    nidn: dosen.nidn,
    email: dosen.email,
    jabatanStruktural: dosen.jabatanStruktural ?? "",
    jabatanFungsional: dosen.jabatanFungsional,
    s1Bidang: dosen.pendidikanS1.bidang,
    s1Kampus: dosen.pendidikanS1.kampus,
    s2Bidang: dosen.pendidikanS2?.bidang ?? "",
    s2Kampus: dosen.pendidikanS2?.kampus ?? "",
    s3Bidang: dosen.pendidikanS3?.bidang ?? "",
    s3Kampus: dosen.pendidikanS3?.kampus ?? "",
    bidangKeahlian: dosen.bidangKeahlian,
    mataKuliah: dosen.mataKuliah,
    sinta: dosen.sinta ?? "",
    googleScholar: dosen.googleScholar ?? "",
    foto: dosen.fotoPath,
  }
}

function buildPayload(values: DosenFormValues, slug: string, foto: string | null) {
  return {
    slug,
    nama: values.nama.trim(),
    nidn: values.nidn.trim(),
    email: values.email.trim(),
    jabatanStruktural: values.jabatanStruktural.trim() || null,
    jabatanFungsional: values.jabatanFungsional,
    pendidikanS1: { bidang: values.s1Bidang.trim(), kampus: values.s1Kampus.trim() },
    // S2 wajib -- dikirim apa adanya, validasi "tidak boleh kosong" ada di server (dosenInputSchema).
    pendidikanS2: { bidang: values.s2Bidang.trim(), kampus: values.s2Kampus.trim() },
    pendidikanS3:
      values.s3Bidang.trim() || values.s3Kampus.trim()
        ? { bidang: values.s3Bidang.trim(), kampus: values.s3Kampus.trim() }
        : null,
    bidangKeahlian: values.bidangKeahlian,
    mataKuliah: values.mataKuliah,
    sinta: values.sinta.trim() || null,
    googleScholar: values.googleScholar.trim() || null,
    foto,
  }
}

export function useDosenForm(initial?: DosenAdmin) {
  const router = useRouter()
  const isEditing = Boolean(initial)

  const [values, setValues] = useState<DosenFormValues>(
    initial ? toFormValues(initial) : EMPTY_VALUES,
  )
  const [fotoPreview, setFotoPreview] = useState<string | null>(initial?.foto ?? null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Foto yang sudah dipilih tapi BELUM dikirim ke Storage. Upload baru terjadi
  // saat submit, jadi Batal / pindah halaman tidak meninggalkan file sampah.
  const pendingFotoRef = useRef<File | null>(null)
  const objectUrlsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const urls = objectUrlsRef.current
    return () => {
      for (const url of urls) URL.revokeObjectURL(url)
    }
  }, [])

  // Slug SELALU mengikuti nama -- tidak ada lagi input manual. Dihitung tiap
  // render, bukan disimpan di state, supaya tidak ada sumber kebenaran ganda.
  const slug = slugFromNama(values.nama)

  function setField<K extends keyof DosenFormValues>(key: K, value: DosenFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  /** Mengembalikan pesan error kalau file ditolak, null kalau diterima. */
  function setFotoFile(file: File): string | null {
    if (!FOTO_ALLOWED_TYPES.includes(file.type)) {
      return "Format foto tidak didukung. Gunakan JPG, PNG, atau WebP."
    }
    if (file.size > FOTO_MAX_SIZE) {
      return "Ukuran foto terlalu besar. Maksimal 2 MB."
    }

    const objectUrl = URL.createObjectURL(file)
    objectUrlsRef.current.add(objectUrl)
    pendingFotoRef.current = file
    setFotoPreview(objectUrl)
    return null
  }

  function removeFoto() {
    pendingFotoRef.current = null
    setFotoPreview(null)
    setValues((prev) => ({ ...prev, foto: null }))
  }

  async function uploadFoto(file: File) {
    const body = new FormData()
    body.set("file", file)

    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      credentials: "include",
      body,
    })
    const result = (await response.json()) as UploadResponse

    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.message ?? "Gagal mengunggah foto.")
    }
    return result.data
  }

  async function deleteUploadedFoto(path: string) {
    try {
      await fetch(`${API_URL}/upload`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ path }),
      })
    } catch {
      // rollback best-effort, tidak boleh menghalangi pesan error ke pengguna
    }
  }

  async function submit() {
    if (isSubmitting) return

    setIsSubmitting(true)
    setErrorMessage(null)
    setFieldErrors({})

    let uploaded: { path: string; url: string } | null = null

    try {
      // 1) Upload foto kalau ada yang baru dipilih
      if (pendingFotoRef.current) {
        uploaded = await uploadFoto(pendingFotoRef.current)
      }

      // 2) Simpan data dosen
      const response = await fetch(isEditing ? `${API_URL}/${initial?.id}` : API_URL, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(buildPayload(values, slug, uploaded?.path ?? values.foto)),
      })
      const result = (await response.json()) as FormResponse

      if (!response.ok || !result.success) {
        // Gagal simpan -> foto yang baru diunggah dihapus lagi
        if (uploaded) await deleteUploadedFoto(uploaded.path)
        if (result.errors) setFieldErrors(result.errors)
        setErrorMessage(
          result.message ??
            (result.errors
              ? "Periksa kembali isian yang ditandai."
              : "Gagal menyimpan data dosen."),
        )
        return
      }

      pendingFotoRef.current = null
      router.push(LIST_URL)
      router.refresh()
    } catch (error) {
      if (uploaded) await deleteUploadedFoto(uploaded.path)
      setErrorMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    values,
    setField,
    slug,
    fotoPreview,
    setFotoFile,
    removeFoto,
    fieldErrors,
    isSubmitting,
    errorMessage,
    submit,
    isEditing,
  }
}