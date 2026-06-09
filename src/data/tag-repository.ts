import { db } from '../data/database'
import { createTag, cascadeTagDeletion, type TagData } from '../domain/tag'
import type { ProjectColor } from '../domain/colors'
import { liveQuery } from 'dexie'

export class TagRepository {
  async get(id: string): Promise<TagData | undefined> {
    return db.tags.get(id)
  }

  async save(tag: TagData): Promise<void> {
    await db.tags.put(tag)
  }

  async create(name: string, color: ProjectColor = 'blue'): Promise<TagData> {
    const tag = createTag({ name, color })
    await db.tags.add(tag)
    return tag
  }

  async delete(id: string): Promise<void> {
    const tasks = await db.tasks.toArray()
    const updated = cascadeTagDeletion(tasks, id)
    for (const task of updated) {
      await db.tasks.put(task)
    }
    await db.tags.delete(id)
  }

  observeAll() {
    return liveQuery(() => db.tags.orderBy('order').toArray())
  }
}
