import { useEffect, useRef, useState } from 'react'
import type { TodoStatus } from '../types'

const COLUMN_ORDER: TodoStatus[] = ['on_deck', 'in_progress', 'done']

export function getColumnMoveDirection(
  from: TodoStatus,
  to: TodoStatus,
): 'forward' | 'backward' {
  return COLUMN_ORDER.indexOf(to) >= COLUMN_ORDER.indexOf(from) ? 'forward' : 'backward'
}

export function useTodoColumnEnter(status: TodoStatus) {
  const [entering, setEntering] = useState(false)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const prevStatus = useRef(status)
  const isFirstMount = useRef(true)

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      prevStatus.current = status
      return
    }

    if (prevStatus.current === status) return

    setDirection(getColumnMoveDirection(prevStatus.current, status))
    setEntering(true)
    prevStatus.current = status

    const timer = window.setTimeout(() => setEntering(false), 550)
    return () => window.clearTimeout(timer)
  }, [status])

  return { entering, direction }
}
