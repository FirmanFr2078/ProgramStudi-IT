import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource-variable/plus-jakarta-sans/wght.css";
import "@fontsource-variable/archivo/standard.css";
import "@fontsource-variable/inter/wght.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Teknik Informatika | Universitas Islam Balitar",
    template: "%s | TI UNISBA Blitar",
  },
  description:
    "Website resmi Program Studi Teknik Informatika, Fakultas Teknik dan Informatika, Universitas Islam Balitar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${GeistSans.variable} ${GeistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}