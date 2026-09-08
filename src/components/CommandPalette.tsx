import { create } from "zustand"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Map,
  Target,
  FolderKanban,
  PenLine,
  GitBranch,
  Users,
  Radar,
  Sparkles,
  ClipboardCheck,
  BookOpen,
  Settings,
  Scale,
  Sun,
} from "lucide-react"

interface PaletteState {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export const useCommandPalette = create<PaletteState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}))

const commands = [
  { keyword: "/today", label: "Today", to: "/daily", icon: Sun },
  { keyword: "/month", label: "Monthly Focus", to: "/monthly-focus", icon: Target },
  { keyword: "/roadmap", label: "Roadmap", to: "/roadmap", icon: Map },
  { keyword: "/project", label: "Projects", to: "/projects", icon: FolderKanban },
  { keyword: "/article", label: "Writing", to: "/writing", icon: PenLine },
  { keyword: "/opensource", label: "Open Source", to: "/open-source", icon: GitBranch },
  { keyword: "/network", label: "Network", to: "/network", icon: Users },
  { keyword: "/problem", label: "Problem Radar", to: "/problem-radar", icon: Radar },
  { keyword: "/skills", label: "Skills", to: "/skills", icon: Sparkles },
  { keyword: "/review", label: "Reviews", to: "/reviews", icon: ClipboardCheck },
  { keyword: "/focus", label: "Clarity Mode", to: "/clarity", icon: Target },
  { keyword: "/decision", label: "Decision Support", to: "/decisions", icon: Scale },
  { keyword: "/knowledge", label: "Knowledge", to: "/knowledge", icon: BookOpen },
  { keyword: "/dashboard", label: "Dashboard", to: "/", icon: LayoutDashboard },
  { keyword: "/settings", label: "Settings", to: "/settings", icon: Settings },
]

export function CommandPalette() {
  const { isOpen, close, toggle } = useCommandPalette()
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [toggle])

  useEffect(() => {
    if (!isOpen) setQuery("")
  }, [isOpen])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\//, "")
    if (!q) return commands
    return commands.filter(
      (c) => c.keyword.toLowerCase().includes(q) || c.label.toLowerCase().includes(q),
    )
  }, [query])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/30 p-4 pt-24 backdrop-blur-[2px]"
      onClick={close}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-surface shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a command… (/today, /project, /review)"
          className="w-full border-b border-border px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && filtered[0]) {
              navigate(filtered[0].to)
              close()
            }
          }}
        />
        <div className="max-h-80 overflow-y-auto py-1.5">
          {filtered.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-ink-faint">No matching command.</div>
          )}
          {filtered.map(({ keyword, label, to, icon: Icon }) => (
            <button
              key={to}
              onClick={() => {
                navigate(to)
                close()
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-ink hover:bg-surface-muted"
            >
              <Icon size={15} className="text-ink-faint" />
              <span className="font-medium">{label}</span>
              <span className="ml-auto text-xs text-ink-faint">{keyword}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
