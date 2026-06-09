import type { TodoItem, TodoStatus } from '../types'

export function todosForColumn(todos: TodoItem[], status: TodoStatus): TodoItem[] {
  return todos
    .filter((t) => t.status === status)
    .sort((a, b) => a.order - b.order)
}

export function nextOrder(todos: TodoItem[], status: TodoStatus): number {
  const column = todosForColumn(todos, status)
  if (column.length === 0) return 0
  return Math.max(...column.map((t) => t.order)) + 1
}

export function applyColumnOrder(
  todos: TodoItem[],
  status: TodoStatus,
  orderedIds: string[],
  completedAt?: string,
): TodoItem[] {
  const others = todos.filter((t) => t.status !== status)
  const reordered = orderedIds.map((id, index) => {
    const item = todos.find((t) => t.id === id)
    if (!item) throw new Error(`Todo ${id} not found`)
    return {
      ...item,
      status,
      order: index,
      completedAt:
        status === 'done' ? (item.completedAt ?? completedAt) : undefined,
    }
  })
  return [...others, ...reordered]
}

export function moveTodoInList(
  todos: TodoItem[],
  id: string,
  toStatus: TodoStatus,
  toIndex: number,
  timestamp: string,
): TodoItem[] {
  const item = todos.find((t) => t.id === id)
  if (!item) return todos
  const fromStatus = item.status

  if (fromStatus === toStatus) {
    const ids = todosForColumn(todos, fromStatus).map((t) => t.id)
    const reordered = ids.filter((todoId) => todoId !== id)
    reordered.splice(toIndex, 0, id)
    return applyColumnOrder(todos, fromStatus, reordered, timestamp)
  }

  const remaining = todos.filter((t) => t.id !== id)
  const sourceIds = todosForColumn(remaining, fromStatus).map((t) => t.id)
  let updated = applyColumnOrder(remaining, fromStatus, sourceIds, timestamp)

  const targetIds = todosForColumn(updated, toStatus).map((t) => t.id)
  targetIds.splice(toIndex, 0, id)
  const movedItem: TodoItem = {
    ...item,
    status: toStatus,
    completedAt: toStatus === 'done' ? (item.completedAt ?? timestamp) : undefined,
  }
  return applyColumnOrder([...updated, movedItem], toStatus, targetIds, timestamp)
}
