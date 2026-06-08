import type { ProjectColor } from './colors'

export interface TagData {
  id: string
  name: string
  color: ProjectColor
  order: number
  createdAt: string
  updatedAt: string
}
