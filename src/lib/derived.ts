import type { AppState } from "./types"

export interface LongTermDimensions {
  capability: number
  proofOfWork: number
  reputation: number
  network: number
  optionality: number
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

export function computeLongTermDimensions(s: AppState): LongTermDimensions {
  const publishedProjects = s.projects.filter((p) => p.status === "PUBLISHED" || p.status === "DOCUMENTATION").length
  const publishedArticles = s.articles.filter((a) => a.status === "PUBLISHED").length
  const skillEvidence = s.skills.filter((sk) => sk.evidence.trim().length > 0).length
  const avgSkillProgress =
    s.skills.length === 0
      ? 0
      : s.skills.reduce((acc, sk) => acc + Math.min(sk.currentLevel / Math.max(sk.targetLevel, 1), 1), 0) /
        s.skills.length

  const capability = clamp(avgSkillProgress * 70 + Math.min(skillEvidence, 15) * 2)
  const proofOfWork = clamp(publishedProjects * 12 + s.projects.length * 4 + s.openSource.length * 6)
  const reputation = clamp(publishedArticles * 15 + s.openSource.length * 5)
  const network = clamp(s.people.length * 6)
  const optionality = clamp(s.problems.length * 6 + s.globalPositioning.length * 3)

  return { capability, proofOfWork, reputation, network, optionality }
}

export interface EvidenceCounts {
  projectsShipped: number
  articlesPublished: number
  openSourceContributions: number
  connections: number
  problemsInvestigated: number
  capabilitiesDemonstrated: number
}

export function computeEvidenceCounts(s: AppState): EvidenceCounts {
  return {
    projectsShipped: s.projects.filter((p) => p.status === "PUBLISHED" || p.status === "DOCUMENTATION" || p.status === "ARCHIVED").length,
    articlesPublished: s.articles.filter((a) => a.status === "PUBLISHED").length,
    openSourceContributions: s.openSource.length,
    connections: s.people.length,
    problemsInvestigated: s.problems.filter((p) => p.status !== "OBSERVED").length,
    capabilitiesDemonstrated: s.skills.filter((sk) => sk.evidence.trim().length > 0).length,
  }
}
