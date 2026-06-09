import type { ProjectColor } from './colors'
import type { TaskData } from './task'

export interface TagData {
  id: string
  name: string
  color: ProjectColor
  order: number
  createdAt: string
  updatedAt: string
}

export function createTag(overrides: Partial<TagData> = {}): TagData {
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

export function cascadeTagDeletion(tasks: TaskData[], tagId: string): TaskData[] {
  return tasks
    .filter(t => t.tags.includes(tagId))
    .map(t => ({ ...t, tags: t.tags.filter(id => id !== tagId), updatedAt: new Date().toISOString() }))
}
