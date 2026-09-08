import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { useStore } from "../lib/store"
import type { Note } from "../lib/types"
import { PageHeader } from "../components/ui/PageHeader"
import { Card, CardBody } from "../components/ui/Card"
import { Pill } from "../components/ui/Pill"
import { Button } from "../components/ui/Button"
import { Modal } from "../components/ui/Modal"
import { Field, Input, Select, Textarea } from "../components/ui/Field"
import { EmptyState } from "../components/ui/EmptyState"

const categories = [
  "Spatial Intelligence",
  "Knowledge Graphs",
  "GeoSPARQL",
  "3D",
  "Computer Vision",
  "Agents",
  "World Models",
  "Digital Twins",
  "Startup",
  "Companies",
  "People",
  "Papers",
]

const empty: Omit<Note, "id" | "createdAt"> = {
  title: "",
  category: categories[0],
  content: "",
  linkedProjectId: null,
  linkedArticleId: null,
  linkedPersonId: null,
  linkedSkillId: null,
  linkedProblemId: null,
}

export default function Knowledge() {
  const { notes, projects, articles, people, skills, problems, upsertNote, deleteNote } = useStore()
  const [editing, setEditing] = useState<Note | null>(null)
  const [creating, setCreating] = useState(false)
  const [filter, setFilter] = useState<string | null>(null)

  const visible = filter ? notes.filter((n) => n.category === filter) : notes

  return (
    <div>
      <PageHeader
        eyebrow="Personal Knowledge Graph"
        title="Knowledge"
        description="Notes that link to your projects, articles, people, skills, and problems."
        actions={
          <Button variant="primary" onClick={() => setCreating(true)}>
            <Plus size={15} /> New Note
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-1.5">
        <FilterPill active={filter === null} onClick={() => setFilter(null)}>
          All
        </FilterPill>
        {categories
          .filter((c) => notes.some((n) => n.category === c))
          .map((c) => (
            <FilterPill key={c} active={filter === c} onClick={() => setFilter(c)}>
              {c}
            </FilterPill>
          ))}
      </div>

      {notes.length === 0 ? (
        <EmptyState
          message="Slowly build a personal knowledge graph of your own work."
          action={
            <Button variant="primary" onClick={() => setCreating(true)}>
              <Plus size={15} /> New Note
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((n) => (
            <Card key={n.id} className="cursor-pointer hover:shadow-card" onClick={() => setEditing(n)}>
              <CardBody className="py-4">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <h3 className="truncate text-sm font-medium text-ink">{n.title}</h3>
                </div>
                <Pill>{n.category}</Pill>
                {n.content && <p className="mt-2 line-clamp-3 text-xs text-ink-soft">{n.content}</p>}
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
          title={editing ? "Edit Note" : "New Note"}
          wide
        >
          <NoteForm
            initial={editing ?? empty}
            id={editing?.id}
            projects={projects}
            articles={articles}
            people={people}
            skills={skills}
            problems={problems}
            onCancel={() => {
              setEditing(null)
              setCreating(false)
            }}
            onSave={(n) => {
              upsertNote(n)
              setEditing(null)
              setCreating(false)
            }}
            onDelete={
              editing
                ? () => {
                    deleteNote(editing.id)
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

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
        active ? "border-ink bg-ink text-canvas" : "border-border bg-surface text-ink-soft hover:bg-surface-muted"
      }`}
    >
      {children}
    </button>
  )
}

function NoteForm({
  initial,
  id,
  projects,
  articles,
  people,
  skills,
  problems,
  onCancel,
  onSave,
  onDelete,
}: {
  initial: Omit<Note, "id" | "createdAt">
  id?: string
  projects: { id: string; title: string }[]
  articles: { id: string; title: string }[]
  people: { id: string; name: string }[]
  skills: { id: string; name: string }[]
  problems: { id: string; title: string }[]
  onCancel: () => void
  onSave: (n: Omit<Note, "id" | "createdAt"> & { id?: string }) => void
  onDelete?: () => void
}) {
  const [form, setForm] = useState({ ...initial })
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title">
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} autoFocus />
        </Field>
        <Field label="Category">
          <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Content">
        <Textarea value={form.content} onChange={(e) => set("content", e.target.value)} className="min-h-40" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <LinkSelect label="Project" value={form.linkedProjectId} onChange={(v) => set("linkedProjectId", v)} options={projects.map((p) => ({ id: p.id, label: p.title }))} />
        <LinkSelect label="Article" value={form.linkedArticleId} onChange={(v) => set("linkedArticleId", v)} options={articles.map((a) => ({ id: a.id, label: a.title }))} />
        <LinkSelect label="Person" value={form.linkedPersonId} onChange={(v) => set("linkedPersonId", v)} options={people.map((p) => ({ id: p.id, label: p.name }))} />
        <LinkSelect label="Skill" value={form.linkedSkillId} onChange={(v) => set("linkedSkillId", v)} options={skills.map((s) => ({ id: s.id, label: s.name }))} />
        <LinkSelect label="Problem" value={form.linkedProblemId} onChange={(v) => set("linkedProblemId", v)} options={problems.map((p) => ({ id: p.id, label: p.title }))} />
      </div>

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

function LinkSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string | null
  onChange: (v: string | null) => void
  options: { id: string; label: string }[]
}) {
  return (
    <Field label={label}>
      <Select value={value ?? ""} onChange={(e) => onChange(e.target.value || null)}>
        <option value="">None</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </Select>
    </Field>
  )
}
