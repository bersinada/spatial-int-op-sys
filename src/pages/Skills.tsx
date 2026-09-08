import { useState } from "react"
import { useStore } from "../lib/store"
import type { Skill, SkillCategory } from "../lib/types"
import { PageHeader } from "../components/ui/PageHeader"
import { Card, CardBody } from "../components/ui/Card"
import { Modal } from "../components/ui/Modal"
import { Field, Input, Textarea } from "../components/ui/Field"
import { Button } from "../components/ui/Button"

const categories: SkillCategory[] = [
  "Spatial Foundations",
  "Spatial AI",
  "3D Intelligence",
  "Knowledge Representation",
  "AI Systems",
  "Engineering",
]

export default function Skills() {
  const { skills, projects, upsertSkill } = useStore()
  const [editing, setEditing] = useState<Skill | null>(null)

  return (
    <div>
      <PageHeader
        eyebrow="Backed by Evidence"
        title="Skills"
        description="Skill level is meaningful only when backed by a project, publication, contribution, or demo."
      />

      <div className="space-y-8">
        {categories.map((cat) => {
          const items = skills.filter((s) => s.category === cat)
          if (items.length === 0) return null
          return (
            <div key={cat}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-faint">{cat}</h3>
              <Card>
                <CardBody className="py-2">
                  {items.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => setEditing(s)}
                      className={`flex w-full items-center gap-4 py-2.5 text-left ${i !== items.length - 1 ? "border-b border-border/70" : ""}`}
                    >
                      <span className="w-44 shrink-0 truncate text-sm text-ink">{s.name}</span>
                      <SkillBar current={s.currentLevel} target={s.targetLevel} />
                      <span className="w-16 shrink-0 text-right text-xs text-ink-faint">{s.currentLevel}/{s.targetLevel}</span>
                      {s.evidence.trim() && <span className="hidden shrink-0 text-xs text-good sm:inline">evidence</span>}
                    </button>
                  ))}
                </CardBody>
              </Card>
            </div>
          )
        })}
      </div>

      {editing && (
        <Modal open onClose={() => setEditing(null)} title={editing.name}>
          <SkillForm
            skill={editing}
            projects={projects}
            onCancel={() => setEditing(null)}
            onSave={(s) => {
              upsertSkill(s)
              setEditing(null)
            }}
          />
        </Modal>
      )}
    </div>
  )
}

function SkillBar({ current, target }: { current: number; target: number }) {
  return (
    <div className="flex flex-1 items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${
            i < current ? "bg-accent" : i < target ? "bg-surface-muted border border-dashed border-border-strong" : "bg-surface-muted"
          }`}
        />
      ))}
    </div>
  )
}

function SkillForm({
  skill,
  projects,
  onCancel,
  onSave,
}: {
  skill: Skill
  projects: { id: string; title: string }[]
  onCancel: () => void
  onSave: (s: Skill) => void
}) {
  const [form, setForm] = useState({ ...skill })
  const set = <K extends keyof Skill>(key: K, value: Skill[K]) => setForm((f) => ({ ...f, [key]: value }))

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={`Current Level — ${form.currentLevel}/5`}>
          <input type="range" min={0} max={5} value={form.currentLevel} onChange={(e) => set("currentLevel", Number(e.target.value))} className="w-full accent-accent" />
        </Field>
        <Field label={`Target Level — ${form.targetLevel}/5`}>
          <input type="range" min={0} max={5} value={form.targetLevel} onChange={(e) => set("targetLevel", Number(e.target.value))} className="w-full accent-accent" />
        </Field>
      </div>
      <Field label={`Importance — ${form.importance}/5`}>
        <input type="range" min={1} max={5} value={form.importance} onChange={(e) => set("importance", Number(e.target.value))} className="w-full accent-accent" />
      </Field>
      <Field label="Evidence" hint="A project, publication, contribution, or demo that proves this level.">
        <Textarea value={form.evidence} onChange={(e) => set("evidence", e.target.value)} />
      </Field>
      <Field label="Related Projects">
        <select
          multiple
          value={form.relatedProjectIds}
          onChange={(e) => set("relatedProjectIds", Array.from(e.target.selectedOptions, (o) => o.value))}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Last Practiced">
          <Input type="date" value={form.lastPracticed} onChange={(e) => set("lastPracticed", e.target.value)} />
        </Field>
        <Field label="Next Action">
          <Input value={form.nextAction} onChange={(e) => set("nextAction", e.target.value)} />
        </Field>
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={() => onSave(form)}>
          Save
        </Button>
      </div>
    </div>
  )
}
