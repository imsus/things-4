import { db } from '../data/database'
import { createProject, cascadeProjectDeletion, type ProjectData } from '../domain/project'
import type { ProjectColor } from '../domain/colors'
import { liveQuery } from 'dexie'

export class ProjectRepository {
  async get(id: string): Promise<ProjectData | undefined> {
    return db.projects.get(id)
  }

  async save(project: ProjectData): Promise<void> {
    await db.projects.put(project)
  }

  async create(name: string, color: ProjectColor = 'blue'): Promise<ProjectData> {
    const project = createProject({ name, color })
    await db.projects.add(project)
    return project
  }

  async delete(id: string): Promise<void> {
    const tasks = await db.tasks.toArray()
    const orphaned = cascadeProjectDeletion(tasks, id)
    for (const task of orphaned) {
      await db.tasks.put(task)
    }
    await db.projects.delete(id)
  }

  observeAll() {
    return liveQuery(() => db.projects.orderBy('order').toArray())
  }
}
