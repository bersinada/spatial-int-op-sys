import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { useStore } from "../lib/store"
import type { OpenSourceContribution } from "../lib/types"
import { PageHeader } from "../components/ui/PageHeader"
import { Card, CardBody } from "../components/ui/Card"
import { Pill } from "../components/ui/Pill"
import { Button } from "../components/ui/Button"
import { Modal } from "../components/ui/Modal"
import { Field, Input, Textarea } from "../components/ui/Field"
import { EmptyState } from "../components/ui/EmptyState"

const ecosystems = ["OGC", "GeoSPARQL", "OSGeo", "PostGIS", "GDAL", "PROJ", "Cesium", "Neo4j", "Other"]

const empty: Omit<OpenSourceContribution, "id" | "createdAt"> = {
  project: "",
  ecosystem: "",
  repository: "",
  contributionType: "",
  issuePrUrl: "",
  status: "OPEN",
  date: "",
  technicalArea: "",
  lessonLearned: "",
}

export default function OpenSource() {
  const { openSource, upsertOpenSource, deleteOpenSource } = useStore()
  const [editing, setEditing] = useState<OpenSourceContribution | null>(null)
  const [creating, setCreating] = useState(false)

  const sorted = [...openSource].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <div>
      <PageHeader
        eyebrow="Ecosystem Involvement"
        title="Open Source"
        description="Contributions to the geospatial, knowledge graph, and 3D ecosystems."
        actions={
          <Button variant="primary" onClick={() => setCreating(true)}>
            <Plus size={15} /> Log Contribution
          </Button>
        }
      />

      {openSource.length === 0 ? (
        <EmptyState
          message="Start with a small, real contribution to a project you already use."
          action={
            <Button variant="primary" onClick={() => setCreating(true)}>
              <Plus size={15} /> Log Contribution
            </Button>
          }
        />
      ) : (
        <div className="relative space-y-0 border-l border-border pl-6">
          {sorted.map((o) => (
            <div key={o.id} className="relative pb-6 last:pb-0">
              <div className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-accent" />
              <Card className="cursor-pointer hover:shadow-card" onClick={() => setEditing(o)}>
                <CardBody className="py-4">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-ink">{o.project}</span>
                    {o.ecosystem && <Pill tone="accent">{o.ecosystem}</Pill>}
                    <span className="text-xs text-ink-faint">{o.date}</span>
                  </div>
                  <div className="text-xs text-ink-soft">{o.contributionType}{o.technicalArea ? ` · ${o.technicalArea}` : ""}</div>
                </CardBody>
              </Card>
            </div>
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
          title={editing ? "Edit Contribution" : "Log Contribution"}
        >
          <OsForm
            initial={editing ?? empty}
            id={editing?.id}
            onCancel={() => {
              setEditing(null)
              setCreating(false)
            }}
            onSave={(o) => {
              upsertOpenSource(o)
              setEditing(null)
              setCreating(false)
            }}
            onDelete={
              editing
                ? () => {
                    deleteOpenSource(editing.id)
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

function OsForm({
  initial,
  id,
  onCancel,
  onSave,
  onDelete,
}: {
  initial: Omit<OpenSourceContribution, "id" | "createdAt">
  id?: string
  onCancel: () => void
  onSave: (o: Omit<OpenSourceContribution, "id" | "createdAt"> & { id?: string }) => void
  onDelete?: () => void
}) {
  const [form, setForm] = useState({ ...initial })
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <div className="space-y-4">
      <Field label="Project">
        <Input value={form.project} onChange={(e) => set("project", e.target.value)} autoFocus />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ecosystem">
          <Input list="ecosystems" value={form.ecosystem} onChange={(e) => set("ecosystem", e.target.value)} />
        </Field>
        <Field label="Repository">
          <Input value={form.repository} onChange={(e) => set("repository", e.target.value)} />
        </Field>
      </div>
      <datalist id="ecosystems">
        {ecosystems.map((e) => (
          <option key={e} value={e} />
        ))}
      </datalist>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Contribution Type">
          <Input value={form.contributionType} onChange={(e) => set("contributionType", e.target.value)} placeholder="PR, issue, docs, example…" />
        </Field>
        <Field label="Issue / PR URL">
          <Input value={form.issuePrUrl} onChange={(e) => set("issuePrUrl", e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Status">
          <Input value={form.status} onChange={(e) => set("status", e.target.value)} placeholder="open, merged, closed…" />
        </Field>
        <Field label="Date">
          <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
        </Field>
      </div>
      <Field label="Technical Area">
        <Input value={form.technicalArea} onChange={(e) => set("technicalArea", e.target.value)} />
      </Field>
      <Field label="Lesson Learned">
        <Textarea value={form.lessonLearned} onChange={(e) => set("lessonLearned", e.target.value)} />
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
          <Button
            variant="primary"
            disabled={!form.project.trim()}
            onClick={() => form.project.trim() && onSave({ ...form, id })}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
