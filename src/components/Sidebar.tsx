import { NavLink } from "react-router-dom"
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
  Compass,
  X,
} from "lucide-react"

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/roadmap", label: "Roadmap", icon: Map },
  { to: "/monthly-focus", label: "Monthly Focus", icon: Target },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/writing", label: "Writing", icon: PenLine },
  { to: "/open-source", label: "Open Source", icon: GitBranch },
  { to: "/network", label: "Network", icon: Users },
  { to: "/problem-radar", label: "Problem Radar", icon: Radar },
  { to: "/skills", label: "Skills", icon: Sparkles },
  { to: "/reviews", label: "Reviews", icon: ClipboardCheck },
  { to: "/knowledge", label: "Knowledge", icon: BookOpen },
  { to: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pb-5 pt-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-canvas">
            <Compass size={15} />
          </div>
          <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
            Spatial Intelligence OS
          </span>
          <button
            onClick={onNavigate}
            className="ml-auto rounded-md p-1 text-ink-faint hover:bg-surface-muted lg:hidden"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>
        <p className="mt-1.5 pl-9 text-xs leading-snug text-ink-faint">
          Building systems that help machines understand the physical world.
        </p>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2.5">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-surface-muted font-medium text-ink"
                  : "text-ink-soft hover:bg-surface-muted hover:text-ink"
              }`
            }
          >
            <Icon size={16} strokeWidth={2} className="shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 text-[11px] leading-snug text-ink-faint">
        Learn → Build → Publish → Connect → Identify Problems → Prototype → Validate → Build Company
      </div>
    </div>
  )
}
