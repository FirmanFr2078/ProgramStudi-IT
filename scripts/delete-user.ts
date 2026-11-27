import { prisma } from "../src/lib/prisma"

async function main() {
  const username = process.argv[2]

  if (!username) {
    console.log("Pakai: pnpm exec tsx --env-file=.env.local scripts/delete-user.ts <username>")
    process.exit(1)
  }

  const deleted = await prisma.tbl_profiles.delete({
    where: { username: username.trim().toLowerCase() },
  })

  console.log(`Baris "${deleted.username}" (${deleted.id_profile}) berhasil dihapus.`)
}

main().finally(() => prisma.$disconnect())