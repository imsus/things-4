import type { TaskData } from './task'

export type Bucket = 'inbox' | 'today' | 'upcoming' | 'anytime' | 'someday' | 'logbook'

export function bucketFilter(bucket: Bucket): (task: TaskData) => boolean {
  const today = new Date().toISOString().split('T')[0]!

  switch (bucket) {
    case 'inbox':
      return t => t.completedAt === null && t.deletedAt === null && t.projectId === null && !t.heading
    case 'today':
      return t => t.deletedAt === null && t.completedAt === null && !t.heading && t.startDate !== null && t.startDate <= today
    case 'upcoming':
      return t => t.deletedAt === null && t.completedAt === null && !t.heading && t.startDate !== null && t.startDate > today
    case 'anytime':
      return t => t.deletedAt === null && t.completedAt === null && !t.heading && t.startDate === null && t.projectId !== null && !t.someday
    case 'someday':
      return t => t.deletedAt === null && t.completedAt === null && !t.heading && t.someday
    case 'logbook':
      return t => t.completedAt !== null && t.deletedAt === null
  }
}

export function bucketSort(bucket: Bucket): (a: TaskData, b: TaskData) => number {
  switch (bucket) {
    case 'logbook':
      return (a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? '')
    case 'upcoming':
      return (a, b) => (a.startDate ?? '').localeCompare(b.startDate ?? '')
    default:
      return (a, b) => a.order - b.order
  }
}
