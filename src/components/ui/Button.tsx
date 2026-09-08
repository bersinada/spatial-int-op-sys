import type { ButtonHTMLAttributes } from "react"

type Variant = "primary" | "secondary" | "ghost" | "danger"

const variants: Record<Variant, string> = {
  primary: "bg-ink text-canvas hover:bg-ink/85",
  secondary: "bg-surface border border-border text-ink hover:bg-surface-muted",
  ghost: "text-ink-soft hover:bg-surface-muted",
  danger: "bg-surface border border-red-200 text-red-600 hover:bg-red-50",
}

export function Button({
  variant = "secondary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
