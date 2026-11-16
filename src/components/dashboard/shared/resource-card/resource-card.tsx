import type { ReactNode } from "react"
import { cn } from "cn"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CardFooterRow } from "./card-footer-row"

type ResourceCardProps = {
  title: ReactNode
  description?: ReactNode
  media?: ReactNode
  children?: ReactNode
  footerLabel?: ReactNode
  footerActions?: ReactNode
  className?: string
}

export function ResourceCard({
  title,
  description,
  media,
  children,
  footerLabel,
  footerActions,
  className,
}: ResourceCardProps) {
  const hasFooter = Boolean(footerLabel || footerActions)

  return (
    <Card size="sm" className={cn("h-full", className)}>
      {media}
      <CardHeader>
        <CardTitle className="line-clamp-2 text-sm">{title}</CardTitle>
        {description && (
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        )}
      </CardHeader>

      {children}

      {hasFooter && <CardFooterRow label={footerLabel} actions={footerActions} />}
    </Card>
  )
}