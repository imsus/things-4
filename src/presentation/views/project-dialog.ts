import { html, render } from 'lit-html'
import { PROJECT_COLORS, type ProjectColor } from '../../domain/colors'

export interface ProjectDialogResult {
  name: string
  color: ProjectColor
}

let dialogEl: HTMLDivElement | null = null

export function showProjectDialog(): Promise<ProjectDialogResult | null> {
  return new Promise((resolve) => {
    if (dialogEl) dialogEl.remove()

    dialogEl = document.createElement('div')
    dialogEl.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm'
    document.body.appendChild(dialogEl)

    let name = ''
    let color: ProjectColor = 'blue'

    function renderDialog() {
      render(html`
        <div class="bg-[var(--color-things-bg)] rounded-2xl shadow-2xl p-8 w-[400px]" @click=${(e: Event) => e.stopPropagation()}>
          <h3 class="text-[17px] font-semibold text-[var(--color-things-text)] mb-6">New Project</h3>
          <input
            type="text"
            placeholder="Project name"
            class="w-full text-[15px] bg-transparent border-0 border-b border-[var(--color-things-divider)] focus:outline-none focus:border-[var(--color-things-accent)] pb-2 mb-6 placeholder:text-[var(--color-things-muted)]"
            .value=${name}
            @input=${(e: Event) => { name = (e.target as HTMLInputElement).value }}
          />
          <div class="grid grid-cols-6 gap-3 mb-8">
            ${PROJECT_COLORS.map(c => html`
              <button
                class="w-8 h-8 rounded-full transition-transform ${c === color ? 'ring-2 ring-offset-2 ring-[var(--color-things-text)] scale-110' : 'hover:scale-105'}"
                style="background: var(--color-things-${c})"
                @click=${() => { color = c; renderDialog() }}
              ></button>
            `)}
          </div>
          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 text-[14px] text-[var(--color-things-secondary)] hover:text-[var(--color-things-text)] transition-colors"
              @click=${() => { cleanup(); resolve(null) }}
            >Cancel</button>
            <button
              class="px-5 py-2 text-[14px] bg-[var(--color-things-accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
              @click=${() => { cleanup(); resolve({ name, color }) }}
            >Create</button>
          </div>
        </div>
      `, dialogEl!)
    }

    dialogEl.addEventListener('click', () => { cleanup(); resolve(null) })
    renderDialog()

    function cleanup() {
      dialogEl?.remove()
      dialogEl = null
    }
  })
}
