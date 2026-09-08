import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuid } from "uuid"
import type {
  AppState,
  Article,
  DailyEntry,
  Decision,
  FounderModeItem,
  GlobalPositioningItem,
  MonthlyReview,
  Note,
  OpenSourceContribution,
  Person,
  Problem,
  Project,
  QuarterlyReview,
  RoadmapMonth,
  Skill,
  WeeklyReview,
} from "./types"
import { buildSeedState } from "./seed"

type Entity = { id: string }

function upsert<T extends Entity>(list: T[], item: T): T[] {
  const idx = list.findIndex((x) => x.id === item.id)
  if (idx === -1) return [...list, item]
  const next = [...list]
  next[idx] = item
  return next
}

interface Actions {
  updateNorthStar: (patch: Partial<AppState["northStar"]>) => void
  updateCurrentFocus: (patch: Partial<AppState["currentFocus"]>) => void
  updateTodayAction: (patch: Partial<AppState["todayAction"]>) => void
  updateMonthlyScorecard: (patch: Partial<AppState["monthlyScorecard"]>) => void

  upsertRoadmapMonth: (m: RoadmapMonth) => void

  upsertProject: (p: Omit<Project, "id" | "createdAt" | "updatedAt"> & { id?: string }) => string
  deleteProject: (id: string) => void

  upsertArticle: (a: Omit<Article, "id" | "createdAt" | "updatedAt"> & { id?: string }) => string
  deleteArticle: (id: string) => void

  upsertOpenSource: (o: Omit<OpenSourceContribution, "id" | "createdAt"> & { id?: string }) => string
  deleteOpenSource: (id: string) => void

  upsertPerson: (p: Omit<Person, "id" | "createdAt"> & { id?: string }) => string
  deletePerson: (id: string) => void

  upsertProblem: (p: Omit<Problem, "id" | "createdAt"> & { id?: string }) => string
  deleteProblem: (id: string) => void

  upsertSkill: (s: Skill) => void

  addWeeklyReview: (r: Omit<WeeklyReview, "id" | "createdAt">) => void
  addMonthlyReview: (r: Omit<MonthlyReview, "id" | "createdAt">) => void
  addQuarterlyReview: (r: Omit<QuarterlyReview, "id" | "createdAt">) => void

  upsertNote: (n: Omit<Note, "id" | "createdAt"> & { id?: string }) => string
  deleteNote: (id: string) => void

  upsertDecision: (d: Omit<Decision, "id" | "createdAt"> & { id?: string }) => string
  deleteDecision: (id: string) => void

  upsertDailyEntry: (d: Omit<DailyEntry, "id"> & { id?: string }) => string

  upsertGlobalPositioning: (g: GlobalPositioningItem) => void
  deleteGlobalPositioning: (id: string) => void

  upsertFounderItem: (f: Omit<FounderModeItem, "id" | "createdAt"> & { id?: string }) => string
  deleteFounderItem: (id: string) => void

  completeOnboarding: () => void
  toggleClarityAction: (id: string | null) => void

  exportData: () => string
  importData: (json: string) => void
  resetData: () => void
}

export type Store = AppState & Actions

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...buildSeedState(),

      updateNorthStar: (patch) => set((s) => ({ northStar: { ...s.northStar, ...patch } })),
      updateCurrentFocus: (patch) => set((s) => ({ currentFocus: { ...s.currentFocus, ...patch } })),
      updateTodayAction: (patch) => set((s) => ({ todayAction: { ...s.todayAction, ...patch } })),
      updateMonthlyScorecard: (patch) =>
        set((s) => ({ monthlyScorecard: { ...s.monthlyScorecard, ...patch } })),

      upsertRoadmapMonth: (m) => set((s) => ({ roadmap: upsert(s.roadmap, m) })),

      upsertProject: (p) => {
        const now = new Date().toISOString()
        const id = p.id ?? uuid()
        set((s) => {
          const existing = s.projects.find((x) => x.id === id)
          const full: Project = {
            ...p,
            id,
            createdAt: existing?.createdAt ?? now,
            updatedAt: now,
          }
          return { projects: upsert(s.projects, full) }
        })
        return id
      },
      deleteProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

      upsertArticle: (a) => {
        const now = new Date().toISOString()
        const id = a.id ?? uuid()
        set((s) => {
          const existing = s.articles.find((x) => x.id === id)
          const full: Article = { ...a, id, createdAt: existing?.createdAt ?? now, updatedAt: now }
          return { articles: upsert(s.articles, full) }
        })
        return id
      },
      deleteArticle: (id) => set((s) => ({ articles: s.articles.filter((a) => a.id !== id) })),

      upsertOpenSource: (o) => {
        const id = o.id ?? uuid()
        set((s) => {
          const existing = s.openSource.find((x) => x.id === id)
          const full: OpenSourceContribution = {
            ...o,
            id,
            createdAt: existing?.createdAt ?? new Date().toISOString(),
          }
          return { openSource: upsert(s.openSource, full) }
        })
        return id
      },
      deleteOpenSource: (id) => set((s) => ({ openSource: s.openSource.filter((o) => o.id !== id) })),

      upsertPerson: (p) => {
        const id = p.id ?? uuid()
        set((s) => {
          const existing = s.people.find((x) => x.id === id)
          const full: Person = { ...p, id, createdAt: existing?.createdAt ?? new Date().toISOString() }
          return { people: upsert(s.people, full) }
        })
        return id
      },
      deletePerson: (id) => set((s) => ({ people: s.people.filter((p) => p.id !== id) })),

      upsertProblem: (p) => {
        const id = p.id ?? uuid()
        set((s) => {
          const existing = s.problems.find((x) => x.id === id)
          const full: Problem = { ...p, id, createdAt: existing?.createdAt ?? new Date().toISOString() }
          return { problems: upsert(s.problems, full) }
        })
        return id
      },
      deleteProblem: (id) => set((s) => ({ problems: s.problems.filter((p) => p.id !== id) })),

      upsertSkill: (skill) => set((s) => ({ skills: upsert(s.skills, skill) })),

      addWeeklyReview: (r) =>
        set((s) => ({
          weeklyReviews: [{ ...r, id: uuid(), createdAt: new Date().toISOString() }, ...s.weeklyReviews],
        })),
      addMonthlyReview: (r) =>
        set((s) => ({
          monthlyReviews: [{ ...r, id: uuid(), createdAt: new Date().toISOString() }, ...s.monthlyReviews],
        })),
      addQuarterlyReview: (r) =>
        set((s) => ({
          quarterlyReviews: [{ ...r, id: uuid(), createdAt: new Date().toISOString() }, ...s.quarterlyReviews],
        })),

      upsertNote: (n) => {
        const id = n.id ?? uuid()
        set((s) => {
          const existing = s.notes.find((x) => x.id === id)
          const full: Note = { ...n, id, createdAt: existing?.createdAt ?? new Date().toISOString() }
          return { notes: upsert(s.notes, full) }
        })
        return id
      },
      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      upsertDecision: (d) => {
        const id = d.id ?? uuid()
        set((s) => {
          const existing = s.decisions.find((x) => x.id === id)
          const full: Decision = { ...d, id, createdAt: existing?.createdAt ?? new Date().toISOString() }
          return { decisions: upsert(s.decisions, full) }
        })
        return id
      },
      deleteDecision: (id) => set((s) => ({ decisions: s.decisions.filter((d) => d.id !== id) })),

      upsertDailyEntry: (d) => {
        const id = d.id ?? uuid()
        set((s) => ({ dailyEntries: upsert(s.dailyEntries, { ...d, id }) }))
        return id
      },

      upsertGlobalPositioning: (g) => set((s) => ({ globalPositioning: upsert(s.globalPositioning, g) })),
      deleteGlobalPositioning: (id) =>
        set((s) => ({ globalPositioning: s.globalPositioning.filter((g) => g.id !== id) })),

      upsertFounderItem: (f) => {
        const id = f.id ?? uuid()
        set((s) => {
          const existing = s.founderMode.find((x) => x.id === id)
          const full: FounderModeItem = { ...f, id, createdAt: existing?.createdAt ?? new Date().toISOString() }
          return { founderMode: upsert(s.founderMode, full) }
        })
        return id
      },
      deleteFounderItem: (id) => set((s) => ({ founderMode: s.founderMode.filter((f) => f.id !== id) })),

      completeOnboarding: () => set((s) => ({ settings: { ...s.settings, onboardingComplete: true } })),
      toggleClarityAction: (id) =>
        set((s) => ({ settings: { ...s.settings, clarityModeTodayActionId: id } })),

      exportData: () => {
        const s = get()
        const { ...data } = s
        const exportable: AppState = {
          northStar: data.northStar,
          currentFocus: data.currentFocus,
          todayAction: data.todayAction,
          monthlyScorecard: data.monthlyScorecard,
          roadmap: data.roadmap,
          projects: data.projects,
          articles: data.articles,
          openSource: data.openSource,
          people: data.people,
          problems: data.problems,
          skills: data.skills,
          weeklyReviews: data.weeklyReviews,
          monthlyReviews: data.monthlyReviews,
          quarterlyReviews: data.quarterlyReviews,
          notes: data.notes,
          decisions: data.decisions,
          dailyEntries: data.dailyEntries,
          globalPositioning: data.globalPositioning,
          founderMode: data.founderMode,
          settings: data.settings,
        }
        return JSON.stringify(exportable, null, 2)
      },
      importData: (json) => {
        const parsed = JSON.parse(json) as AppState
        set(() => ({ ...parsed }))
      },
      resetData: () => set(() => buildSeedState()),
    }),
    { name: "spatial-intelligence-os" },
  ),
)
