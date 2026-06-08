import { describe, it, expect, beforeEach } from 'vitest'
import 'fake-indexeddb/auto'
import { db } from '../../data/database'
import { TaskService } from '../task-service'

describe('TaskService', () => {
  const service = new TaskService()

  beforeEach(async () => {
    await db.tasks.clear()
    await db.projects.clear()
    await db.tags.clear()
  })

  it('creates a task', async () => {
    const task = await service.create('Buy milk')
    expect(task.title).toBe('Buy milk')
    expect(task.id).toBeDefined()

    const found = await service.getById(task.id)
    expect(found).toBeDefined()
    expect(found!.title).toBe('Buy milk')
  })

  it('completes a task', async () => {
    const task = await service.create('Buy milk')
    await service.complete(task.id)

    const found = await service.getById(task.id)
    expect(found!.completedAt).not.toBeNull()
  })

  it('uncompletes a task', async () => {
    const task = await service.create('Buy milk')
    await service.complete(task.id)
    await service.uncomplete(task.id)

    const found = await service.getById(task.id)
    expect(found!.completedAt).toBeNull()
  })

  it('soft-deletes a task', async () => {
    const task = await service.create('Buy milk')
    await service.delete(task.id)

    const found = await service.getById(task.id)
    expect(found!.deletedAt).not.toBeNull()
  })

  it('restores a deleted task', async () => {
    const task = await service.create('Buy milk')
    await service.delete(task.id)
    await service.restore(task.id)

    const found = await service.getById(task.id)
    expect(found!.deletedAt).toBeNull()
  })

  it('permanently deletes a task', async () => {
    const task = await service.create('Buy milk')
    await service.permanentlyDelete(task.id)

    const found = await service.getById(task.id)
    expect(found).toBeUndefined()
  })

  it('adds checklist item to a task', async () => {
    const task = await service.create('Groceries')
    await service.addChecklistItem(task.id, 'Milk')

    const found = await service.getById(task.id)
    expect(found!.checklist).toHaveLength(1)
    expect(found!.checklist[0]!.title).toBe('Milk')
  })

  it('updates a task', async () => {
    const task = await service.create('Buy milk')
    await service.update(task.id, { notes: 'Whole milk' })

    const found = await service.getById(task.id)
    expect(found!.notes).toBe('Whole milk')
  })
})
