import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { useStore } from "../lib/store"
import type { Decision } from "../lib/types"
import { PageHeader } from "../components/ui/PageHeader"
import { Card, CardBody } from "../components/ui/Card"
import { Pill } from "../components/ui/Pill"
import { Button } from "../components/ui/Button"
import { Modal } from "../components/ui/Modal"
import { Field, Input, Textarea } from "../components/ui/Field"
import { EmptyState } from "../components/ui/EmptyState"

const empty: Omit<Decision, "id" | "createdAt"> = {
  decision: "",
  options: "",
  constraints: "",
  assumptions: "",
  experiments: "",
  reversible: true,
  status: "open",
  outcome: "",
}

export default function Decisions() {
  const { decisions, upsertDecision, deleteDecision } = useStore()
  const [editing, setEditing] = useState<Decision | null>(null)
  const [creating, setCreating] = useState(false)

  return (
    <div>
      <PageHeader
        eyebrow="Test What Can Be Tested"
        title="Decision Support"
        description="Distinguish reversible from irreversible decisions. Run small experiments before major commitments."
        actions={
          <Button variant="primary" onClick={() => setCreating(true)}>
            <Plus size={15} /> New Decision
          </Button>
        }
      />

      {decisions.length === 0 ? (
        <EmptyState
          message="When you're uncertain, write it down instead of circling it in your head."
          action={
            <Button variant="primary" onClick={() => setCreating(true)}>
              <Plus size={15} /> New Decision
            </Button>
          }
        />
      ) : (
        <div className="space-y-2.5">
          {decisions.map((d) => (
            <Card key={d.id} className="cursor-pointer hover:shadow-card" onClick={() => setEditing(d)}>
              <CardBody className="flex flex-wrap items-center gap-3 py-4">
                <Pill tone={d.reversible ? "good" : "warn"}>{d.reversible ? "reversible" : "irreversible"}</Pill>
                <Pill tone={d.status === "decided" ? "accent" : "neutral"}>{d.status}</Pill>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{d.decision}</span>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {(editing || creating) && (
        <Modal
          open
          onClose={() => {
            setEditing(null)
            setCreating(false)
          }}
          title={editing ? "Edit Decision" : "New Decision"}
        >
          <DecisionForm
            initial={editing ?? empty}
            id={editing?.id}
            onCancel={() => {
              setEditing(null)
              setCreating(false)
            }}
            onSave={(d) => {
              upsertDecision(d)
              setEditing(null)
              setCreating(false)
            }}
            onDelete={
              editing
                ? () => {
                    deleteDecision(editing.id)
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

function DecisionForm({
  initial,
  id,
  onCancel,
  onSave,
  onDelete,
}: {
  initial: Omit<Decision, "id" | "createdAt">
  id?: string
  onCancel: () => void
  onSave: (d: Omit<Decision, "id" | "createdAt"> & { id?: string }) => void
  onDelete?: () => void
}) {
  const [form, setForm] = useState({ ...initial })
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <div className="space-y-4">
      <Field label="Decision">
        <Input value={form.decision} onChange={(e) => set("decision", e.target.value)} autoFocus />
      </Field>
      <Field label="Options">
        <Textarea value={form.options} onChange={(e) => set("options", e.target.value)} />
      </Field>
      <Field label="Constraints">
        <Textarea value={form.constraints} onChange={(e) => set("constraints", e.target.value)} />
      </Field>
      <Field label="Assumptions">
        <Textarea value={form.assumptions} onChange={(e) => set("assumptions", e.target.value)} />
      </Field>
      <Field label="Possible Experiments" hint="Test what can be tested.">
        <Textarea value={form.experiments} onChange={(e) => set("experiments", e.target.value)} />
      </Field>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={form.reversible} onChange={(e) => set("reversible", e.target.checked)} className="h-4 w-4 accent-ink" />
          Reversible decision
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.status === "decided"}
            onChange={(e) => set("status", e.target.checked ? "decided" : "open")}
            className="h-4 w-4 accent-ink"
          />
          Decided
        </label>
      </div>

      {form.status === "decided" && (
        <Field label="Outcome">
          <Textarea value={form.outcome} onChange={(e) => set("outcome", e.target.value)} />
        </Field>
      )}

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
          <Button variant="primary" disabled={!form.decision.trim()} onClick={() => form.decision.trim() && onSave({ ...form, id })}>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
