import { Link } from "react-router-dom"
import { ArrowRight, Sparkles } from "lucide-react"
import { useStore } from "../lib/store"
import { computeEvidenceCounts, computeLongTermDimensions } from "../lib/derived"
import { Card, CardBody } from "../components/ui/Card"
import { ProgressBar } from "../components/ui/ProgressBar"
import { InlineEdit } from "../components/InlineEdit"
import { Pill } from "../components/ui/Pill"

const eras = [
  { year: "2026", label: "Foundation" },
  { year: "2027", label: "Specialization" },
  { year: "2028", label: "International Expansion" },
  { year: "2029", label: "Product / Startup" },
]

const dimensionLabels: Array<{ key: keyof ReturnType<typeof computeLongTermDimensions>; label: string }> = [
  { key: "capability", label: "Capability" },
  { key: "proofOfWork", label: "Proof of Work" },
  { key: "reputation", label: "Reputation" },
  { key: "network", label: "Network" },
  { key: "optionality", label: "Optionality" },
]

export default function Dashboard() {
  const s = useStore()
  const dims = computeLongTermDimensions(s)
  const evidence = computeEvidenceCounts(s)

  const currentProject = s.projects.find((p) => p.id === s.currentFocus.currentProjectId)
  const currentArticle = s.articles.find((a) => a.id === s.currentFocus.currentArticleId)

  const recentProject = [...s.projects].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]
  const recentArticle = [...s.articles].filter((a) => a.status === "PUBLISHED").sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]
  const recentOs = [...s.openSource].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
  const recentPerson = [...s.people].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
  const recentProblem = [...s.problems].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]

  return (
    <div className="space-y-8">
      {/* A. North Star */}
      <Card className="border-ink/10 bg-gradient-to-br from-surface to-surface-muted/40">
        <CardBody className="py-8">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">North Star</div>
          <InlineEdit
            as="h1"
            value={s.northStar.mission}
            onSave={(v) => s.updateNorthStar({ mission: v })}
            className="font-display text-2xl font-semibold leading-snug tracking-tight text-ink sm:text-3xl"
            multiline
          />
          <InlineEdit
            value={s.northStar.specialization}
            onSave={(v) => s.updateNorthStar({ specialization: v })}
            className="mt-3 text-sm font-medium text-ink-soft sm:text-base"
          />
        </CardBody>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* C. One Thing That Matters Today — most prominent after north star */}
        <Card className="border-accent/25 bg-accent-soft/40 lg:col-span-2">
          <CardBody className="py-7">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
              <Sparkles size={13} /> Today
            </div>
            <h2 className="font-display text-xl font-semibold leading-snug text-ink sm:text-2xl">
              {s.todayAction.title}
            </h2>
            <p className="mt-3 text-sm text-ink-soft">{s.todayAction.why}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-ink-faint">
              <Pill tone="accent">{s.todayAction.effort}</Pill>
              <span>·</span>
              <span>{s.todayAction.relatedObjective}</span>
            </div>
            <Link
              to="/clarity"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              Enter Clarity Mode <ArrowRight size={14} />
            </Link>
          </CardBody>
        </Card>

        {/* B. Current Focus */}
        <Card>
          <CardBody className="py-6">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-faint">
              {s.currentFocus.monthLabel}
            </div>
            <div className="font-display text-base font-semibold text-ink">{s.currentFocus.theme}</div>
            <div className="mt-3 space-y-1 text-sm text-ink-soft">
              {currentProject && <div>Project: {currentProject.title}</div>}
              {currentArticle && <div>Article: {currentArticle.title}</div>}
            </div>
            <div className="mt-4 space-y-2.5">
              {(
                [
                  ["Project", s.currentFocus.progress.project],
                  ["Article", s.currentFocus.progress.article],
                  ["Open Source", s.currentFocus.progress.openSource],
                  ["Network", s.currentFocus.progress.network],
                  ["Learning", s.currentFocus.progress.learning],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-xs text-ink-faint">
                    <span>{label}</span>
                    <span>{value}%</span>
                  </div>
                  <ProgressBar value={value} size="sm" />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* D. Monthly Scorecard */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-faint">Monthly Scorecard</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {(
            [
              ["Project", s.monthlyScorecard.project],
              ["Article", s.monthlyScorecard.article],
              ["Open Source", s.monthlyScorecard.openSource],
              ["Network", s.monthlyScorecard.network],
              ["Startup Discovery", s.monthlyScorecard.startupDiscovery],
            ] as const
          ).map(([label, value]) => (
            <Card key={label}>
              <CardBody className="py-4">
                <div className="text-2xl font-semibold tracking-tight text-ink">{value}%</div>
                <div className="mt-1 text-xs uppercase tracking-wide text-ink-faint">{label}</div>
                <div className="mt-2.5">
                  <ProgressBar value={value} size="sm" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* E. Long-Term Progress timeline */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-faint">Long-Term Trajectory</h3>
        <Card>
          <CardBody className="py-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-0">
              {eras.map((era, i) => (
                <div key={era.year} className="relative flex flex-1 items-center gap-3 sm:flex-col sm:gap-2">
                  <div className="flex items-center gap-3 sm:flex-col sm:gap-2">
                    <div
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${i === 0 ? "bg-accent" : "border-2 border-border-strong bg-surface"}`}
                    />
                    <div className="text-center">
                      <div className="text-sm font-semibold text-ink">{era.year}</div>
                      <div className="text-xs text-ink-faint">{era.label}</div>
                    </div>
                  </div>
                  {i < eras.length - 1 && (
                    <div className="hidden h-px flex-1 bg-border-strong sm:block" />
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* F. Recent Output */}
        <Card className="lg:col-span-2">
          <CardBody className="py-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-faint">Recent Output</h3>
            <ul className="space-y-3 text-sm">
              <RecentRow label="Project" value={recentProject?.title} />
              <RecentRow label="Article" value={recentArticle?.title} />
              <RecentRow label="Open Source" value={recentOs?.project} />
              <RecentRow label="Connection" value={recentPerson?.name} />
              <RecentRow label="Problem" value={recentProblem?.title} />
            </ul>
          </CardBody>
        </Card>

        {/* Secondary: 5-dimension progress */}
        <Card>
          <CardBody className="py-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-faint">Progress Dimensions</h3>
            <div className="space-y-3">
              {dimensionLabels.map(({ key, label }) => (
                <div key={key}>
                  <div className="mb-1 flex justify-between text-xs text-ink-soft">
                    <span>{label}</span>
                    <span className="text-ink-faint">{dims[key]}%</span>
                  </div>
                  <ProgressBar value={dims[key]} size="sm" tone="good" />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Evidence */}
      <div className="flex flex-wrap gap-x-8 gap-y-2 border-t border-border pt-6 text-sm text-ink-soft">
        <span>{evidence.projectsShipped} projects shipped</span>
        <span>{evidence.articlesPublished} articles published</span>
        <span>{evidence.openSourceContributions} open-source contributions</span>
        <span>{evidence.connections} technical connections</span>
        <span>{evidence.problemsInvestigated} problems investigated</span>
        <span>{evidence.capabilitiesDemonstrated} capabilities with evidence</span>
      </div>
    </div>
  )
}

function RecentRow({ label, value }: { label: string; value?: string }) {
  return (
    <li className="flex items-baseline gap-3 border-b border-border/70 pb-3 last:border-0 last:pb-0">
      <span className="w-24 shrink-0 text-xs uppercase tracking-wide text-ink-faint">{label}</span>
      <span className={value ? "text-ink" : "text-ink-faint"}>{value ?? "Nothing yet"}</span>
    </li>
  )
}
