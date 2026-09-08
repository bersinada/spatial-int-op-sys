export function EmptyState({
  message,
  action,
}: {
  message: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border-strong bg-surface-muted/50 px-6 py-12 text-center">
      <p className="max-w-sm text-sm text-ink-soft">{message}</p>
      {action}
    </div>
  )
}
