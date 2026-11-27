import { config } from "dotenv"
config({ path: ".env.local" })

import bcrypt from "bcryptjs"

import { prisma } from "../src/lib/prisma"

// ============================================================
// AKUN ADMIN PERTAMA
// ============================================================
// Bisa di-override lewat .env.local tanpa ubah file ini. Kalau ga
// diisi, pakai default di bawah -- cocok buat development.

const SEED_USERNAME = (process.env.SEED_ADMIN_USERNAME ?? "admin").toLowerCase()
const SEED_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "admin12345"
const SEED_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@prodi.ac.id"
const SEED_NAMA = process.env.SEED_ADMIN_NAMA ?? "Administrator"

async function seedAdmin() {
  // Deteksi apakah akun ini udah pernah dibuat sebelumnya -- kalau udah,
  // skip aja. Biar `pnpm exec prisma db seed` aman dijalanin berkali-kali
  // (misal abis migrate dev) tanpa error unique constraint atau nimpa
  // password yang udah diganti manual lewat dashboard.
  const existing = await prisma.tbl_profiles.findUnique({
    where: { username: SEED_USERNAME },
  })

  if (existing) {
    console.log(`[seed] Akun "${SEED_USERNAME}" sudah ada, dilewati.`)
    return
  }

  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 12)

  await prisma.tbl_profiles.create({
    data: {
      username: SEED_USERNAME,
      email: SEED_EMAIL,
      password: hashedPassword,
      nama: SEED_NAMA,
      role: "admin",
    },
  })

  console.log(`[seed] Akun admin "${SEED_USERNAME}" berhasil dibuat.`)
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log(`[seed] Pakai password default: "${SEED_PASSWORD}" -- GANTI setelah login pertama.`)
  }
}

async function main() {
  console.log("[seed] Mulai seeding...")
  await seedAdmin()
  console.log("[seed] Selesai.")
}

main()
  .catch((error) => {
    console.error("[seed] Gagal:", error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })