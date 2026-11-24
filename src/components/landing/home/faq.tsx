import { ChevronDownIcon } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { faqItems } from "@/config/faq"
import { Reveal } from "@/components/landing/reveal"

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-primary">Pertanyaan Umum</p>
        <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Masih Ada yang Ingin Ditanyakan?</h2>
      </Reveal>
      <div className="mx-auto mt-10 max-w-3xl divide-y divide-border border-y border-border md:mt-14">
        {faqItems.map(({ question, answer }, i) => (
          <Reveal key={question} delay={i * 60}>
            <Collapsible className="group">
              <CollapsibleTrigger className="flex min-h-14 w-full items-center justify-between gap-4 px-3 text-left text-sm font-semibold text-foreground transition-colors hover:text-primary sm:px-4 sm:text-base">
                <span className="min-w-0">{question}</span>
                <ChevronDownIcon className="mr-1 size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-open:rotate-180 sm:mr-0" aria-hidden="true" />
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden data-closed:hidden">
                <p className="px-3 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-4">{answer}</p>
              </CollapsibleContent>
            </Collapsible>
          </Reveal>
        ))}
      </div>
    </section>
  )
}