import { useState } from "react"
import { useStore } from "../lib/store"
import { PageHeader } from "../components/ui/PageHeader"
import { Card, CardBody } from "../components/ui/Card"
import { Field, Input, Textarea } from "../components/ui/Field"

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function Daily() {
  const { dailyEntries, upsertDailyEntry } = useStore()
  const date = todayISO()
  const existing = dailyEntries.find((d) => d.date === date)

  const [form, setForm] = useState(
    existing ?? {
      date,
      objective: "",
      technicalAction: "",
      visibilityAction: "",
      networkAction: "",
      optionalTask: "",
      completed: false,
      learned: "",
      blocker: "",
      nextStep: "",
    },
  )

  const save = (patch: Partial<typeof form>) => {
    const next = { ...form, ...patch }
    setForm(next)
    upsertDailyEntry({ ...next, id: existing?.id })
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        eyebrow={new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        title="Today"
        description="Five fields. That is enough."
      />

      <Card className="mb-6">
        <CardBody className="space-y-4 py-6">
          <Field label="Today's objective">
            <Input value={form.objective} onChange={(e) => save({ objective: e.target.value })} />
          </Field>
          <Field label="One technical action">
            <Input value={form.technicalAction} onChange={(e) => save({ technicalAction: e.target.value })} />
          </Field>
          <Field label="One visibility action">
            <Input value={form.visibilityAction} onChange={(e) => save({ visibilityAction: e.target.value })} />
          </Field>
          <Field label="One network action">
            <Input value={form.networkAction} onChange={(e) => save({ networkAction: e.target.value })} />
          </Field>
          <Field label="One optional task">
            <Input value={form.optionalTask} onChange={(e) => save({ optionalTask: e.target.value })} />
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-4 py-6">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-faint">End of Day</div>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.completed}
              onChange={(e) => save({ completed: e.target.checked })}
              className="h-4 w-4 accent-ink"
            />
            Completed
          </label>
          <Field label="What was learned?">
            <Textarea value={form.learned} onChange={(e) => save({ learned: e.target.value })} />
          </Field>
          <Field label="Blocker?">
            <Input value={form.blocker} onChange={(e) => save({ blocker: e.target.value })} />
          </Field>
          <Field label="Next step?">
            <Input value={form.nextStep} onChange={(e) => save({ nextStep: e.target.value })} />
          </Field>
        </CardBody>
      </Card>
    </div>
  )
}
