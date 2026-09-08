import { useState } from "react"
import { useStore } from "../lib/store"

const screens = [
  { prompt: "What are you building?", answer: "A globally relevant career in Spatial Intelligence — and eventually, a company." },
  { prompt: "What are you becoming?", answer: "Spatial Intelligence Engineer" },
  { prompt: "What is your current specialization?", answer: "3D Spatial Understanding + Spatial Knowledge Graphs + Spatial Reasoning" },
  { prompt: "What matters now?", answer: "Build → Publish → Connect → Discover Problems" },
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const complete = useStore((s) => s.completeOnboarding)
  const screen = screens[step]
  const last = step === screens.length - 1

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-10 flex justify-center gap-1.5">
          {screens.map((_, i) => (
            <div key={i} className={`h-1 w-8 rounded-full ${i <= step ? "bg-accent" : "bg-surface-muted"}`} />
          ))}
        </div>

        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink-faint">
          {step + 1} / {screens.length}
        </p>
        <h1 className="mb-5 font-display text-xl font-semibold text-ink sm:text-2xl">{screen.prompt}</h1>
        <p className="mb-12 text-base leading-relaxed text-ink-soft">{screen.answer}</p>

        <button
          onClick={() => (last ? complete() : setStep((s) => s + 1))}
          className="w-full rounded-lg bg-ink py-3 text-sm font-semibold text-canvas hover:bg-ink/85"
        >
          {last ? "Enter the Dashboard" : "Continue"}
        </button>
      </div>
    </div>
  )
}
