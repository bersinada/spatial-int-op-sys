import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { useStore } from "../lib/store"
import type { Article, ArticleStatus } from "../lib/types"
import { PageHeader } from "../components/ui/PageHeader"
import { Card, CardBody } from "../components/ui/Card"
import { Pill } from "../components/ui/Pill"
import { Button } from "../components/ui/Button"
import { Modal } from "../components/ui/Modal"
import { Field, Input, Select, Textarea } from "../components/ui/Field"
import { EmptyState } from "../components/ui/EmptyState"

const stages: ArticleStatus[] = ["IDEA", "RESEARCH", "DRAFT", "EDITING", "PUBLISHED"]

const statusTone: Record<ArticleStatus, "neutral" | "accent" | "good" | "warn"> = {
  IDEA: "neutral",
  RESEARCH: "neutral",
  DRAFT: "accent",
  EDITING: "warn",
  PUBLISHED: "good",
}

const empty: Omit<Article, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  status: "IDEA",
  topic: "",
  targetAudience: "",
  outline: "",
  draftLink: "",
  publicationLink: "",
  publicationDate: "",
  relatedProjectId: null,
}

export default function Writing() {
  const { articles, projects, upsertArticle, deleteArticle } = useStore()
  const [editing, setEditing] = useState<Article | null>(null)
  const [creating, setCreating] = useState(false)

  const published = articles.filter((a) => a.status === "PUBLISHED").length

  return (
    <div>
      <PageHeader
        eyebrow="Public Technical Identity"
        title="Writing"
        description={
          articles.length > 0
            ? `${published} published · ${articles.length - published} in progress. Consistency of quality, not a streak.`
            : "Publish what you learn. Build your public technical identity."
        }
        actions={
          <Button variant="primary" onClick={() => setCreating(true)}>
            <Plus size={15} /> New Article
          </Button>
        }
      />

      {articles.length === 0 ? (
        <EmptyState
          message="Publish what you learn. Build your public technical identity."
          action={
            <Button variant="primary" onClick={() => setCreating(true)}>
              <Plus size={15} /> New Article
            </Button>
          }
        />
      ) : (
        <div className="space-y-2.5">
          {stages
            .slice()
            .reverse()
            .flatMap((st) => articles.filter((a) => a.status === st))
            .map((a) => {
              const project = projects.find((p) => p.id === a.relatedProjectId)
              return (
                <Card key={a.id} className="cursor-pointer hover:shadow-card" onClick={() => setEditing(a)}>
                  <CardBody className="flex flex-wrap items-center gap-3 py-4">
                    <Pill tone={statusTone[a.status]}>{a.status}</Pill>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-ink">{a.title}</div>
                      {a.topic && <div className="truncate text-xs text-ink-faint">{a.topic}</div>}
                    </div>
                    {project && <Pill>{project.title}</Pill>}
                    {a.publicationDate && <span className="text-xs text-ink-faint">{a.publicationDate}</span>}
                  </CardBody>
                </Card>
              )
            })}
        </div>
      )}

      {(editing || creating) && (
        <ArticleModal
          article={editing}
          projects={projects}
          onClose={() => {
            setEditing(null)
            setCreating(false)
          }}
          onSave={(a) => {
            upsertArticle(a)
            setEditing(null)
            setCreating(false)
          }}
          onDelete={
            editing
              ? () => {
                  deleteArticle(editing.id)
                  setEditing(null)
                }
              : undefined
          }
        />
      )}
    </div>
  )
}

function ArticleModal({
  article,
  projects,
  onClose,
  onSave,
  onDelete,
}: {
  article: Article | null
  projects: { id: string; title: string }[]
  onClose: () => void
  onSave: (a: Omit<Article, "id" | "createdAt" | "updatedAt"> & { id?: string }) => void
  onDelete?: () => void
}) {
  const [form, setForm] = useState(article ? { ...article } : { id: undefined, ...empty })
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <Modal open onClose={onClose} title={article ? "Edit Article" : "New Article"} wide>
      <div className="space-y-4">
        <Field label="Title">
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} autoFocus />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status">
            <Select value={form.status} onChange={(e) => set("status", e.target.value as ArticleStatus)}>
              {stages.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Related Project">
            <Select value={form.relatedProjectId ?? ""} onChange={(e) => set("relatedProjectId", e.target.value || null)}>
              <option value="">None</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Topic">
            <Input value={form.topic} onChange={(e) => set("topic", e.target.value)} />
          </Field>
          <Field label="Target Audience">
            <Input value={form.targetAudience} onChange={(e) => set("targetAudience", e.target.value)} />
          </Field>
        </div>
        <Field label="Outline">
          <Textarea value={form.outline} onChange={(e) => set("outline", e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Draft Link">
            <Input value={form.draftLink} onChange={(e) => set("draftLink", e.target.value)} />
          </Field>
          <Field label="Publication Link">
            <Input value={form.publicationLink} onChange={(e) => set("publicationLink", e.target.value)} />
          </Field>
        </div>
        <Field label="Publication Date">
          <Input type="date" value={form.publicationDate} onChange={(e) => set("publicationDate", e.target.value)} />
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
