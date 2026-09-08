import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useStore } from "./lib/store"
import { Layout } from "./components/Layout"
import { CommandPalette } from "./components/CommandPalette"
import Onboarding from "./pages/Onboarding"
import Dashboard from "./pages/Dashboard"
import Roadmap from "./pages/Roadmap"
import MonthlyFocus from "./pages/MonthlyFocus"
import Projects from "./pages/Projects"
import Writing from "./pages/Writing"
import OpenSource from "./pages/OpenSource"
import Network from "./pages/Network"
import ProblemRadar from "./pages/ProblemRadar"
import Skills from "./pages/Skills"
import Reviews from "./pages/Reviews"
import Knowledge from "./pages/Knowledge"
import SettingsPage from "./pages/Settings"
import Clarity from "./pages/Clarity"
import Decisions from "./pages/Decisions"
import Daily from "./pages/Daily"
import Founder from "./pages/Founder"
import GlobalPositioning from "./pages/GlobalPositioning"

export default function App() {
  const onboardingComplete = useStore((s) => s.settings.onboardingComplete)

  if (!onboardingComplete) {
    return <Onboarding />
  }

  return (
    <BrowserRouter>
      <CommandPalette />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/monthly-focus" element={<MonthlyFocus />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/open-source" element={<OpenSource />} />
          <Route path="/network" element={<Network />} />
          <Route path="/problem-radar" element={<ProblemRadar />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/decisions" element={<Decisions />} />
          <Route path="/daily" element={<Daily />} />
          <Route path="/founder" element={<Founder />} />
          <Route path="/global-positioning" element={<GlobalPositioning />} />
        </Route>
        <Route path="/clarity" element={<Clarity />} />
      </Routes>
    </BrowserRouter>
  )
}
