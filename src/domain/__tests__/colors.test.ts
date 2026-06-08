import { describe, it, expect } from 'vitest'
import { PROJECT_COLORS, isValidColor } from '../colors'

describe('ProjectColor', () => {
  it('has all 12 colors', () => {
    expect(PROJECT_COLORS).toHaveLength(12)
  })

  it('validates a known color', () => {
    expect(isValidColor('red')).toBe(true)
    expect(isValidColor('teal')).toBe(true)
    expect(isValidColor('brown')).toBe(true)
  })

  it('rejects an unknown color', () => {
    expect(isValidColor('beige')).toBe(false)
    expect(isValidColor('')).toBe(false)
    expect(isValidColor('RED')).toBe(false)
  })
})
