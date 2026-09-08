import { useState } from "react"
import { Pencil, Check } from "lucide-react"

export function InlineEdit({
  value,
  onSave,
  className = "",
  multiline = false,
  as: As = "div",
}: {
  value: string
  onSave: (v: string) => void
  className?: string
  multiline?: boolean
  as?: React.ElementType
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  if (editing) {
    const commit = () => {
      onSave(draft)
      setEditing(false)
    }
    return multiline ? (
      <textarea
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) commit()
          if (e.key === "Escape") setEditing(false)
        }}
        className={`w-full resize-y rounded-md border border-accent/40 bg-surface px-2 py-1.5 outline-none ring-2 ring-accent/20 ${className}`}
      />
    ) : (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit()
          if (e.key === "Escape") setEditing(false)
        }}
        className={`w-full rounded-md border border-accent/40 bg-surface px-2 py-1.5 outline-none ring-2 ring-accent/20 ${className}`}
      />
    )
  }

  return (
    <As
      className={`group inline-flex cursor-text items-start gap-2 rounded-md px-2 py-1.5 -mx-2 hover:bg-surface-muted/70 ${className}`}
      onClick={() => {
        setDraft(value)
        setEditing(true)
      }}
    >
      <span className="flex-1">{value}</span>
      <Pencil size={13} className="mt-1 shrink-0 text-ink-faint opacity-0 group-hover:opacity-100" />
    </As>
  )
}

export function useSavedFlash() {
  const [saved, setSaved] = useState(false)
  const flash = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1200)
  }
  const Indicator = saved ? <Check size={13} className="text-good" /> : null
  return { flash, Indicator }
}
