export type ProjectStatus =
  | "IDEA"
  | "RESEARCH"
  | "BUILDING"
  | "EXPERIMENT"
  | "DOCUMENTATION"
  | "PUBLISHED"
  | "ARCHIVED"

export type ArticleStatus = "IDEA" | "RESEARCH" | "DRAFT" | "EDITING" | "PUBLISHED"

export type ProblemStatus =
  | "OBSERVED"
  | "INVESTIGATING"
  | "VALIDATING"
  | "PROTOTYPING"
  | "PROMISING"
  | "REJECTED"

export type RoadmapStatus = "planned" | "active" | "completed" | "paused"

export type PersonCategory =
  | "Spatial AI Engineer"
  | "Geospatial AI Engineer"
  | "3D Computer Vision Engineer"
  | "Knowledge Graph Engineer"
  | "Researcher"
  | "Founder"
  | "Open Source Maintainer"
  | "PhD Student"
  | "Potential Collaborator"

export interface NorthStar {
  mission: string
  specialization: string
  tagline: string
}

export interface SupportingTask {
  id: string
  title: string
  done: boolean
}

export interface CurrentFocus {
  monthLabel: string
  theme: string
  objective: string
  currentProjectId: string | null
  currentArticleId: string | null
  progress: {
    project: number
    article: number
    openSource: number
    network: number
    learning: number
  }
  supportingTasks: SupportingTask[]
}

export interface TodayAction {
  title: string
  why: string
  effort: string
  relatedObjective: string
}

export interface MonthlyScorecard {
  project: number
  article: number
  openSource: number
  network: number
  startupDiscovery: number
}

export interface RoadmapMonth {
  id: string
  month: string // e.g. "2026-09"
  label: string // e.g. "September 2026"
  theme: string
  coreSkills: string[]
  mainProject: string
  mainArticle: string
  openSourceObjective: string
  networkingObjective: string
  startupObjective: string
  status: RoadmapStatus
  completion: number
}

export interface Project {
  id: string
  title: string
  problem: string
  motivation: string
  technicalTopic: string
  technologies: string[]
  dataset: string
  architecture: string
  status: ProjectStatus
  startDate: string
  targetDate: string
  githubUrl: string
  demoUrl: string
  articleUrl: string
  notes: string
  results: string
  failureCases: string
  lessonsLearned: string
  futureWork: string
  roadmapMonthId: string | null
  createdAt: string
  updatedAt: string
}

export interface Article {
  id: string
  title: string
  status: ArticleStatus
  topic: string
  targetAudience: string
  outline: string
  draftLink: string
  publicationLink: string
  publicationDate: string
  relatedProjectId: string | null
  createdAt: string
  updatedAt: string
}

export interface OpenSourceContribution {
  id: string
  project: string
  ecosystem: string
  repository: string
  contributionType: string
  issuePrUrl: string
  status: string
  date: string
  technicalArea: string
  lessonLearned: string
  createdAt: string
}

export interface Person {
  id: string
  name: string
  role: string
  category: PersonCategory
  companyOrUniversity: string
  field: string
  profileUrl: string
  github: string
  location: string
  whyRelevant: string
  whatTheyWorkOn: string
  lastInteraction: string
  nextInteraction: string
  notes: string
  conversationIdeas: string
  createdAt: string
}

export interface Problem {
  id: string
  title: string
  industry: string
  customer: string
  description: string
  currentSolution: string
  whyInsufficient: string
  spatialComponent: string
  aiOpportunity: string
  dataRequired: string
  technicalFeasibility: number
  potentialMarket: string
  willingnessToPay: string
  competition: string
  defensibility: string
  internationalRelevance: string
  mvpDifficulty: number
  confidence: number
  status: ProblemStatus
  createdAt: string
}

export type SkillCategory =
  | "Spatial Foundations"
  | "Spatial AI"
  | "3D Intelligence"
  | "Knowledge Representation"
  | "AI Systems"
  | "Engineering"

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  currentLevel: number
  targetLevel: number
  importance: number
  evidence: string
  relatedProjectIds: string[]
  lastPracticed: string
  nextAction: string
}

export interface WeeklyReview {
  id: string
  weekOf: string
  whatBuilt: string
  whatLearned: string
  whatPublished: string
  whatContributed: string
  whoConnected: string
  movedCloser: string
  whereOverthought: string
  whatStop: string
  mostImportantNext: string
  createdAt: string
}

export interface MonthlyReview {
  id: string
  monthLabel: string
  whatChanged: string
  evidenceOfProgress: string
  whatWasBusywork: string
  whatToChange: string
  createdAt: string
}

export interface QuarterlyReview {
  id: string
  quarterLabel: string
  specializationClarity: string
  peopleAssociation: string
  unfairAdvantage: string
  whatToStopLearning: string
  createdAt: string
}

export interface Note {
  id: string
  title: string
  category: string
  content: string
  linkedProjectId: string | null
  linkedArticleId: string | null
  linkedPersonId: string | null
  linkedSkillId: string | null
  linkedProblemId: string | null
  createdAt: string
}

export interface Decision {
  id: string
  decision: string
  options: string
  constraints: string
  assumptions: string
  experiments: string
  reversible: boolean
  status: "open" | "decided"
  outcome: string
  createdAt: string
}

export interface DailyEntry {
  id: string
  date: string
  objective: string
  technicalAction: string
  visibilityAction: string
  networkAction: string
  optionalTask: string
  completed: boolean
  learned: string
  blocker: string
  nextStep: string
}

export type GlobalPositioningCategory =
  | "country"
  | "university"
  | "program"
  | "company"
  | "internship"
  | "role"
  | "conference"
  | "community"
  | "ecosystem"

export interface GlobalPositioningItem {
  id: string
  category: GlobalPositioningCategory
  name: string
  notes: string
  status: string
}

export interface FounderModeItem {
  id: string
  kind: "validated_problem" | "promising_idea" | "active_experiment" | "potential_customer" | "prototype" | "market_observation"
  title: string
  notes: string
  createdAt: string
}

export interface AppSettings {
  onboardingComplete: boolean
  clarityModeTodayActionId: string | null
}

export interface AppState {
  northStar: NorthStar
  currentFocus: CurrentFocus
  todayAction: TodayAction
  monthlyScorecard: MonthlyScorecard
  roadmap: RoadmapMonth[]
  projects: Project[]
  articles: Article[]
  openSource: OpenSourceContribution[]
  people: Person[]
  problems: Problem[]
  skills: Skill[]
  weeklyReviews: WeeklyReview[]
  monthlyReviews: MonthlyReview[]
  quarterlyReviews: QuarterlyReview[]
  notes: Note[]
  decisions: Decision[]
  dailyEntries: DailyEntry[]
  globalPositioning: GlobalPositioningItem[]
  founderMode: FounderModeItem[]
  settings: AppSettings
}
