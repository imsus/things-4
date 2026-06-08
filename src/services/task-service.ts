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
    return liveQuery(() =>
      db.tasks
        .where('projectId')
        .equals('')
        .and(t => t.completedAt === null && t.deletedAt === null && !t.heading)
        .sortBy('order')
    )
  }

  getAllActiveTasks() {
    return liveQuery(() =>
      db.tasks
        .where('deletedAt')
        .equals('')
        .and(t => t.completedAt === null)
        .sortBy('order')
    )
  }

  getTasksByProject(projectId: string) {
    return liveQuery(() =>
      db.tasks
        .where('projectId')
        .equals(projectId)
        .and(t => t.completedAt === null && t.deletedAt === null && !t.heading)
        .sortBy('order')
    )
  }

  getCompletedTasks() {
    return liveQuery(() =>
      db.tasks
        .where('completedAt')
        .notEqual('')
        .and(t => t.deletedAt === null)
        .reverse()
        .sortBy('completedAt')
    )
  }
}
