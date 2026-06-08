import { db } from '../data/database'
import {
  createTask,
  completeTask,
  uncompleteTask,
  deleteTask,
  restoreTask,
  addChecklistItem,
  toggleChecklistItem,
  removeChecklistItem,
  type TaskData,
} from '../domain/task'
import { liveQuery } from 'dexie'

export class TaskService {
  async create(title: string, projectId: string | null = null): Promise<TaskData> {
    const task = createTask({ title, projectId })
    await db.tasks.add(task)
    return task
  }

  async getById(id: string): Promise<TaskData | undefined> {
    return db.tasks.get(id)
  }

  async update(id: string, changes: Partial<TaskData>): Promise<void> {
    await db.tasks.update(id, { ...changes, updatedAt: new Date().toISOString() })
  }

  async complete(id: string): Promise<void> {
    const task = await db.tasks.get(id)
    if (!task) return
    const updated = completeTask(task)
    await db.tasks.put(updated)
  }

  async uncomplete(id: string): Promise<void> {
    const task = await db.tasks.get(id)
    if (!task) return
    const updated = uncompleteTask(task)
    await db.tasks.put(updated)
  }

  async delete(id: string): Promise<void> {
    const task = await db.tasks.get(id)
    if (!task) return
    const updated = deleteTask(task)
    await db.tasks.put(updated)
  }

  async restore(id: string): Promise<void> {
    const task = await db.tasks.get(id)
    if (!task) return
    const updated = restoreTask(task)
    await db.tasks.put(updated)
  }

  async permanentlyDelete(id: string): Promise<void> {
    await db.tasks.delete(id)
  }

  async addChecklistItem(taskId: string, title: string): Promise<void> {
    const task = await db.tasks.get(taskId)
    if (!task) return
    const updated = addChecklistItem(task, title)
    await db.tasks.put(updated)
  }

  async toggleChecklistItem(taskId: string, itemId: string): Promise<void> {
    const task = await db.tasks.get(taskId)
    if (!task) return
    const updated = toggleChecklistItem(task, itemId)
    await db.tasks.put(updated)
  }

  async removeChecklistItem(taskId: string, itemId: string): Promise<void> {
    const task = await db.tasks.get(taskId)
    if (!task) return
    const updated = removeChecklistItem(task, itemId)
    await db.tasks.put(updated)
  }

  getInboxTasks() {
    return liveQuery(async () => {
      const tasks = await db.tasks.toArray()
      return tasks
        .filter(t => t.completedAt === null && t.deletedAt === null && t.projectId === null && !t.heading)
        .sort((a, b) => a.order - b.order)
    })
  }

  getAllActiveTasks() {
    return liveQuery(async () => {
      const tasks = await db.tasks.toArray()
      return tasks
        .filter(t => t.deletedAt === null && t.completedAt === null)
        .sort((a, b) => a.order - b.order)
    })
  }

  getTasksByProject(projectId: string) {
    return liveQuery(async () => {
      const tasks = await db.tasks.where('projectId').equals(projectId).toArray()
      return tasks
        .filter(t => t.completedAt === null && t.deletedAt === null && !t.heading)
        .sort((a, b) => a.order - b.order)
    })
  }

  getCompletedTasks() {
    return liveQuery(async () => {
      const tasks = await db.tasks.toArray()
      return tasks
        .filter(t => t.completedAt !== null && t.deletedAt === null)
        .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))
    })
  }

  getTodayTasks() {
    const today = new Date().toISOString().split('T')[0]!
    return liveQuery(async () => {
      const tasks = await db.tasks.toArray()
      return tasks
        .filter(t => t.deletedAt === null && t.completedAt === null && !t.heading && t.startDate !== null && t.startDate <= today)
        .sort((a, b) => a.order - b.order)
    })
  }

  getUpcomingTasks() {
    const today = new Date().toISOString().split('T')[0]!
    return liveQuery(async () => {
      const tasks = await db.tasks.toArray()
      return tasks
        .filter(t => t.deletedAt === null && t.completedAt === null && !t.heading && t.startDate !== null && t.startDate > today)
        .sort((a, b) => (a.startDate ?? '').localeCompare(b.startDate ?? ''))
    })
  }

  getAnytimeTasks() {
    return liveQuery(async () => {
      const tasks = await db.tasks.toArray()
      return tasks
        .filter(t => t.deletedAt === null && t.completedAt === null && !t.heading && t.startDate === null && t.projectId !== null && !t.someday)
        .sort((a, b) => a.order - b.order)
    })
  }

  getSomedayTasks() {
    return liveQuery(async () => {
      const tasks = await db.tasks.toArray()
      return tasks
        .filter(t => t.deletedAt === null && t.completedAt === null && !t.heading && t.someday)
        .sort((a, b) => a.order - b.order)
    })
  }

  getTasksByTag(tagId: string) {
    return liveQuery(async () => {
      const tasks = await db.tasks.toArray()
      return tasks
        .filter(t => t.deletedAt === null && t.completedAt === null && !t.heading && t.tags.includes(tagId))
        .sort((a, b) => a.order - b.order)
    })
  }
}
