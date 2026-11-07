import { ChevronDownIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { faqItems } from "@/config/faq"
import { Reveal } from "@/components/landing/reveal"

export function Faq() {
  return (
    <section
      id="faq"
      className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 md:py-24"
    >
      <Reveal>
        <p className="font-mono text-xs tracking-[0.35em] text-lavender uppercase">
          Pertanyaan Umum
        </p>
        <h2 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">
          Masih Ada yang Ingin Ditanyakan?
        </h2>
      </Reveal>

      <div className="mt-10 border-t text-left md:mt-14">
        {faqItems.map(({ question, answer }, i) => (
          <Reveal key={question} delay={i * 80}>
            <Collapsible className="group border-b">
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-lime">
                <span className="font-medium">{question}</span>
                <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-open:rotate-180 group-data-open:text-lime" />
              </CollapsibleTrigger>
              <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
                <p className="pb-5 text-sm text-muted-foreground">{answer}</p>
              </CollapsibleContent>
            </Collapsible>
          </Reveal>
        ))}
      </div>
    </section>
  )
}