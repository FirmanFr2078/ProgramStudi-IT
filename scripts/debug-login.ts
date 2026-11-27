import bcrypt from "bcryptjs"
import { prisma } from "../src/lib/prisma"

async function main() {
  const username = process.argv[2]
  const password = process.argv[3]

  if (!username || !password) {
    console.log("Pakai: pnpm exec tsx --env-file=.env.local scripts/debug-login.ts <username> <password>")
    process.exit(1)
  }

  const normalized = username.trim().toLowerCase()
  const user = await prisma.tbl_profiles.findUnique({ where: { username: normalized } })

  if (!user) {
    console.log(`Tidak ada baris tbl_profiles dengan username "${normalized}".`)
    return
  }

  console.log("Baris ditemukan:")
  console.log("  id_profile   :", user.id_profile)
  console.log("  username     :", user.username)
  console.log("  is_active    :", user.is_active)
  console.log("  created_at   :", user.created_at)
  console.log("  updated_at   :", user.updated_at)
  console.log("  password hash:", user.password)

  const match = await bcrypt.compare(password, user.password)
  console.log("\nPassword cocok?", match)
}

main().finally(() => prisma.$disconnect())