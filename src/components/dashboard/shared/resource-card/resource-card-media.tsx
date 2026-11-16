"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "cn";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardFooterRow } from "./card-footer-row";

type ResourceCardMediaProps = {
  image?: string | null;
  imageAlt: string;
  badge?: React.ReactNode;
  title: string;
  description?: string;
  footerLabel: React.ReactNode;
  footerActions?: React.ReactNode;
  className?: string;
};

export function ResourceCardMedia({
  image,
  imageAlt,
  badge,
  title,
  description,
  footerLabel,
  footerActions,
  className,
}: ResourceCardMediaProps) {
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (expanded) return;

    const el = titleRef.current;
    if (!el) return;

    function checkTruncation() {
      if (!el) return;
      setIsTruncated(el.scrollHeight > el.clientHeight + 1);
    }

    checkTruncation();

    const observer = new ResizeObserver(checkTruncation);
    observer.observe(el);

    return () => observer.disconnect();
  }, [title, expanded]);

  return (
    <Card size="sm" className={cn("h-full gap-0", className)}>
      {/* Media banner dengan inset mengikuti padding card */}

      {/* Media banner dengan inset lebih compact */}
      <div className="px-3 pt-2">
        <div className="relative aspect-[2.3/1] w-full overflow-hidden rounded-xl bg-muted">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={imageAlt}
              className="size-full object-cover"
            />
          ) : (
            /* Abstract placeholder ketika gambar belum tersedia */
            <div className="relative size-full overflow-hidden bg-linear-to-br from-violet-950 via-indigo-950 to-slate-950">
              {/* Ambient glow */}
              <div className="absolute -right-8 -top-12 size-40 rounded-full bg-violet-500/30 blur-3xl" />

              <div className="absolute -bottom-16 left-8 size-36 rounded-full bg-indigo-500/30 blur-3xl" />

              {/* Decorative rings */}
              <div className="absolute -right-4 -top-12 size-44 rounded-full border border-white/10" />

              <div className="absolute -right-1 -top-9 size-36 rounded-full border border-white/5" />

              {/* Subtle light accent */}
              <div className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-violet-400/30 to-transparent" />
            </div>
          )}

          {/* Dynamic Island Style Badge */}
          {badge && (
            <div className="absolute inset-x-0 top-0 z-10 flex justify-center">
              <div
                className={cn(
                  "flex items-center justify-center",
                  "rounded-b-xl border-x border-b border-white/10",
                  "bg-background/80 px-4 py-1.5",
                  "text-[10px] font-semibold tracking-wide text-foreground",
                  "shadow-md backdrop-blur-md",
                  "*:border-0!",
                  "*:bg-transparent!",
                  "*:px-0!",
                  "*:py-0",
                  "*:text-inherit",
                  "*:shadow-none",
                )}
              >
                {badge}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card content */}
      <div className="flex-1 px-(--card-spacing) pt-3 pb-3">
        <div className="flex items-start gap-1">
          <h3
            ref={titleRef}
            className={cn(
              "flex-1 text-sm leading-snug font-semibold",
              !expanded && "line-clamp-1",
            )}
          >
            {title}
          </h3>

          {isTruncated && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setExpanded((v) => !v)}
              className="-mt-0.5 -mr-1 size-6 shrink-0 text-muted-foreground"
            >
              <ChevronRightIcon
                className={cn(
                  "size-3.5 transition-transform",
                  expanded && "rotate-90",
                )}
              />
              <span className="sr-only">
                {expanded ? "Sembunyikan judul lengkap" : "Lihat judul lengkap"}
              </span>
            </Button>
          )}
        </div>

        {description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <CardFooterRow label={footerLabel} actions={footerActions} />
    </Card>
  );
}
