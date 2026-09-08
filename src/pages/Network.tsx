import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { useStore } from "../lib/store"
import type { Person, PersonCategory } from "../lib/types"
import { PageHeader } from "../components/ui/PageHeader"
import { Card, CardBody } from "../components/ui/Card"
import { Pill } from "../components/ui/Pill"
import { Button } from "../components/ui/Button"
import { Modal } from "../components/ui/Modal"
import { Field, Input, Select, Textarea } from "../components/ui/Field"
import { EmptyState } from "../components/ui/EmptyState"

const categories: PersonCategory[] = [
  "Spatial AI Engineer",
  "Geospatial AI Engineer",
  "3D Computer Vision Engineer",
  "Knowledge Graph Engineer",
  "Researcher",
  "Founder",
  "Open Source Maintainer",
  "PhD Student",
  "Potential Collaborator",
]

const empty: Omit<Person, "id" | "createdAt"> = {
  name: "",
  role: "",
  category: "Researcher",
  companyOrUniversity: "",
  field: "",
  profileUrl: "",
  github: "",
  location: "",
  whyRelevant: "",
  whatTheyWorkOn: "",
  lastInteraction: "",
  nextInteraction: "",
  notes: "",
  conversationIdeas: "",
}

function isStale(person: Person) {
  if (!person.lastInteraction) return false
  const days = (Date.now() - new Date(person.lastInteraction).getTime()) / 86400000
  return days > 45
}

export default function Network() {
  const { people, upsertPerson, deletePerson, currentFocus } = useStore()
  const [editing, setEditing] = useState<Person | null>(null)
  const [creating, setCreating] = useState(false)

  const reconnect = people.filter(isStale)
  const relevant = people.filter(
    (p) => !isStale(p) && (p.field.toLowerCase().includes(currentFocus.theme.toLowerCase().split(" ")[0]) ),
  )

  return (
    <div>
      <PageHeader
        eyebrow="Intentional, Not a CRM"
        title="Network"
        description="Meaningful technical relationships, not follower accumulation."
        actions={
          <Button variant="primary" onClick={() => setCreating(true)}>
            <Plus size={15} /> Add Person
          </Button>
        }
      />

      {people.length === 0 ? (
        <EmptyState
          message="Start with people who are already building in your direction."
          action={
            <Button variant="primary" onClick={() => setCreating(true)}>
              <Plus size={15} /> Add Person
            </Button>
          }
        />
      ) : (
        <div className="space-y-8">
          {reconnect.length > 0 && (
            <Section title="People I should reconnect with" people={reconnect} onOpen={setEditing} />
          )}
          {relevant.length > 0 && (
            <Section title={`Relevant to ${currentFocus.theme}`} people={relevant} onOpen={setEditing} />
          )}
          <Section title="Everyone" people={people} onOpen={setEditing} />
        </div>
      )}

      {(editing || creating) && (
        <Modal
          open
          onClose={() => {
            setEditing(null)
            setCreating(false)
          }}
          title={editing ? "Edit Person" : "Add Person"}
          wide
        >
          <PersonForm
            initial={editing ?? empty}
            id={editing?.id}
            onCancel={() => {
              setEditing(null)
              setCreating(false)
            }}
            onSave={(p) => {
              upsertPerson(p)
              setEditing(null)
              setCreating(false)
            }}
            onDelete={
              editing
                ? () => {
                    deletePerson(editing.id)
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

function Section({ title, people, onOpen }: { title: string; people: Person[]; onOpen: (p: Person) => void }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-faint">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p) => (
          <Card key={p.id} className="cursor-pointer hover:shadow-card" onClick={() => onOpen(p)}>
            <CardBody className="py-4">
              <div className="text-sm font-medium text-ink">{p.name}</div>
              <div className="mt-0.5 text-xs text-ink-faint">
                {p.role}{p.companyOrUniversity ? ` · ${p.companyOrUniversity}` : ""}
              </div>
              <div className="mt-2">
                <Pill>{p.category}</Pill>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}

function PersonForm({
  initial,
  id,
  onCancel,
  onSave,
  onDelete,
}: {
  initial: Omit<Person, "id" | "createdAt">
  id?: string
  onCancel: () => void
  onSave: (p: Omit<Person, "id" | "createdAt"> & { id?: string }) => void
  onDelete?: () => void
}) {
  const [form, setForm] = useState({ ...initial })
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} autoFocus />
        </Field>
        <Field label="Category">
          <Select value={form.category} onChange={(e) => set("category", e.target.value as PersonCategory)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Role">
          <Input value={form.role} onChange={(e) => set("role", e.target.value)} />
        </Field>
        <Field label="Company / University">
          <Input value={form.companyOrUniversity} onChange={(e) => set("companyOrUniversity", e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Field">
          <Input value={form.field} onChange={(e) => set("field", e.target.value)} />
        </Field>
        <Field label="Location">
          <Input value={form.location} onChange={(e) => set("location", e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Profile URL">
          <Input value={form.profileUrl} onChange={(e) => set("profileUrl", e.target.value)} />
        </Field>
        <Field label="GitHub">
          <Input value={form.github} onChange={(e) => set("github", e.target.value)} />
        </Field>
      </div>
      <Field label="Why Relevant">
        <Textarea value={form.whyRelevant} onChange={(e) => set("whyRelevant", e.target.value)} />
      </Field>
      <Field label="What They Work On">
        <Textarea value={form.whatTheyWorkOn} onChange={(e) => set("whatTheyWorkOn", e.target.value)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Last Interaction">
          <Input type="date" value={form.lastInteraction} onChange={(e) => set("lastInteraction", e.target.value)} />
        </Field>
        <Field label="Next Interaction">
          <Input type="date" value={form.nextInteraction} onChange={(e) => set("nextInteraction", e.target.value)} />
        </Field>
      </div>
      <Field label="Conversation Ideas">
        <Textarea value={form.conversationIdeas} onChange={(e) => set("conversationIdeas", e.target.value)} />
      </Field>
      <Field label="Notes">
        <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} />
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
          <Button variant="primary" disabled={!form.name.trim()} onClick={() => form.name.trim() && onSave({ ...form, id })}>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
