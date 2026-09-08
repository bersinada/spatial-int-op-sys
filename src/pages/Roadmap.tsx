import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useStore } from "../lib/store"
import type { RoadmapMonth, RoadmapStatus } from "../lib/types"
import { PageHeader } from "../components/ui/PageHeader"
import { Card } from "../components/ui/Card"
import { ProgressBar } from "../components/ui/ProgressBar"
import { Pill } from "../components/ui/Pill"
import { InlineEdit } from "../components/InlineEdit"

const statusTone: Record<RoadmapStatus, "neutral" | "accent" | "good" | "warn"> = {
  planned: "neutral",
  active: "accent",
  completed: "good",
  paused: "warn",
}

export default function Roadmap() {
  const { roadmap, upsertRoadmapMonth } = useStore()
  const [openId, setOpenId] = useState<string | null>(roadmap.find((m) => m.status === "active")?.id ?? null)

  return (
    <div>
      <PageHeader
        eyebrow="12-Month Plan"
        title="Roadmap"
        description="September 2026 → August 2027. One theme per month, compounding toward Spatial Intelligence specialization."
      />

      <div className="space-y-3">
        {roadmap.map((month) => (
          <MonthRow
            key={month.id}
            month={month}
            open={openId === month.id}
            onToggle={() => setOpenId(openId === month.id ? null : month.id)}
            onChange={(patch) => upsertRoadmapMonth({ ...month, ...patch })}
          />
        ))}
      </div>
    </div>
  )
}

function MonthRow({
  month,
  open,
  onToggle,
  onChange,
}: {
  month: RoadmapMonth
  open: boolean
  onToggle: () => void
  onChange: (patch: Partial<RoadmapMonth>) => void
}) {
  return (
    <Card className={open ? "border-ink/15" : undefined}>
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <div className="w-28 shrink-0 text-xs font-medium uppercase tracking-wide text-ink-faint">
          {month.label}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-sm font-semibold text-ink">{month.theme}</div>
        </div>
        <Pill tone={statusTone[month.status]}>{month.status}</Pill>
        <div className="hidden w-32 items-center gap-2 sm:flex">
          <ProgressBar value={month.completion} size="sm" />
          <span className="w-9 text-right text-xs text-ink-faint">{month.completion}%</span>
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-ink-faint transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-border px-5 py-5">
          <div className="mb-5 grid gap-4 sm:grid-cols-2">
            <Field label="Status">
              <select
                value={month.status}
                onChange={(e) => onChange({ status: e.target.value as RoadmapStatus })}
                className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                {(["planned", "active", "completed", "paused"] as RoadmapStatus[]).map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={`Completion — ${month.completion}%`}>
              <input
                type="range"
                min={0}
                max={100}
                value={month.completion}
                onChange={(e) => onChange({ completion: Number(e.target.value) })}
                className="w-full accent-accent"
              />
            </Field>
          </div>

          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <Detail label="Core Skills" value={month.coreSkills.join(", ")} onSave={(v) => onChange({ coreSkills: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
            <Detail label="Main Project" value={month.mainProject} onSave={(v) => onChange({ mainProject: v })} />
            <Detail label="Main Article" value={month.mainArticle} onSave={(v) => onChange({ mainArticle: v })} />
            <Detail label="Open Source Objective" value={month.openSourceObjective} onSave={(v) => onChange({ openSourceObjective: v })} />
            <Detail label="Networking Objective" value={month.networkingObjective} onSave={(v) => onChange({ networkingObjective: v })} />
            <Detail label="Startup / Problem Objective" value={month.startupObjective} onSave={(v) => onChange({ startupObjective: v })} />
          </div>
        </div>
      )}
    </Card>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-medium text-ink-soft">{label}</div>
      {children}
    </div>
  )
}

function Detail({ label, value, onSave }: { label: string; value: string; onSave: (v: string) => void }) {
  return (
    <div>
      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</div>
      <InlineEdit value={value} onSave={onSave} className="text-sm text-ink" />
    </div>
  )
}
