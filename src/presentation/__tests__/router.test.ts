import { describe, it, expect } from 'vitest'
import { Router } from '../router'

describe('Router', () => {
  it('matches static routes', () => {
    const router = new Router()
    router.addRoute('/inbox')
    router.addRoute('/today')

    // Simulate navigation by setting hash
    window.location.hash = '/inbox'

    let matched = ''
    router.listen(() => {
      matched = window.location.hash.slice(1)
    })

    expect(matched).toBe('/inbox')
  })

  it('matches parameterized routes', () => {
    const router = new Router()
    const paramNames: string[] = []
    router.addRoute('/projects/:id', paramNames)

    expect(paramNames).toEqual(['id'])
  })

  it('defaults to /inbox when no hash', () => {
    window.location.hash = ''
    const router = new Router()
    router.addRoute('/inbox')
    expect(router.getCurrentPath()).toBe('/inbox')
  })
})
