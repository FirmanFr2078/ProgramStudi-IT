export function getInitials(nama: string) {
  return nama
    .replace(/^(Dr\.|Prof\.|Ir\.)\s*/i, "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}