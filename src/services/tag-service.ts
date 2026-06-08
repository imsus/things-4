import { db } from '../data/database'
import { createTag, type TagData } from '../domain/tag'
import type { ProjectColor } from '../domain/colors'
import { liveQuery } from 'dexie'

export class TagService {
  async create(name: string, color: ProjectColor = 'blue'): Promise<TagData> {
    const tag = createTag({ name, color })
    await db.tags.add(tag)
    return tag
  }

  async getById(id: string): Promise<TagData | undefined> {
    return db.tags.get(id)
  }

  async update(id: string, changes: Partial<TagData>): Promise<void> {
    await db.tags.update(id, { ...changes, updatedAt: new Date().toISOString() })
  }

  async delete(id: string): Promise<void> {
    // Remove tag from all tasks (tags is an array, can't query with Dexie index)
    const tasks = await db.tasks.toArray()
    for (const task of tasks) {
      if (task.tags.includes(id)) {
        await db.tasks.update(task.id, {
          tags: task.tags.filter(t => t !== id),
          updatedAt: new Date().toISOString(),
        })
      }
    }
    await db.tags.delete(id)
  }

  getAllTags() {
    return liveQuery(() => db.tags.orderBy('order').toArray())
  }
}
