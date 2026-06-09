export interface Toast {
  id: string
  message: string
  onUndo: () => void
  timeoutId?: ReturnType<typeof setTimeout>
  element: HTMLDivElement
}

const toasts: Toast[] = []
const container = document.createElement('div')
container.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2'
document.body.appendChild(container)

export function showToast(message: string, onUndo: () => void, duration = 5000) {
  const id = crypto.randomUUID()

  const el = document.createElement('div')
  el.className = 'flex items-center gap-3 px-5 py-3.5 bg-[var(--color-things-text)] text-white rounded-xl shadow-lg text-[13px] min-w-[300px]'
  el.innerHTML = `
    <span class="flex-1">${escapeHtml(message)}</span>
    <button class="text-[var(--color-things-blue)] hover:opacity-80 font-medium">Undo</button>
  `

  const undoBtn = el.querySelector('button')!
  undoBtn.addEventListener('click', () => {
    onUndo()
    removeToast(id)
  })

  container.appendChild(el)

  const toast: Toast = { id, message, onUndo, element: el }
  toasts.push(toast)

  toast.timeoutId = setTimeout(() => {
    removeToast(id)
  }, duration)
}

function removeToast(id: string) {
  const index = toasts.findIndex(t => t.id === id)
  if (index === -1) return
  const toast = toasts[index]!
  if (toast.timeoutId) clearTimeout(toast.timeoutId)
  toast.element.remove()
  toasts.splice(index, 1)
}

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
