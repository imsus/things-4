import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { showToast } from '../toast'

describe('Toast', () => {
  beforeEach(() => {
    // Remove all existing toasts
    const container = document.querySelector('.fixed.bottom-4')
    if (container) container.innerHTML = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows a toast with message and undo button', () => {
    const onUndo = vi.fn()
    showToast('Task deleted', onUndo)

    const toast = document.querySelector('.bg-gray-900')
    expect(toast).not.toBeNull()
    expect(toast!.textContent).toContain('Task deleted')
    expect(toast!.textContent).toContain('Undo')
  })

  it('calls onUndo when undo is clicked', () => {
    const onUndo = vi.fn()
    showToast('Task deleted', onUndo)

    const undoBtn = document.querySelector('button')!
    undoBtn.click()

    expect(onUndo).toHaveBeenCalledOnce()
  })

  it('auto-dismisses after duration', () => {
    vi.useFakeTimers()
    const onUndo = vi.fn()
    showToast('Task deleted', onUndo, 1000)

    expect(document.querySelector('.bg-gray-900')).not.toBeNull()

    vi.advanceTimersByTime(1000)

    expect(document.querySelector('.bg-gray-900')).toBeNull()
    vi.useRealTimers()
  })

  it('stacks multiple toasts', () => {
    showToast('Task 1 deleted', vi.fn())
    showToast('Task 2 deleted', vi.fn())

    const toasts = document.querySelectorAll('.bg-gray-900')
    expect(toasts).toHaveLength(2)
  })
})
