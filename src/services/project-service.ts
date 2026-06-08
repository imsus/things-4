import { db } from '../data/database'
import { createProject, type ProjectData } from '../domain/project'
import type { ProjectColor } from '../domain/colors'
import { liveQuery } from 'dexie'

export class ProjectService {
  async create(name: string, color: ProjectColor = 'blue'): Promise<ProjectData> {
    const project = createProject({ name, color })
    await db.projects.add(project)
    return project
  }

  async getById(id: string): Promise<ProjectData | undefined> {
    return db.projects.get(id)
  }

  async update(id: string, changes: Partial<ProjectData>): Promise<void> {
    await db.projects.update(id, { ...changes, updatedAt: new Date().toISOString() })
  }

  async delete(id: string): Promise<void> {
    // Move all tasks in this project to Inbox
    const tasks = await db.tasks.where('projectId').equals(id).toArray()
    for (const task of tasks) {
      await db.tasks.update(task.id, { projectId: null, updatedAt: new Date().toISOString() })
    }
    await db.projects.delete(id)
  }

  getAllProjects() {
    return liveQuery(() => db.projects.orderBy('order').toArray())
  }
}
