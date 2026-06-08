import { describe, it, expect } from 'vitest'
import { createProject } from '../project'

describe('Project', () => {
  it('creates a project with defaults', () => {
    const project = createProject({ name: 'Work' })
    expect(project.name).toBe('Work')
    expect(project.id).toBeDefined()
    expect(project.color).toBe('blue')
    expect(project.createdAt).toBeDefined()
  })

  it('creates a project with custom color', () => {
    const project = createProject({ name: 'Personal', color: 'green' })
    expect(project.color).toBe('green')
  })
})
