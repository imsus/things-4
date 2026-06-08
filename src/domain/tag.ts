import type { ProjectColor } from './colors'

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
