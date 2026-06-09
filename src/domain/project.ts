import type { ProjectColor } from './colors'
import type { TaskData } from './task'

export interface ProjectData {
  id: string
  name: string
  color: ProjectColor
  order: number
  createdAt: string
  updatedAt: string
}

export function createProject(overrides: Partial<ProjectData> = {}): ProjectData {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    name: '',
    color: 'blue',
    order: Date.now(),
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

export function cascadeProjectDeletion(tasks: TaskData[], projectId: string): TaskData[] {
  return tasks
    .filter(t => t.projectId === projectId)
    .map(t => ({ ...t, projectId: null, updatedAt: new Date().toISOString() }))
}
