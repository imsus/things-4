import type { ProjectColor } from './colors'

export interface ProjectData {
  id: string
  name: string
  color: ProjectColor
  order: number
  createdAt: string
  updatedAt: string
}
