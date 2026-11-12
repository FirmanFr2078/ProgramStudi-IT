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
      className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16"
    >
      <Reveal className="flex flex-col gap-2">
        <span className="text-xs font-semibold tracking-wider text-primary uppercase">
          Tanya Jawab
        </span>
        <h2 className="font-heading text-2xl font-extrabold sm:text-3xl md:text-4xl">
          Pertanyaan Umum Calon Mahasiswa
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          Informasi seputar jalur perkuliahan, konsentrasi minat, dan program magang kerja sama.
        </p>
      </Reveal>

      <div className="mt-8 divide-y divide-border/80 border-y border-border/80">
        {faqItems.map(({ question, answer }, i) => (
          <Reveal key={question} delay={i * 60}>
            <Collapsible className="group">
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-semibold text-foreground transition-colors hover:text-lime sm:text-base">
                <span>{question}</span>
                <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-open:rotate-180 group-data-open:text-lime" />
              </CollapsibleTrigger>
              <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
                <p className="pb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {answer}
                </p>
              </CollapsibleContent>
            </Collapsible>
          </Reveal>
        ))}
      </div>
    </section>
  )
}