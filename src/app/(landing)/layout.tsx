import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="theme-landing flex flex-1 flex-col">
      <Header />
      <main className="flex-1 pt-24">{children}</main>
      <Footer />
    </div>
  )
}