import { describe, it, expect } from 'vitest'
import {
  createTask,
  completeTask,
  uncompleteTask,
  deleteTask,
  restoreTask,
  addChecklistItem,
  toggleChecklistItem,
  removeChecklistItem,
} from '../task'

describe('Task', () => {
  it('creates a task with defaults', () => {
    const task = createTask({ title: 'Buy milk' })
    expect(task.title).toBe('Buy milk')
    expect(task.id).toBeDefined()
    expect(task.completedAt).toBeNull()
    expect(task.deletedAt).toBeNull()
    expect(task.projectId).toBeNull()
    expect(task.tags).toEqual([])
    expect(task.checklist).toEqual([])
    expect(task.createdAt).toBeDefined()
  })

  it('completes a task', () => {
    const task = createTask({ title: 'Buy milk' })
    const completed = completeTask(task)
    expect(completed.completedAt).toBeDefined()
    expect(completed.completedAt).not.toBeNull()
  })

  it('uncompletes a task', () => {
    const task = createTask({ title: 'Buy milk' })
    const completed = completeTask(task)
    const uncompleted = uncompleteTask(completed)
    expect(uncompleted.completedAt).toBeNull()
  })

  it('soft-deletes a task', () => {
    const task = createTask({ title: 'Buy milk' })
    const deleted = deleteTask(task)
    expect(deleted.deletedAt).toBeDefined()
    expect(deleted.deletedAt).not.toBeNull()
  })

  it('restores a deleted task', () => {
    const task = createTask({ title: 'Buy milk' })
    const deleted = deleteTask(task)
    const restored = restoreTask(deleted)
    expect(restored.deletedAt).toBeNull()
  })

  it('adds a checklist item', () => {
    const task = createTask({ title: 'Groceries' })
    const updated = addChecklistItem(task, 'Milk')
    expect(updated.checklist).toHaveLength(1)
    expect(updated.checklist[0]!.title).toBe('Milk')
    expect(updated.checklist[0]!.checked).toBe(false)
  })

  it('toggles a checklist item', () => {
    const task = createTask({ title: 'Groceries' })
    const withItem = addChecklistItem(task, 'Milk')
    const itemId = withItem.checklist[0]!.id
    const toggled = toggleChecklistItem(withItem, itemId)
    expect(toggled.checklist[0]!.checked).toBe(true)
  })

  it('removes a checklist item', () => {
    const task = createTask({ title: 'Groceries' })
    const withItem = addChecklistItem(task, 'Milk')
    const itemId = withItem.checklist[0]!.id
    const removed = removeChecklistItem(withItem, itemId)
    expect(removed.checklist).toHaveLength(0)
  })
})
