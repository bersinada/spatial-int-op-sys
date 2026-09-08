import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { useStore } from "../lib/store"
import type { FounderModeItem } from "../lib/types"
import { PageHeader } from "../components/ui/PageHeader"
import { Card, CardBody } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Field"
import { EmptyState } from "../components/ui/EmptyState"

const kinds: Array<{ key: FounderModeItem["kind"]; label: string }> = [
  { key: "validated_problem", label: "Validated Problems" },
  { key: "promising_idea", label: "Promising Ideas" },
  { key: "active_experiment", label: "Active Experiments" },
  { key: "potential_customer", label: "Potential Customers" },
  { key: "prototype", label: "Prototypes" },
  { key: "market_observation", label: "Market Observations" },
]

export default function Founder() {
  const { founderMode, problems, upsertFounderItem, deleteFounderItem } = useStore()

  return (
    <div>
      <PageHeader
        eyebrow="Secondary — Build Capability First"
        title="Founder Mode"
        description="Observe problems continuously. Start when evidence appears, not before."
      />

      <div className="mb-8 rounded-lg border border-border-strong bg-surface-muted/50 px-4 py-3 text-sm text-ink-soft">
        Build capability first. Observe problems continuously. Start when evidence appears. ·{" "}
        <span className="font-medium text-ink">{problems.filter((p) => p.status === "PROMISING").length}</span> problems currently promising.
      </div>

      {founderMode.length === 0 ? (
        <EmptyState message="Nothing here yet — and that's fine. This layer stays secondary until evidence appears." />
      ) : null}

      <div className="space-y-8">
        {kinds.map(({ key, label }) => (
          <FounderSection key={key} kind={key} label={label} items={founderMode.filter((f) => f.kind === key)} onAdd={upsertFounderItem} onDelete={deleteFounderItem} />
        ))}
      </div>
    </div>
  )
}

function FounderSection({
  kind,
  label,
  items,
  onAdd,
  onDelete,
}: {
  kind: FounderModeItem["kind"]
  label: string
  items: FounderModeItem[]
  onAdd: (f: Omit<FounderModeItem, "id" | "createdAt"> & { id?: string }) => string
  onDelete: (id: string) => void
}) {
  const [draft, setDraft] = useState("")

  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-faint">{label}</h3>
      <Card>
        <CardBody className="py-3">
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.id} className="group flex items-center gap-3 py-2.5">
                <span className="flex-1 text-sm text-ink">{item.title}</span>
                <button onClick={() => onDelete(item.id)} className="rounded p-1 text-ink-faint opacity-0 group-hover:opacity-100 hover:text-red-600">
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-2">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add an observation…"
              onKeyDown={(e) => {
                if (e.key === "Enter" && draft.trim()) {
                  onAdd({ kind, title: draft.trim(), notes: "" })
                  setDraft("")
                }
              }}
            />
            <Button
              onClick={() => {
                if (draft.trim()) {
                  onAdd({ kind, title: draft.trim(), notes: "" })
                  setDraft("")
                }
              }}
            >
              <Plus size={15} />
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
