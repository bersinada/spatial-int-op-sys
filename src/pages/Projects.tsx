import { useState } from "react"
import { Plus, ExternalLink, GitFork, Trash2 } from "lucide-react"
import { useStore } from "../lib/store"
import type { Project, ProjectStatus } from "../lib/types"
import { PageHeader } from "../components/ui/PageHeader"
import { Card, CardBody } from "../components/ui/Card"
import { Pill } from "../components/ui/Pill"
import { Button } from "../components/ui/Button"
import { Modal } from "../components/ui/Modal"
import { Field, Input, Select, Textarea } from "../components/ui/Field"
import { EmptyState } from "../components/ui/EmptyState"

const lifecycle: ProjectStatus[] = [
  "IDEA",
  "RESEARCH",
  "BUILDING",
  "EXPERIMENT",
  "DOCUMENTATION",
  "PUBLISHED",
  "ARCHIVED",
]

const statusTone: Record<ProjectStatus, "neutral" | "accent" | "good" | "warn"> = {
  IDEA: "neutral",
  RESEARCH: "neutral",
  BUILDING: "accent",
  EXPERIMENT: "accent",
  DOCUMENTATION: "warn",
  PUBLISHED: "good",
  ARCHIVED: "neutral",
}

const emptyProject: Omit<Project, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  problem: "",
  motivation: "",
  technicalTopic: "",
  technologies: [],
  dataset: "",
  architecture: "",
  status: "IDEA",
  startDate: "",
  targetDate: "",
  githubUrl: "",
  demoUrl: "",
  articleUrl: "",
  notes: "",
  results: "",
  failureCases: "",
  lessonsLearned: "",
  futureWork: "",
  roadmapMonthId: null,
}

export default function Projects() {
  const { projects, roadmap, upsertProject, deleteProject } = useStore()
  const [editing, setEditing] = useState<Project | null>(null)
  const [creating, setCreating] = useState(false)

  return (
    <div>
      <PageHeader
        eyebrow="Proof of Work"
        title="Projects"
        description="Technical projects, tracked from idea to publication."
        actions={
          <Button variant="primary" onClick={() => setCreating(true)}>
            <Plus size={15} /> New Project
          </Button>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          message="Your first proof of work starts here."
          action={
            <Button variant="primary" onClick={() => setCreating(true)}>
              <Plus size={15} /> New Project
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((p) => {
            const month = roadmap.find((m) => m.id === p.roadmapMonthId)
            return (
              <Card key={p.id} className="cursor-pointer transition-shadow hover:shadow-card" onClick={() => setEditing(p)}>
                <CardBody className="py-5">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="font-display text-sm font-semibold leading-snug text-ink">{p.title}</h3>
                    <Pill tone={statusTone[p.status]}>{p.status}</Pill>
                  </div>
                  {p.technicalTopic && <p className="mb-2 text-xs text-ink-faint">{p.technicalTopic}</p>}
                  {p.problem && <p className="mb-3 line-clamp-2 text-sm text-ink-soft">{p.problem}</p>}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
                    {month && <Pill>{month.label}</Pill>}
                    {p.githubUrl && <GitFork size={13} />}
                    {p.demoUrl && <ExternalLink size={13} />}
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}

      {(editing || creating) && (
        <ProjectModal
          project={editing}
          roadmapMonths={roadmap}
          onClose={() => {
            setEditing(null)
            setCreating(false)
          }}
          onSave={(p) => {
            upsertProject(p)
            setEditing(null)
            setCreating(false)
          }}
          onDelete={
            editing
              ? () => {
                  deleteProject(editing.id)
                  setEditing(null)
                }
              : undefined
          }
        />
      )}
    </div>
  )
}

function ProjectModal({
  project,
  roadmapMonths,
  onClose,
  onSave,
  onDelete,
}: {
  project: Project | null
  roadmapMonths: { id: string; label: string }[]
  onClose: () => void
  onSave: (p: Omit<Project, "id" | "createdAt" | "updatedAt"> & { id?: string }) => void
  onDelete?: () => void
}) {
  const [form, setForm] = useState(project ? { ...project } : { id: undefined, ...emptyProject })
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <Modal open onClose={onClose} title={project ? "Edit Project" : "New Project"} wide>
      <div className="space-y-4">
        <Field label="Title">
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} autoFocus />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status">
            <Select value={form.status} onChange={(e) => set("status", e.target.value as ProjectStatus)}>
              {lifecycle.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Roadmap Month">
            <Select
              value={form.roadmapMonthId ?? ""}
              onChange={(e) => set("roadmapMonthId", e.target.value || null)}
            >
              <option value="">Unassigned</option>
              {roadmapMonths.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Problem">
          <Textarea value={form.problem} onChange={(e) => set("problem", e.target.value)} />
        </Field>
        <Field label="Motivation">
          <Textarea value={form.motivation} onChange={(e) => set("motivation", e.target.value)} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Technical Topic">
            <Input value={form.technicalTopic} onChange={(e) => set("technicalTopic", e.target.value)} />
          </Field>
          <Field label="Technologies (comma separated)">
            <Input
              value={form.technologies.join(", ")}
              onChange={(e) => set("technologies", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Dataset">
            <Input value={form.dataset} onChange={(e) => set("dataset", e.target.value)} />
          </Field>
          <Field label="Architecture">
            <Input value={form.architecture} onChange={(e) => set("architecture", e.target.value)} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Start Date">
            <Input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
          </Field>
          <Field label="Target Date">
            <Input type="date" value={form.targetDate} onChange={(e) => set("targetDate", e.target.value)} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="GitHub URL">
            <Input value={form.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} />
          </Field>
          <Field label="Demo URL">
            <Input value={form.demoUrl} onChange={(e) => set("demoUrl", e.target.value)} />
          </Field>
          <Field label="Article URL">
            <Input value={form.articleUrl} onChange={(e) => set("articleUrl", e.target.value)} />
          </Field>
        </div>

        <Field label="Notes">
          <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </Field>
        <Field label="Results">
          <Textarea value={form.results} onChange={(e) => set("results", e.target.value)} />
        </Field>
        <Field label="Failure Cases">
          <Textarea value={form.failureCases} onChange={(e) => set("failureCases", e.target.value)} />
        </Field>
        <Field label="Lessons Learned">
          <Textarea value={form.lessonsLearned} onChange={(e) => set("lessonsLearned", e.target.value)} />
        </Field>
        <Field label="Future Work">
          <Textarea value={form.futureWork} onChange={(e) => set("futureWork", e.target.value)} />
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
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={() => form.title.trim() && onSave(form)} disabled={!form.title.trim()}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
