import { html, TemplateResult } from 'lit-html'
import type { ToastState } from '../../services/app-service'

export function renderToasts(toasts: ToastState[], onDismiss: (id: string) => void): TemplateResult {
  if (toasts.length === 0) return html``

  return html`
    <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
      ${toasts.map(toast => html`
        <div class="flex items-center gap-3 px-5 py-3.5 bg-[var(--color-things-text)] text-white rounded-xl shadow-lg text-[13px] min-w-[300px]">
          <span class="flex-1">${toast.message}</span>
          <button class="text-[var(--color-things-accent)] hover:opacity-80 font-medium"
            @click=${() => { toast.onUndo(); onDismiss(toast.id) }}>
            Undo
          </button>
        </div>
      `)}
    </div>
  `
}
