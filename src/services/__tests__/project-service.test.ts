import { describe, it, expect, beforeEach } from 'vitest'
import 'fake-indexeddb/auto'
import { db } from '../../data/database'
import { ProjectService } from '../project-service'
import { TaskService } from '../task-service'

describe('ProjectService', () => {
  const service = new ProjectService()
  const taskService = new TaskService()

  beforeEach(async () => {
    await db.tasks.clear()
    await db.projects.clear()
    await db.tags.clear()
  })

  it('creates a project', async () => {
    const project = await service.create('Work', 'blue')
    expect(project.name).toBe('Work')
    expect(project.color).toBe('blue')

    const found = await service.getById(project.id)
    expect(found).toBeDefined()
    expect(found!.name).toBe('Work')
  })

  it('updates a project', async () => {
    const project = await service.create('Work')
    await service.update(project.id, { name: 'Office' })

    const found = await service.getById(project.id)
    expect(found!.name).toBe('Office')
  })

  it('deletes a project and moves tasks to Inbox', async () => {
    const project = await service.create('Work')
    const task = await taskService.create('Do stuff', project.id)

    await service.delete(project.id)

    const found = await service.getById(project.id)
    expect(found).toBeUndefined()

    const taskAfter = await taskService.getById(task.id)
    expect(taskAfter!.projectId).toBeNull()
  })

  it('lists all projects', async () => {
    await service.create('Work')
    await service.create('Personal')

    const projects = await db.projects.toArray()
    expect(projects).toHaveLength(2)
  })
})
