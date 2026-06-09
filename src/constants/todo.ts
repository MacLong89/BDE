export const TODO_COLUMNS = [
  { status: 'on_deck' as const, label: 'On Deck', hint: 'Up next' },
  { status: 'in_progress' as const, label: 'In Progress', hint: 'Working now' },
  { status: 'done' as const, label: 'Done', hint: 'Completed' },
]

export const TODO_COLUMN_STYLES = {
  on_deck: {
    header: 'bg-slate-100 text-slate-700',
    border: 'border-slate-200',
    drop: 'bg-slate-50/80',
  },
  in_progress: {
    header: 'bg-pink-100 text-pink-800',
    border: 'border-pink-200',
    drop: 'bg-pink-50/80',
  },
  done: {
    header: 'bg-emerald-100 text-emerald-800',
    border: 'border-emerald-200',
    drop: 'bg-emerald-50/80',
  },
}
