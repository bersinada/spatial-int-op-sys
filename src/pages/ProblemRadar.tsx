import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { useStore } from "../lib/store"
import type { Problem, ProblemStatus } from "../lib/types"
import { PageHeader } from "../components/ui/PageHeader"
import { Card, CardBody } from "../components/ui/Card"
import { Pill } from "../components/ui/Pill"
import { Button } from "../components/ui/Button"
import { Modal } from "../components/ui/Modal"
import { Field, Input, Select, Textarea } from "../components/ui/Field"
import { EmptyState } from "../components/ui/EmptyState"

const statuses: ProblemStatus[] = ["OBSERVED", "INVESTIGATING", "VALIDATING", "PROTOTYPING", "PROMISING", "REJECTED"]

const statusTone: Record<ProblemStatus, "neutral" | "accent" | "good" | "warn"> = {
  OBSERVED: "neutral",
  INVESTIGATING: "accent",
  VALIDATING: "accent",
  PROTOTYPING: "warn",
  PROMISING: "good",
  REJECTED: "neutral",
}

const empty: Omit<Problem, "id" | "createdAt"> = {
  title: "",
  industry: "",
  customer: "",
  description: "",
  currentSolution: "",
  whyInsufficient: "",
  spatialComponent: "",
  aiOpportunity: "",
  dataRequired: "",
  technicalFeasibility: 3,
  potentialMarket: "",
  willingnessToPay: "",
  competition: "",
  defensibility: "",
  internationalRelevance: "",
  mvpDifficulty: 3,
  confidence: 2,
  status: "OBSERVED",
}

export default function ProblemRadar() {
  const { problems, upsertProblem, deleteProblem } = useStore()
  const [editing, setEditing] = useState<Problem | null>(null)
  const [creating, setCreating] = useState(false)

  return (
    <div>
      <PageHeader
        eyebrow="Founder Layer"
        title="Problem Radar"
        description="Interesting technology is not the same as a valuable problem. Capture what you observe."
        actions={
          <Button variant="primary" onClick={() => setCreating(true)}>
            <Plus size={15} /> Log Problem
          </Button>
        }
      />

      {problems.length === 0 ? (
        <EmptyState
          message="Observe workflows before inventing products."
          action={
            <Button variant="primary" onClick={() => setCreating(true)}>
              <Plus size={15} /> Log Problem
            </Button>
          }
        />
      ) : (
        <>
          <OpportunityMatrix problems={problems} onOpen={setEditing} />
          <div className="mt-8 space-y-2.5">
            {problems.map((p) => (
              <Card key={p.id} className="cursor-pointer hover:shadow-card" onClick={() => setEditing(p)}>
                <CardBody className="flex flex-wrap items-center gap-3 py-4">
                  <Pill tone={statusTone[p.status]}>{p.status}</Pill>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink">{p.title}</div>
                    {p.industry && <div className="truncate text-xs text-ink-faint">{p.industry}</div>}
                  </div>
                  <span className="text-xs text-ink-faint">Confidence {p.confidence}/5</span>
                </CardBody>
              </Card>
            ))}
          </div>
        </>
      )}

      {(editing || creating) && (
        <Modal
          open
          onClose={() => {
            setEditing(null)
            setCreating(false)
          }}
          title={editing ? "Edit Problem" : "Log Problem"}
          wide
        >
          <ProblemForm
            initial={editing ?? empty}
            id={editing?.id}
            onCancel={() => {
              setEditing(null)
              setCreating(false)
            }}
            onSave={(p) => {
              upsertProblem(p)
              setEditing(null)
              setCreating(false)
            }}
            onDelete={
              editing
                ? () => {
                    deleteProblem(editing.id)
                    setEditing(null)
                  }
                : undefined
            }
          />
        </Modal>
      )}
    </div>
  )
}

function OpportunityMatrix({ problems, onOpen }: { problems: Problem[]; onOpen: (p: Problem) => void }) {
  return (
    <Card>
      <CardBody className="py-6">
        <div className="mb-4 flex items-center justify-between text-xs font-medium text-ink-faint">
          <span>Opportunity Matrix</span>
          <span>x: MVP difficulty · y: confidence</span>
        </div>
        <div className="relative h-72 rounded-lg border border-border bg-surface-muted/40">
          <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-border-strong" />
          <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-border-strong" />
          <span className="absolute left-2 top-1.5 text-[10px] text-ink-faint">high confidence, easy MVP</span>
          <span className="absolute bottom-1.5 right-2 text-[10px] text-ink-faint">low confidence, hard MVP</span>
          {problems.map((p) => {
            const x = ((p.mvpDifficulty - 1) / 4) * 92 + 4
            const y = 100 - (((p.confidence - 1) / 4) * 92 + 4)
            return (
              <button
                key={p.id}
                onClick={() => onOpen(p)}
                title={p.title}
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-accent shadow-sm hover:scale-125 transition-transform"
              />
            )
          })}
        </div>
      </CardBody>
    </Card>
  )
}

function ProblemForm({
  initial,
  id,
  onCancel,
  onSave,
  onDelete,
}: {
  initial: Omit<Problem, "id" | "createdAt">
  id?: string
  onCancel: () => void
  onSave: (p: Omit<Problem, "id" | "createdAt"> & { id?: string }) => void
  onDelete?: () => void
}) {
  const [form, setForm] = useState({ ...initial })
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <div className="space-y-4">
      <Field label="Title">
        <Input value={form.title} onChange={(e) => set("title", e.target.value)} autoFocus />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Industry">
          <Input value={form.industry} onChange={(e) => set("industry", e.target.value)} />
        </Field>
        <Field label="Customer">
          <Input value={form.customer} onChange={(e) => set("customer", e.target.value)} />
        </Field>
        <Field label="Status">
          <Select value={form.status} onChange={(e) => set("status", e.target.value as ProblemStatus)}>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Problem Description">
        <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Current Solution">
          <Textarea value={form.currentSolution} onChange={(e) => set("currentSolution", e.target.value)} />
        </Field>
        <Field label="Why Insufficient">
          <Textarea value={form.whyInsufficient} onChange={(e) => set("whyInsufficient", e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Spatial Component">
          <Textarea value={form.spatialComponent} onChange={(e) => set("spatialComponent", e.target.value)} />
        </Field>
        <Field label="Possible AI Opportunity">
          <Textarea value={form.aiOpportunity} onChange={(e) => set("aiOpportunity", e.target.value)} />
        </Field>
      </div>
      <Field label="Data Required">
        <Input value={form.dataRequired} onChange={(e) => set("dataRequired", e.target.value)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={`Technical Feasibility — ${form.technicalFeasibility}/5`}>
          <input type="range" min={1} max={5} value={form.technicalFeasibility} onChange={(e) => set("technicalFeasibility", Number(e.target.value))} className="w-full accent-accent" />
        </Field>
        <Field label={`MVP Difficulty — ${form.mvpDifficulty}/5`}>
          <input type="range" min={1} max={5} value={form.mvpDifficulty} onChange={(e) => set("mvpDifficulty", Number(e.target.value))} className="w-full accent-accent" />
        </Field>
        <Field label={`Confidence — ${form.confidence}/5`}>
          <input type="range" min={1} max={5} value={form.confidence} onChange={(e) => set("confidence", Number(e.target.value))} className="w-full accent-accent" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Potential Market">
          <Input value={form.potentialMarket} onChange={(e) => set("potentialMarket", e.target.value)} />
        </Field>
        <Field label="Willingness to Pay (estimate)">
          <Input value={form.willingnessToPay} onChange={(e) => set("willingnessToPay", e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Competition">
          <Input value={form.competition} onChange={(e) => set("competition", e.target.value)} />
        </Field>
        <Field label="Defensibility">
          <Input value={form.defensibility} onChange={(e) => set("defensibility", e.target.value)} />
        </Field>
      </div>
      <Field label="International Relevance">
        <Input value={form.internationalRelevance} onChange={(e) => set("internationalRelevance", e.target.value)} />
      </Field>

      <div className="flex items-center justify-between border-t border-border pt-4">
        {onDelete ? (
          <Button variant="danger" onClick={onDelete}>
            <Trash2 size={14} /> Delete
          </Button>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button variant="primary" disabled={!form.title.trim()} onClick={() => form.title.trim() && onSave({ ...form, id })}>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
