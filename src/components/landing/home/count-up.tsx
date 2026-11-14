"use client"

import { useEffect, useRef, useState } from "react"

function parseValue(value: string) {
  const match = value.match(/^(.*?)([\d.]+)(.*)$/)
  if (!match) return null

  const [, prefix, number, suffix] = match
  return {
    prefix,
    value: Number(number.replace(/\./g, "")),
    suffix,
    formatted: number,
  }
}

export function CountUp({ value }: { value: string }) {
  const parsed = parseValue(value)
  const ref = useRef<HTMLSpanElement>(null)
  const [current, setCurrent] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !parsed) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return
      setStarted(true)
      observer.unobserve(el)

      if (prefersReducedMotion) {
        setCurrent(parsed.value)
        return
      }

      const duration = 900
      const startTime = performance.now()
      let frame = 0

      const animate = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCurrent(Math.round(parsed.value * eased))
        if (progress < 1) frame = requestAnimationFrame(animate)
      }

      frame = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(frame)
    }, { threshold: 0.25 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [parsed, started])

  if (!parsed) return <span ref={ref}>{value}</span>

  const display = started ? current.toLocaleString("id-ID") : "0"
  return <span ref={ref}>{parsed.prefix}{display}{parsed.suffix}</span>
}
