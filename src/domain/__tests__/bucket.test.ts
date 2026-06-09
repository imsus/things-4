import { describe, it, expect } from 'vitest'
import { bucketFilter, bucketSort } from '../bucket'
import type { TaskData } from '../task'
import { createTask } from '../task'

function task(overrides: Partial<TaskData> = {}): TaskData {
  return createTask(overrides)
}

describe('bucketFilter', () => {
  it('inbox: active tasks with no project', () => {
    const filter = bucketFilter('inbox')
    expect(filter(task({ projectId: null }))).toBe(true)
    expect(filter(task({ projectId: 'proj-1' }))).toBe(false)
    expect(filter(task({ completedAt: '2025-01-01' }))).toBe(false)
    expect(filter(task({ deletedAt: '2025-01-01' }))).toBe(false)
    expect(filter(task({ heading: true }))).toBe(false)
  })

  it('today: tasks with startDate today or past', () => {
    const filter = bucketFilter('today')
    const today = new Date().toISOString().split('T')[0]!
    const yesterday = '2020-01-01'
    const tomorrow = '2099-12-31'
    expect(filter(task({ startDate: today }))).toBe(true)
    expect(filter(task({ startDate: yesterday }))).toBe(true)
    expect(filter(task({ startDate: tomorrow }))).toBe(false)
    expect(filter(task({ startDate: null }))).toBe(false)
  })

  it('upcoming: tasks with future startDate', () => {
    const filter = bucketFilter('upcoming')
    expect(filter(task({ startDate: '2099-12-31' }))).toBe(true)
    expect(filter(task({ startDate: '2020-01-01' }))).toBe(false)
    expect(filter(task({ startDate: null }))).toBe(false)
  })

  it('anytime: no startDate, has project, not someday', () => {
    const filter = bucketFilter('anytime')
    expect(filter(task({ projectId: 'proj-1', startDate: null, someday: false }))).toBe(true)
    expect(filter(task({ projectId: null, startDate: null }))).toBe(false)
    expect(filter(task({ projectId: 'proj-1', startDate: '2025-01-01' }))).toBe(false)
    expect(filter(task({ projectId: 'proj-1', someday: true }))).toBe(false)
  })

  it('someday: tasks with someday flag', () => {
    const filter = bucketFilter('someday')
    expect(filter(task({ someday: true }))).toBe(true)
    expect(filter(task({ someday: false }))).toBe(false)
  })

  it('logbook: completed tasks', () => {
    const filter = bucketFilter('logbook')
    expect(filter(task({ completedAt: '2025-01-01' }))).toBe(true)
    expect(filter(task({ completedAt: null }))).toBe(false)
    expect(filter(task({ completedAt: '2025-01-01', deletedAt: '2025-01-02' }))).toBe(false)
  })
})

describe('bucketSort', () => {
  it('logbook sorts by completedAt descending', () => {
    const sort = bucketSort('logbook')
    const a = task({ completedAt: '2025-01-01' })
    const b = task({ completedAt: '2025-01-02' })
    expect(sort(a, b)).toBeGreaterThan(0)
    expect(sort(b, a)).toBeLessThan(0)
  })

  it('upcoming sorts by startDate ascending', () => {
    const sort = bucketSort('upcoming')
    const a = task({ startDate: '2025-01-01' })
    const b = task({ startDate: '2025-01-02' })
    expect(sort(a, b)).toBeLessThan(0)
    expect(sort(b, a)).toBeGreaterThan(0)
  })

  it('default sorts by order', () => {
    const sort = bucketSort('inbox')
    const a = task({ order: 1 })
    const b = task({ order: 2 })
    expect(sort(a, b)).toBeLessThan(0)
  })
})
