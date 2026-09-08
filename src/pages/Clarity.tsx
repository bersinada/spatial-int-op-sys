import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { X } from "lucide-react"
import { useStore } from "../lib/store"

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

export default function Clarity() {
  const s = useStore()
  const project = s.projects.find((p) => p.id === s.currentFocus.currentProjectId)
  const article = s.articles.find((a) => a.id === s.currentFocus.currentArticleId)
  const nextMonth = s.roadmap.find((m) => m.status === "planned")

  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(25 * 60)
  const interval = useRef<number | null>(null)

  useEffect(() => {
    if (running) {
      interval.current = window.setInterval(() => {
        setSeconds((s) => (s > 0 ? s - 1 : 0))
      }, 1000)
    } else if (interval.current) {
      clearInterval(interval.current)
    }
    return () => {
      if (interval.current) clearInterval(interval.current)
    }
  }, [running])

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-canvas px-6">
      <Link
        to="/"
        className="absolute right-6 top-6 rounded-md p-2 text-ink-faint hover:bg-surface-muted hover:text-ink"
        aria-label="Exit Clarity Mode"
      >
        <X size={20} />
      </Link>

      <div className="w-full max-w-lg text-center">
        <div className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Clarity Mode</div>

        <p className="mb-10 font-display text-lg leading-snug text-ink-soft">
          You do not need a better plan right now.
          <br />
          <span className="font-semibold text-ink">You need evidence.</span>
        </p>

        <div className="mb-10 space-y-5 text-left">
          <ClarityRow label="Current Objective" value={s.currentFocus.objective} />
          <ClarityRow label="Current Project" value={project?.title} />
          <ClarityRow label="Current Article" value={article?.title} />
          <ClarityRow label="Next Milestone" value={nextMonth ? `${nextMonth.label} — ${nextMonth.theme}` : undefined} />
        </div>

        <div className="rounded-xl border border-accent/30 bg-accent-soft/50 p-6">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">Today</div>
          <div className="mb-5 font-display text-xl font-semibold text-ink">{s.todayAction.title}</div>

          {!running ? (
            <button
              onClick={() => setRunning(true)}
              className="w-full rounded-lg bg-ink py-3 text-sm font-semibold tracking-wide text-canvas hover:bg-ink/85"
            >
              START
            </button>
          ) : (
            <div className="space-y-3">
              <div className="font-display text-3xl font-semibold tabular-nums text-ink">{formatTime(seconds)}</div>
              <button
                onClick={() => setRunning(false)}
                className="w-full rounded-lg border border-border py-2.5 text-sm font-medium text-ink hover:bg-surface-muted"
              >
                Pause
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ClarityRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</div>
      <div className="mt-0.5 text-sm text-ink">{value}</div>
    </div>
  )
}
