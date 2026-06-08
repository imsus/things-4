import { describe, it, expect, beforeEach } from 'vitest'
import 'fake-indexeddb/auto'
import { db } from '../../data/database'
import { TagService } from '../tag-service'
import { TaskService } from '../task-service'

describe('TagService', () => {
  const service = new TagService()
  const taskService = new TaskService()

  beforeEach(async () => {
    await db.tasks.clear()
    await db.projects.clear()
    await db.tags.clear()
  })

  it('creates a tag', async () => {
    const tag = await service.create('urgent', 'red')
    expect(tag.name).toBe('urgent')
    expect(tag.color).toBe('red')

    const found = await service.getById(tag.id)
    expect(found).toBeDefined()
    expect(found!.name).toBe('urgent')
  })

  it('updates a tag', async () => {
    const tag = await service.create('urgent')
    await service.update(tag.id, { name: 'critical' })

    const found = await service.getById(tag.id)
    expect(found!.name).toBe('critical')
  })

  it('deletes a tag and removes it from tasks', async () => {
    const tag = await service.create('urgent')
    const task = await taskService.create('Do stuff')
    await db.tasks.update(task.id, { tags: [tag.id] })

    await service.delete(tag.id)

    const found = await service.getById(tag.id)
    expect(found).toBeUndefined()

    const taskAfter = await taskService.getById(task.id)
    expect(taskAfter!.tags).toEqual([])
  })

  it('lists all tags', async () => {
    await service.create('urgent')
    await service.create('home')

    const tags = await db.tags.toArray()
    expect(tags).toHaveLength(2)
  })
})
