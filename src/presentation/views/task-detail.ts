import { html, TemplateResult } from 'lit-html'
import type { TaskData } from '../../domain/task'

export function renderTaskDetail(
  task: TaskData | null,
  onClose: () => void,
  onUpdate: (changes: Partial<TaskData>) => void,
  onDelete: () => void,
  onAddChecklistItem: (title: string) => void,
  onToggleChecklistItem: (itemId: string) => void,
  onRemoveChecklistItem: (itemId: string) => void,
): TemplateResult {
  if (!task) {
    return html`
      <div class="w-80 h-full border-l border-gray-200 bg-white hidden lg:flex flex-col">
        <div class="flex-1 flex items-center justify-center px-6">
          <p class="text-gray-400 text-sm">Select a task to edit</p>
        </div>
      </div>
    `
  }

  return html`
    <div class="w-80 h-full border-l border-gray-200 bg-white flex flex-col">
      <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-sm font-medium text-gray-900 truncate flex-1">${task.title}</h3>
        <button class="ml-2 text-gray-400 hover:text-gray-600" @click=${onClose}>
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Title</label>
          <input
            type="text"
            .value=${task.title}
            class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change=${(e: Event) => onUpdate({ title: (e.target as HTMLInputElement).value })}
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Notes</label>
          <textarea
            .value=${task.notes}
            rows="3"
            class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            @change=${(e: Event) => onUpdate({ notes: (e.target as HTMLTextAreaElement).value })}
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
            <input
              type="date"
              .value=${task.startDate ?? ''}
              class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change=${(e: Event) => {
                const value = (e.target as HTMLInputElement).value
                onUpdate({ startDate: value || null })
              }}
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Deadline</label>
            <input
              type="date"
              .value=${task.deadline ?? ''}
              class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change=${(e: Event) => {
                const value = (e.target as HTMLInputElement).value
                onUpdate({ deadline: value || null })
              }}
            />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            .checked=${task.someday}
            class="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            @change=${(e: Event) => onUpdate({ someday: (e.target as HTMLInputElement).checked })}
          />
          <label class="text-sm text-gray-700">Someday</label>
        </div>

        <div>
          <button
            class="text-sm text-red-500 hover:text-red-700"
            @click=${onDelete}
          >
            Delete task
          </button>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-500 mb-2">Checklist</label>
          <ul class="space-y-1">
            ${task.checklist.map(item => html`
              <li class="flex items-center gap-2">
                <input
                  type="checkbox"
                  .checked=${item.checked}
                  class="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  @change=${() => onToggleChecklistItem(item.id)}
                />
                <span class="text-sm flex-1 ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}">${item.title}</span>
                <button class="text-gray-400 hover:text-red-500 text-xs" @click=${() => onRemoveChecklistItem(item.id)}>×</button>
              </li>
            `).concat([html`
              <li>
                <input
                  type="text"
                  placeholder="Add item..."
                  class="w-full px-2 py-1 text-sm border-0 border-b border-gray-200 focus:outline-none focus:border-blue-500"
                  @keydown=${(e: KeyboardEvent) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement
                      const title = input.value.trim()
                      if (title) {
                        onAddChecklistItem(title)
                        input.value = ''
                      }
                    }
                  }}
                />
              </li>
            `])}
          </ul>
        </div>
      </div>
    </div>
  `
}
