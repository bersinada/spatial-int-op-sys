export function ProgressBar({
  value,
  size = "md",
  tone = "accent",
}: {
  value: number
  size?: "sm" | "md"
  tone?: "accent" | "good"
}) {
  const height = size === "sm" ? "h-1" : "h-1.5"
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={`w-full progress-track rounded-full ${height} overflow-hidden`}>
      <div
        className={`${height} rounded-full ${tone === "good" ? "bg-good" : "bg-accent"} transition-[width] duration-500 ease-out`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
