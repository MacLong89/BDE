interface BadgeProps {
  label: string
  colorClass: string
}

export function Badge({ label, colorClass }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {label}
    </span>
  )
}
