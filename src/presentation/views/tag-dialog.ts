import { html, render } from 'lit-html'
import { PROJECT_COLORS, type ProjectColor } from '../../domain/colors'

export interface TagDialogResult {
  name: string
  color: ProjectColor
}

let dialogEl: HTMLDivElement | null = null

export function showTagDialog(): Promise<TagDialogResult | null> {
  return new Promise((resolve) => {
    if (dialogEl) dialogEl.remove()

    dialogEl = document.createElement('div')
    dialogEl.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50'
    document.body.appendChild(dialogEl)

    let name = ''
    let color: ProjectColor = 'blue'

    function renderDialog() {
      render(html`
        <div class="bg-white rounded-xl shadow-2xl p-6 w-96" @click=${(e: Event) => e.stopPropagation()}>
          <h3 class="text-lg font-semibold mb-4">New Tag</h3>
          <input
            type="text"
            placeholder="Tag name"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            .value=${name}
            @input=${(e: Event) => { name = (e.target as HTMLInputElement).value }}
          />
          <div class="grid grid-cols-6 gap-2 mb-4">
            ${PROJECT_COLORS.map(c => html`
              <button
                class="w-8 h-8 rounded-full bg-${c}-500 ${c === color ? 'ring-2 ring-offset-2 ring-gray-900' : ''}"
                @click=${() => { color = c; renderDialog() }}
              ></button>
            `)}
          </div>
          <div class="flex justify-end gap-2">
            <button
              class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              @click=${() => { cleanup(); resolve(null) }}
            >Cancel</button>
            <button
              class="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
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
