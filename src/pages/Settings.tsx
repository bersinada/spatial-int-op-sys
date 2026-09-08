import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Download, Upload, RotateCcw, ArrowRight } from "lucide-react"
import { useStore } from "../lib/store"
import { PageHeader } from "../components/ui/PageHeader"
import { Card, CardBody } from "../components/ui/Card"
import { Button } from "../components/ui/Button"

const secondaryPages = [
  { to: "/daily", label: "Daily View", description: "Today's five fields." },
  { to: "/clarity", label: "Clarity Mode", description: "Hide everything except what matters right now." },
  { to: "/decisions", label: "Decision Support", description: "Reversible vs. irreversible. Test what can be tested." },
  { to: "/founder", label: "Founder Mode", description: "Validated problems, prototypes, experiments." },
  { to: "/global-positioning", label: "Global Positioning", description: "International roles, universities, companies." },
]

export default function Settings() {
  const s = useStore()
  const fileInput = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleExport = () => {
    const data = s.exportData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `spatial-intelligence-os-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        s.importData(String(reader.result))
        setMessage("Data imported successfully.")
      } catch {
        setMessage("Could not import — the file is not valid JSON.")
      }
      setTimeout(() => setMessage(null), 3000)
    }
    reader.readAsText(file)
  }

  return (
    <div className="max-w-2xl">
      <PageHeader eyebrow="Local-First" title="Settings" description="Your data lives in this browser. Export it regularly." />

      <Card className="mb-6">
        <CardBody className="py-6">
          <h3 className="mb-1 text-sm font-semibold text-ink">Data</h3>
          <p className="mb-4 text-sm text-ink-soft">Export a full backup, or restore from a previous export.</p>
          <div className="flex flex-wrap gap-2.5">
            <Button variant="primary" onClick={handleExport}>
              <Download size={15} /> Export JSON
            </Button>
            <Button onClick={() => fileInput.current?.click()}>
              <Upload size={15} /> Import JSON
            </Button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImportFile(file)
                e.target.value = ""
              }}
            />
            <Button
              variant="danger"
              onClick={() => {
                if (confirm("Reset all data back to the initial seed? This cannot be undone.")) {
                  s.resetData()
                }
              }}
            >
              <RotateCcw size={15} /> Reset to Seed Data
            </Button>
          </div>
          {message && <p className="mt-3 text-sm text-good">{message}</p>}
        </CardBody>
      </Card>

      <Card>
        <CardBody className="py-4">
          <h3 className="mb-1 px-2 pt-2 text-sm font-semibold text-ink">More</h3>
          <div className="divide-y divide-border">
            {secondaryPages.map((p) => (
              <Link key={p.to} to={p.to} className="flex items-center gap-3 px-2 py-3 hover:bg-surface-muted rounded-md">
                <div className="flex-1">
                  <div className="text-sm font-medium text-ink">{p.label}</div>
                  <div className="text-xs text-ink-faint">{p.description}</div>
                </div>
                <ArrowRight size={14} className="text-ink-faint" />
              </Link>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
