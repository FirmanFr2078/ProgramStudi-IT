import { ChevronDownIcon } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { faqItems } from "@/config/faq"
import { Reveal } from "@/components/landing/reveal"

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <Reveal>
          <p className="text-sm font-medium text-muted-foreground">Tanya jawab</p>
          <h2 className="mt-2 max-w-sm font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Hal yang sering ditanyakan.</h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">Jawaban singkat untuk membantu calon mahasiswa mengenal cara belajar dan pilihan yang tersedia.</p>
        </Reveal>
        <div className="divide-y divide-border border-y border-border">
          {faqItems.map(({ question, answer }, i) => (
            <Reveal key={question} delay={i * 60}>
              <Collapsible className="group">
                <CollapsibleTrigger className="flex min-h-14 w-full items-center justify-between gap-4 text-left text-sm font-semibold text-foreground transition-colors hover:text-primary sm:text-base">
                  <span>{question}</span>
                  <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-open:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
                  <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{answer}</p>
                </CollapsibleContent>
              </Collapsible>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}