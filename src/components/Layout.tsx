import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Menu, Command } from "lucide-react"
import { Sidebar } from "./Sidebar"
import { useCommandPalette } from "./CommandPalette"

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { open: openPalette } = useCommandPalette()

  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className="hidden w-60 shrink-0 border-r border-border lg:block">
        <Sidebar />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 border-r border-border bg-canvas">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-2.5 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-1.5 text-ink-soft hover:bg-surface-muted"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <span className="font-display text-sm font-semibold text-ink">Spatial Intelligence OS</span>
          <button
            onClick={openPalette}
            className="rounded-md p-1.5 text-ink-soft hover:bg-surface-muted"
            aria-label="Open command palette"
          >
            <Command size={16} />
          </button>
        </header>

        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
