import Dexie, { type EntityTable } from 'dexie'
import type { TaskData } from '../domain/task'
import type { ProjectData } from '../domain/project'
import type { TagData } from '../domain/tag'

class AppDatabase extends Dexie {
  tasks!: EntityTable<TaskData, 'id'>
  projects!: EntityTable<ProjectData, 'id'>
  tags!: EntityTable<TagData, 'id'>

  constructor() {
    super('things4')
    this.version(1).stores({
      tasks: 'id, projectId, completedAt, deletedAt, order, startDate, someday',
      projects: 'id, order',
      tags: 'id, order',
    })
  }
}

export const db = new AppDatabase()
