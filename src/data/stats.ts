import type { SiteStats } from "@/types"

// DUMMY. Nanti diganti penghitung sungguhan (database atau analytics).
export async function getSiteStats(): Promise<SiteStats> {
  return { visitorsTotal: 12480, visitorsToday: 134 }
}