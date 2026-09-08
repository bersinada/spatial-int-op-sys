import { useState } from "react"
import { useStore } from "../lib/store"
import type { MonthlyReview, QuarterlyReview, WeeklyReview } from "../lib/types"
import { PageHeader } from "../components/ui/PageHeader"
import { Card, CardBody } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Field, Input, Textarea } from "../components/ui/Field"

type Tab = "weekly" | "monthly" | "quarterly"

const weeklyQuestions: Array<[keyof Omit<WeeklyReview, "id" | "createdAt" | "weekOf">, string]> = [
  ["whatBuilt", "What did I build?"],
  ["whatLearned", "What did I learn?"],
  ["whatPublished", "What did I publish?"],
  ["whatContributed", "What did I contribute?"],
  ["whoConnected", "Who did I connect with?"],
  ["movedCloser", "What moved me closer to becoming a Spatial Intelligence Engineer?"],
  ["whereOverthought", "Where did I overthink?"],
  ["whatStop", "What should I stop doing?"],
  ["mostImportantNext", "What is the most important next action?"],
]

const emptyWeekly: Omit<WeeklyReview, "id" | "createdAt"> = {
  weekOf: "",
  whatBuilt: "",
  whatLearned: "",
  whatPublished: "",
  whatContributed: "",
  whoConnected: "",
  movedCloser: "",
  whereOverthought: "",
  whatStop: "",
  mostImportantNext: "",
}

const monthlyQuestions: Array<[keyof Omit<MonthlyReview, "id" | "createdAt" | "monthLabel">, string]> = [
  ["whatChanged", "What actually changed this month?"],
  ["evidenceOfProgress", "What evidence proves progress?"],
  ["whatWasBusywork", "What was busywork?"],
  ["whatToChange", "What should change next month?"],
]
const emptyMonthly: Omit<MonthlyReview, "id" | "createdAt"> = {
  monthLabel: "",
  whatChanged: "",
  evidenceOfProgress: "",
  whatWasBusywork: "",
  whatToChange: "",
}

const quarterlyQuestions: Array<[keyof Omit<QuarterlyReview, "id" | "createdAt" | "quarterLabel">, string]> = [
  ["specializationClarity", "Is my current specialization becoming clearer or more fragmented?"],
  ["peopleAssociation", "What are people beginning to associate me with?"],
  ["unfairAdvantage", "Which capability could become my unfair advantage?"],
  ["whatToStopLearning", "What should I stop learning?"],
]
const emptyQuarterly: Omit<QuarterlyReview, "id" | "createdAt"> = {
  quarterLabel: "",
  specializationClarity: "",
  peopleAssociation: "",
  unfairAdvantage: "",
  whatToStopLearning: "",
}

export default function Reviews() {
  const [tab, setTab] = useState<Tab>("weekly")
  const s = useStore()

  return (
    <div>
      <PageHeader eyebrow="Reflection, Not Rumination" title="Reviews" description="Weekly, monthly, and quarterly checkpoints." />

      <div className="mb-6 flex gap-1 rounded-lg border border-border bg-surface-muted/50 p-1 w-fit">
        {(["weekly", "monthly", "quarterly"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-3.5 py-1.5 text-sm font-medium capitalize transition-colors ${
              tab === t ? "bg-surface shadow-subtle text-ink" : "text-ink-soft hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "weekly" && (
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardBody className="py-6">
              <WeeklyFormPanel onSave={(f) => s.addWeeklyReview(f)} />
            </CardBody>
          </Card>
          <div className="space-y-3">
            {s.weeklyReviews.length === 0 && <p className="text-sm text-ink-faint">No reviews yet.</p>}
            {s.weeklyReviews.map((e) => (
              <Card key={e.id}>
                <CardBody className="py-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">{e.weekOf}</div>
                  <div className="space-y-2 text-sm text-ink-soft">
                    {weeklyQuestions.map(([key, label]) =>
                      e[key] ? (
                        <div key={String(key)}>
                          <div className="text-xs text-ink-faint">{label}</div>
                          <div className="text-ink">{e[key]}</div>
                        </div>
                      ) : null,
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "monthly" && (
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardBody className="py-6">
              <MonthlyFormPanel onSave={(f) => s.addMonthlyReview(f)} />
            </CardBody>
          </Card>
          <div className="space-y-3">
            {s.monthlyReviews.length === 0 && <p className="text-sm text-ink-faint">No reviews yet.</p>}
            {s.monthlyReviews.map((e) => (
              <Card key={e.id}>
                <CardBody className="py-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">{e.monthLabel}</div>
                  <div className="space-y-2 text-sm text-ink-soft">
                    {monthlyQuestions.map(([key, label]) =>
                      e[key] ? (
                        <div key={String(key)}>
                          <div className="text-xs text-ink-faint">{label}</div>
                          <div className="text-ink">{e[key]}</div>
                        </div>
                      ) : null,
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "quarterly" && (
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardBody className="py-6">
              <QuarterlyFormPanel onSave={(f) => s.addQuarterlyReview(f)} />
            </CardBody>
          </Card>
          <div className="space-y-3">
            {s.quarterlyReviews.length === 0 && <p className="text-sm text-ink-faint">No reviews yet.</p>}
            {s.quarterlyReviews.map((e) => (
              <Card key={e.id}>
                <CardBody className="py-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">{e.quarterLabel}</div>
                  <div className="space-y-2 text-sm text-ink-soft">
                    {quarterlyQuestions.map(([key, label]) =>
                      e[key] ? (
                        <div key={String(key)}>
                          <div className="text-xs text-ink-faint">{label}</div>
                          <div className="text-ink">{e[key]}</div>
                        </div>
                      ) : null,
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function WeeklyFormPanel({ onSave }: { onSave: (f: Omit<WeeklyReview, "id" | "createdAt">) => void }) {
  const [form, setForm] = useState({ ...emptyWeekly })
  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }))
  return (
    <>
      <div className="mb-4">
        <Field label="Week of">
          <Input value={form.weekOf} onChange={(e) => set("weekOf", e.target.value)} placeholder="e.g. Sep 8 – Sep 14" />
        </Field>
      </div>
      <div className="space-y-4">
        {weeklyQuestions.map(([key, label]) => (
          <Field key={String(key)} label={label}>
            <Textarea value={form[key]} onChange={(e) => set(key, e.target.value)} />
          </Field>
        ))}
      </div>
      <div className="mt-5 flex justify-end">
        <Button
          variant="primary"
          onClick={() => {
            onSave({ ...form, weekOf: form.weekOf || new Date().toLocaleDateString() })
            setForm({ ...emptyWeekly })
          }}
        >
          Save Review
        </Button>
      </div>
    </>
  )
}

function MonthlyFormPanel({ onSave }: { onSave: (f: Omit<MonthlyReview, "id" | "createdAt">) => void }) {
  const [form, setForm] = useState({ ...emptyMonthly })
  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }))
  return (
    <>
      <div className="mb-4">
        <Field label="Month">
          <Input value={form.monthLabel} onChange={(e) => set("monthLabel", e.target.value)} placeholder="e.g. September 2026" />
        </Field>
      </div>
      <div className="space-y-4">
        {monthlyQuestions.map(([key, label]) => (
          <Field key={String(key)} label={label}>
            <Textarea value={form[key]} onChange={(e) => set(key, e.target.value)} />
          </Field>
        ))}
      </div>
      <div className="mt-5 flex justify-end">
        <Button
          variant="primary"
          onClick={() => {
            onSave({ ...form, monthLabel: form.monthLabel || new Date().toLocaleDateString() })
            setForm({ ...emptyMonthly })
          }}
        >
          Save Review
        </Button>
      </div>
    </>
  )
}

function QuarterlyFormPanel({ onSave }: { onSave: (f: Omit<QuarterlyReview, "id" | "createdAt">) => void }) {
  const [form, setForm] = useState({ ...emptyQuarterly })
  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }))
  return (
    <>
      <div className="mb-4">
        <Field label="Quarter">
          <Input value={form.quarterLabel} onChange={(e) => set("quarterLabel", e.target.value)} placeholder="e.g. Q3 2026" />
        </Field>
      </div>
      <div className="space-y-4">
        {quarterlyQuestions.map(([key, label]) => (
          <Field key={String(key)} label={label}>
            <Textarea value={form[key]} onChange={(e) => set(key, e.target.value)} />
          </Field>
        ))}
      </div>
      <div className="mt-5 flex justify-end">
        <Button
          variant="primary"
          onClick={() => {
            onSave({ ...form, quarterLabel: form.quarterLabel || new Date().toLocaleDateString() })
            setForm({ ...emptyQuarterly })
          }}
        >
          Save Review
        </Button>
      </div>
    </>
  )
}
