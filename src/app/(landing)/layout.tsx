import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-24">{children}</main>
      <Footer />
    </>
  )
}