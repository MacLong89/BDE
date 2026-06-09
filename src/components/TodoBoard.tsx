import { Plus } from 'lucide-react'
import { useMemo, useState, type DragEvent } from 'react'
import { TODO_COLUMN_STYLES, TODO_COLUMNS } from '../constants/todo'
import { useTodoTimers } from '../hooks/useTodoTimers'
import type { TodoItem, TodoStatus } from '../types'
import { useApp } from '../store/AppContext'
import { todosForColumn } from '../utils/todos'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { TodoCard } from './todo/TodoCard'

type DragPayload = {
  id: string
  fromStatus: TodoStatus
}

export function TodoBoard() {
  const { data, addTodo, moveTodo } = useApp()
  const { now } = useTodoTimers()

  const [newTitle, setNewTitle] = useState('')
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<{
    status: TodoStatus
    index: number
  } | null>(null)

  const columns = useMemo(
    () =>
      TODO_COLUMNS.map((col) => ({
        ...col,
        items: todosForColumn(data.todos, col.status),
      })),
    [data.todos],
  )

  const handleAdd = () => {
    if (!newTitle.trim()) return
    addTodo(newTitle.trim())
    setNewTitle('')
  }

  const handleDragStart = (e: DragEvent, item: TodoItem) => {
    const payload: DragPayload = { id: item.id, fromStatus: item.status }
    e.dataTransfer.setData('application/json', JSON.stringify(payload))
    e.dataTransfer.effectAllowed = 'move'
    setDraggingId(item.id)
  }

  const handleDragEnd = () => {
    setDraggingId(null)
    setDropTarget(null)
  }

  const handleDrop = (e: DragEvent, status: TodoStatus, index: number) => {
    e.preventDefault()
    try {
      const payload = JSON.parse(
        e.dataTransfer.getData('application/json'),
      ) as DragPayload
      moveTodo(payload.id, status, index)
    } catch {
      // ignore invalid drops
    }
    setDraggingId(null)
    setDropTarget(null)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">ToDo</h1>
        <p className="mt-1 text-slate-500">
          Drag to reorder · Check &quot;Timed task&quot; for focus timers · Check off when done
        </p>
      </div>

      <div className="mb-6 flex gap-2">
        <Input
          className="flex-1"
          placeholder="Add a task to On Deck..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button onClick={handleAdd} disabled={!newTitle.trim()}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {columns.map(({ status, label, hint, items }) => {
          const styles = TODO_COLUMN_STYLES[status]
          const isDropColumn = dropTarget?.status === status

          return (
            <div
              key={status}
              className={`flex min-h-[420px] flex-col rounded-xl border ${styles.border} bg-white/80 shadow-sm backdrop-blur-sm`}
              onDragOver={(e) => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
              }}
            >
              <div className={`rounded-t-xl px-4 py-3 ${styles.header}`}>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">{label}</h2>
                  <span className="rounded-full bg-white/60 px-2 py-0.5 text-xs font-medium">
                    {items.length}
                  </span>
                </div>
                <p className="mt-0.5 text-xs opacity-70">{hint}</p>
              </div>

              <div
                className={`flex flex-1 flex-col gap-2 p-3 ${isDropColumn ? styles.drop : ''}`}
                onDragLeave={() => {
                  if (dropTarget?.status === status) setDropTarget(null)
                }}
              >
                {items.length === 0 && (
                  <div
                    className={`rounded-lg border-2 border-dashed px-3 py-8 text-center text-xs text-slate-400 ${
                      isDropColumn && dropTarget?.index === 0
                        ? 'border-pink-300 bg-pink-50'
                        : 'border-slate-200'
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDropTarget({ status, index: 0 })
                    }}
                    onDrop={(e) => handleDrop(e, status, 0)}
                  >
                    Drop tasks here
                  </div>
                )}

                {items.map((item, index) => (
                  <TodoCard
                    key={item.id}
                    item={item}
                    status={status}
                    index={index}
                    isLast={index === items.length - 1}
                    draggingId={draggingId}
                    now={now}
                    dropHighlight={isDropColumn && dropTarget?.index === index}
                    dropAfterHighlight={
                      isDropColumn && dropTarget?.index === index + 1
                    }
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDrop={(e, i) => handleDrop(e, status, i)}
                    onDropAfter={(e, i) => handleDrop(e, status, i)}
                    onDropIndex={(i) => setDropTarget({ status, index: i })}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
