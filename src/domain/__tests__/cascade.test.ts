import { describe, it, expect } from 'vitest'
import { cascadeProjectDeletion } from '../project'
import { cascadeTagDeletion } from '../tag'
import { createTask } from '../task'

describe('cascadeProjectDeletion', () => {
  it('moves tasks with matching projectId to Inbox', () => {
    const tasks = [
      createTask({ title: 'A', projectId: 'proj-1' }),
      createTask({ title: 'B', projectId: 'proj-2' }),
      createTask({ title: 'C', projectId: 'proj-1' }),
    ]
    const result = cascadeProjectDeletion(tasks, 'proj-1')
    expect(result).toHaveLength(2)
    expect(result[0]!.projectId).toBeNull()
    expect(result[1]!.projectId).toBeNull()
  })

  it('does not affect tasks with different projectId', () => {
    const tasks = [createTask({ title: 'A', projectId: 'proj-2' })]
    const result = cascadeProjectDeletion(tasks, 'proj-1')
    expect(result).toHaveLength(0)
  })
})

describe('cascadeTagDeletion', () => {
  it('removes tag from tasks that have it', () => {
    const tasks = [
      createTask({ title: 'A', tags: ['tag-1', 'tag-2'] }),
      createTask({ title: 'B', tags: ['tag-2'] }),
      createTask({ title: 'C', tags: ['tag-1'] }),
    ]
    const result = cascadeTagDeletion(tasks, 'tag-1')
    expect(result).toHaveLength(2)
    expect(result[0]!.tags).toEqual(['tag-2'])
    expect(result[1]!.tags).toEqual([])
  })

  it('does not affect tasks without the tag', () => {
    const tasks = [createTask({ title: 'A', tags: ['tag-2'] })]
    const result = cascadeTagDeletion(tasks, 'tag-1')
    expect(result).toHaveLength(0)
  })
})
