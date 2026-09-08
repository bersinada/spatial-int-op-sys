import { v4 as uuid } from "uuid"
import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { useStore } from "../lib/store"
import { Card, CardBody } from "../components/ui/Card"
import { InlineEdit } from "../components/InlineEdit"
import { Input } from "../components/ui/Field"

export default function MonthlyFocus() {
  const s = useStore()
  const [newTask, setNewTask] = useState("")
  const project = s.projects.find((p) => p.id === s.currentFocus.currentProjectId)
  const article = s.articles.find((a) => a.id === s.currentFocus.currentArticleId)

  const addTask = () => {
    if (!newTask.trim()) return
    s.updateCurrentFocus({
      supportingTasks: [...s.currentFocus.supportingTasks, { id: uuid(), title: newTask.trim(), done: false }],
    })
    setNewTask("")
  }

  const toggleTask = (id: string) =>
    s.updateCurrentFocus({
      supportingTasks: s.currentFocus.supportingTasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t,
      ),
    })

  const removeTask = (id: string) =>
    s.updateCurrentFocus({
      supportingTasks: s.currentFocus.supportingTasks.filter((t) => t.id !== id),
    })

  return (
    <div>
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-wider text-accent">
          {s.currentFocus.monthLabel.toUpperCase()}
        </div>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {s.currentFocus.theme.toUpperCase()}
        </h1>
      </div>

      <Card className="mb-8">
        <CardBody className="py-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">
            Monthly Objective
          </div>
          <InlineEdit
            value={s.currentFocus.objective}
            onSave={(v) => s.updateCurrentFocus({ objective: v })}
            multiline
            className="text-base leading-relaxed text-ink"
          />
        </CardBody>
      </Card>

      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-faint">Main Outcomes</div>
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <OutcomeCard title="Technical Build" value={project?.title ?? "No project linked yet"} />
        <OutcomeCard title="Technical Article" value={article?.title ?? "No article linked yet"} />
        <OutcomeCard
          title="Open Source"
          value="Explore Neo4j / OGC / GeoSPARQL ecosystem and make first meaningful contribution."
        />
        <OutcomeCard
          title="Global Visibility"
          value="Publish project and writing in English and connect with people working on Knowledge Graphs, GeoAI and Spatial Intelligence."
        />
      </div>

      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-faint">Supporting Tasks</div>
      <Card>
        <CardBody className="py-4">
          <ul className="divide-y divide-border">
            {s.currentFocus.supportingTasks.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-2.5">
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleTask(t.id)}
                  className="h-4 w-4 shrink-0 rounded border-border-strong accent-ink"
                />
                <span className={`flex-1 text-sm ${t.done ? "text-ink-faint line-through" : "text-ink"}`}>
                  {t.title}
                </span>
                <button
                  onClick={() => removeTask(t.id)}
                  className="rounded p-1 text-ink-faint opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Remove task"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
            {s.currentFocus.supportingTasks.length === 0 && (
              <li className="py-4 text-center text-sm text-ink-faint">No supporting tasks yet.</li>
            )}
          </ul>
          <div className="mt-3 flex gap-2">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Add a supporting task…"
            />
            <button
              onClick={addTask}
              className="flex shrink-0 items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink hover:bg-surface-muted"
            >
              <Plus size={15} /> Add
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

function OutcomeCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardBody className="py-5">
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-accent">{title}</div>
        <div className="text-sm leading-snug text-ink">{value}</div>
      </CardBody>
    </Card>
  )
}
