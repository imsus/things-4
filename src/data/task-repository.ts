import { db } from '../data/database'
import { type TaskData } from '../domain/task'
import { bucketFilter, bucketSort, type Bucket } from '../domain/bucket'
import { liveQuery } from 'dexie'

export class TaskRepository {
  async get(id: string): Promise<TaskData | undefined> {
    return db.tasks.get(id)
  }

  async save(task: TaskData): Promise<void> {
    await db.tasks.put(task)
  }

  async query(bucket: Bucket): Promise<TaskData[]> {
    const tasks = await db.tasks.toArray()
    return tasks.filter(bucketFilter(bucket)).sort(bucketSort(bucket))
  }

  async mutate(id: string, fn: (task: TaskData) => TaskData): Promise<TaskData> {
    const task = await db.tasks.get(id)
    if (!task) throw new Error(`Task ${id} not found`)
    const updated = fn(task)
    await db.tasks.put(updated)
    return updated
  }

  observe(bucket: Bucket) {
    return liveQuery(async () => {
      const tasks = await db.tasks.toArray()
      return tasks.filter(bucketFilter(bucket)).sort(bucketSort(bucket))
    })
  }

  observeByProject(projectId: string) {
    return liveQuery(async () => {
      const tasks = await db.tasks.toArray()
      return tasks
        .filter(t => t.completedAt === null && t.deletedAt === null && t.projectId === projectId && !t.heading)
        .sort((a, b) => a.order - b.order)
    })
  }

  observeByTag(tagId: string) {
    return liveQuery(async () => {
      const tasks = await db.tasks.toArray()
      return tasks
        .filter(t => t.deletedAt === null && t.completedAt === null && !t.heading && t.tags.includes(tagId))
        .sort((a, b) => a.order - b.order)
    })
  }

  observeAll() {
    return liveQuery(() => db.tasks.toArray())
  }
}
