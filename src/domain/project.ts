import type { ProjectColor } from './colors'

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
