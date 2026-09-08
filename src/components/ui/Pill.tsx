export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode
  tone?: "neutral" | "accent" | "good" | "warn"
}) {
  const toneClass = {
    neutral: "bg-surface-muted text-ink-soft border-border",
    accent: "bg-accent-soft text-accent border-accent/20",
    good: "bg-good-soft text-good border-good/20",
    warn: "bg-amber-50 text-warn border-warn/20",
  }[tone]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${toneClass}`}
    >
      {children}
    </span>
  )
}
