import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { useStore } from "../lib/store"
import type { GlobalPositioningCategory, GlobalPositioningItem } from "../lib/types"
import { PageHeader } from "../components/ui/PageHeader"
import { Card, CardBody } from "../components/ui/Card"
import { Pill } from "../components/ui/Pill"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Field"

const categories: Array<{ key: GlobalPositioningCategory; label: string }> = [
  { key: "role", label: "Target Roles" },
  { key: "country", label: "Target Countries" },
  { key: "university", label: "Universities" },
  { key: "program", label: "Master's Programs" },
  { key: "company", label: "Companies" },
  { key: "internship", label: "Internships" },
  { key: "conference", label: "Conferences" },
  { key: "community", label: "Communities" },
  { key: "ecosystem", label: "Open-Source Ecosystems" },
]

export default function GlobalPositioning() {
  const { globalPositioning, upsertGlobalPositioning, deleteGlobalPositioning } = useStore()

  return (
    <div>
      <PageHeader
        eyebrow="Beyond the Local Market"
        title="Global Positioning"
        description="Track international targets and compare potential roles against your current skill evidence."
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {categories.map(({ key, label }) => (
          <GpSection
            key={key}
            category={key}
            label={label}
            items={globalPositioning.filter((g) => g.category === key)}
            onAdd={upsertGlobalPositioning}
            onDelete={deleteGlobalPositioning}
          />
        ))}
      </div>
    </div>
  )
}

function GpSection({
  category,
  label,
  items,
  onAdd,
  onDelete,
}: {
  category: GlobalPositioningCategory
  label: string
  items: GlobalPositioningItem[]
  onAdd: (g: GlobalPositioningItem) => void
  onDelete: (id: string) => void
}) {
  const [draft, setDraft] = useState("")

  const submit = () => {
    if (!draft.trim()) return
    onAdd({ id: crypto.randomUUID(), category, name: draft.trim(), notes: "", status: "target" })
    setDraft("")
  }

  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-faint">{label}</h3>
      <Card>
        <CardBody className="py-3">
          {items.length === 0 && <p className="py-1 text-sm text-ink-faint">Nothing added yet.</p>}
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.id} className="group flex items-center gap-2 py-2">
                <span className="flex-1 text-sm text-ink">{item.name}</span>
                <Pill>{item.status}</Pill>
                <button onClick={() => onDelete(item.id)} className="rounded p-1 text-ink-faint opacity-0 group-hover:opacity-100 hover:text-red-600">
                  <Trash2 size={13} />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-2">
            <Input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="Add…" />
            <Button onClick={submit}>
              <Plus size={15} />
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
