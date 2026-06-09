import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderToasts } from '../toast'
import { render, html } from 'lit-html'
import type { ToastState } from '../../../services/app-service'

describe('Toast', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
    vi.restoreAllMocks()
  })

  function renderWithToasts(toasts: ToastState[], onDismiss: (id: string) => void) {
    render(html`${renderToasts(toasts, onDismiss)}`, container)
  }

  it('renders nothing when no toasts', () => {
    renderWithToasts([], () => {})
    expect(container.textContent).toBe('')
  })

  it('renders a toast with message and undo button', () => {
    const toast: ToastState = { id: '1', message: 'Task deleted', onUndo: vi.fn(), expiresAt: Date.now() + 5000 }
    renderWithToasts([toast], () => {})

    expect(container.textContent).toContain('Task deleted')
    expect(container.textContent).toContain('Undo')
  })

  it('calls onUndo and dismisses when undo is clicked', () => {
    const onUndo = vi.fn()
    const onDismiss = vi.fn()
    const toast: ToastState = { id: '1', message: 'Task deleted', onUndo, expiresAt: Date.now() + 5000 }
    renderWithToasts([toast], onDismiss)

    const undoBtn = container.querySelector('button')!
    undoBtn.click()

    expect(onUndo).toHaveBeenCalledOnce()
    expect(onDismiss).toHaveBeenCalledWith('1')
  })

  it('stacks multiple toasts', () => {
    const toasts: ToastState[] = [
      { id: '1', message: 'Task 1 deleted', onUndo: vi.fn(), expiresAt: Date.now() + 5000 },
      { id: '2', message: 'Task 2 deleted', onUndo: vi.fn(), expiresAt: Date.now() + 5000 },
    ]
    renderWithToasts(toasts, () => {})

    const items = container.querySelectorAll('[class*="rounded-xl"]')
    expect(items).toHaveLength(2)
  })
})
