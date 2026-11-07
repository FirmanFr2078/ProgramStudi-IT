import { Hero } from "@/components/landing/home/hero"
import { Stats } from "@/components/landing/home/stats"
import { FocusAreas } from "@/components/landing/home/focus-areas"
import { LatestNews } from "@/components/landing/home/latest-news"
import { Faq } from "@/components/landing/home/faq"
import { Cta } from "@/components/landing/home/cta"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <FocusAreas />
      <LatestNews />
      <Faq />
      <Cta />
    </>
  )
}