import { format, parseISO } from 'date-fns'
import { Clock, GripVertical, Pause, Play, Trash2 } from 'lucide-react'
import type { DragEvent } from 'react'
import type { TodoItem, TodoStatus } from '../../types'
import { useApp } from '../../store/AppContext'
import {
  formatCountdown,
  getTimerRemainingSeconds,
  isTimerRunning,
} from '../../utils/todoTimer'
import { Button } from '../ui/Button'

const DURATION_PRESETS = [15, 30, 45, 60]

interface TodoCardProps {
  item: TodoItem
  status: TodoStatus
  index: number
  isLast: boolean
  draggingId: string | null
  dropHighlight: boolean
  dropAfterHighlight: boolean
  now: number
  onDragStart: (e: DragEvent, item: TodoItem) => void
  onDragEnd: () => void
  onDrop: (e: DragEvent, index: number) => void
  onDropAfter: (e: DragEvent, index: number) => void
  onDropIndex: (index: number) => void
}

export function TodoCard({
  item,
  status,
  index,
  isLast,
  draggingId,
  dropHighlight,
  dropAfterHighlight,
  now,
  onDragStart,
  onDragEnd,
  onDrop,
  onDropAfter,
  onDropIndex,
}: TodoCardProps) {
  const {
    updateTodo,
    deleteTodo,
    completeTodo,
    uncompleteTodo,
    startTodoTimer,
    stopTodoTimer,
    dismissTodoTimerAlert,
  } = useApp()

  const running = isTimerRunning(item)
  const remaining = running ? getTimerRemainingSeconds(item, now) : null
  const timeIsUp = Boolean(item.timerEndedAt)
  const showTimePanel =
    status !== 'done' && (Boolean(item.isTimed) || running || timeIsUp)

  const toggleTimed = (enabled: boolean) => {
    if (enabled) {
      updateTodo(item.id, { isTimed: true })
      return
    }
    if (running) stopTodoTimer(item.id)
    updateTodo(item.id, {
      isTimed: false,
      durationMinutes: undefined,
      timerStartedAt: undefined,
      timerEndedAt: undefined,
    })
  }

  return (
    <div>
      {dropHighlight && <div className="mb-2 h-1 rounded-full bg-pink-400" />}
      <div
        draggable={!running}
        onDragStart={(e) => onDragStart(e, item)}
        onDragEnd={onDragEnd}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onDropIndex(index)
        }}
        onDrop={(e) => onDrop(e, index)}
        className={`group rounded-lg border bg-white p-3 shadow-sm transition-all ${
          draggingId === item.id
            ? 'border-pink-300 opacity-40'
            : running
              ? 'border-pink-300 ring-2 ring-pink-200'
              : timeIsUp
                ? 'border-amber-300 ring-2 ring-amber-100'
                : 'border-slate-100 hover:border-pink-200 hover:shadow-md'
        } ${status === 'done' ? 'opacity-80' : ''}`}
      >
        <div className="flex items-start gap-2">
          <button
            type="button"
            className="mt-0.5 shrink-0 cursor-grab text-slate-300 hover:text-slate-500 active:cursor-grabbing"
            aria-label="Drag to reorder"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <input
            type="checkbox"
            checked={status === 'done'}
            onChange={() =>
              status === 'done' ? uncompleteTodo(item.id) : completeTodo(item.id)
            }
            className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
            aria-label="Mark complete"
          />

          <div className="min-w-0 flex-1">
            {status === 'done' ? (
              <p className="text-sm text-slate-500 line-through">{item.title}</p>
            ) : (
              <input
                className="w-full bg-transparent text-sm text-slate-900 outline-none"
                value={item.title}
                onChange={(e) => updateTodo(item.id, { title: e.target.value })}
              />
            )}

            {status === 'done' && item.completedAt && (
              <p className="mt-1 text-xs text-slate-400">
                Done {format(parseISO(item.completedAt), 'MMM d')}
              </p>
            )}

            {status !== 'done' && (
              <label
                className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-slate-500"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={Boolean(item.isTimed)}
                  disabled={running}
                  onChange={(e) => toggleTimed(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
                />
                <Clock className="h-3.5 w-3.5" />
                <span>Timed task</span>
              </label>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              if (confirm('Delete this task?')) deleteTodo(item.id)
            }}
            className="shrink-0 text-slate-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
            aria-label="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {showTimePanel && (
          <div
            className="mt-3 border-t border-slate-100 pt-3"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {timeIsUp ? (
              <div className="flex items-center justify-between gap-2 rounded-lg bg-amber-50 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-amber-900">Time&apos;s up!</p>
                  <p className="text-xs text-amber-700">
                    {item.durationMinutes} min session complete
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => dismissTodoTimerAlert(item.id)}
                >
                  Dismiss
                </Button>
              </div>
            ) : running && remaining !== null ? (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100">
                    <Clock className="h-4 w-4 text-pink-600" />
                  </span>
                  <div>
                    <p className="font-mono text-lg font-semibold text-pink-700">
                      {formatCountdown(remaining)}
                    </p>
                    <p className="text-xs text-slate-500">remaining</p>
                  </div>
                </div>
                <Button size="sm" variant="secondary" onClick={() => stopTodoTimer(item.id)}>
                  <Pause className="h-3 w-3" /> Stop
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-slate-500">Duration:</span>
                  {DURATION_PRESETS.map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => updateTodo(item.id, { durationMinutes: mins })}
                      className={`rounded-md px-2 py-0.5 text-xs font-medium transition-colors ${
                        item.durationMinutes === mins
                          ? 'bg-pink-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-pink-100 hover:text-pink-700'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                  <input
                    type="number"
                    min={1}
                    max={480}
                    placeholder="min"
                    value={item.durationMinutes ?? ''}
                    onChange={(e) => {
                      const val = e.target.value ? Number(e.target.value) : undefined
                      updateTodo(item.id, {
                        durationMinutes: val && val > 0 ? val : undefined,
                      })
                    }}
                    className="w-14 rounded-md border border-slate-200 px-2 py-0.5 text-xs"
                  />
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={!item.durationMinutes}
                  onClick={async () => {
                    if (
                      'Notification' in window &&
                      Notification.permission === 'default'
                    ) {
                      await Notification.requestPermission()
                    }
                    startTodoTimer(item.id)
                  }}
                >
                  <Play className="h-3 w-3" /> Start {item.durationMinutes ?? 0} min timer
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {isLast && (
        <div
          className={`mt-2 h-6 rounded-lg ${
            dropAfterHighlight ? 'bg-pink-100 ring-2 ring-pink-300' : ''
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            onDropIndex(index + 1)
          }}
          onDrop={(e) => onDropAfter(e, index + 1)}
        />
      )}
    </div>
  )
}
