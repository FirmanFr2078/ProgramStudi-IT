import { Hero } from "@/components/landing/home/hero"
import { Stats } from "@/components/landing/home/stats"
import { FocusAreas } from "@/components/landing/home/focus-areas"
import { LatestNews } from "@/components/landing/home/latest-news"
import { Cta } from "@/components/landing/home/cta"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <FocusAreas />
      <LatestNews />
      <Cta />
    </>
  )
}