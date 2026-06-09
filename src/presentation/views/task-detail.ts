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
    return html`<div class="w-[340px] h-full border-l border-[var(--color-things-divider)] bg-[var(--color-things-bg)] hidden lg:flex"></div>`
  }

  return html`
    <div class="w-[340px] h-full border-l border-[var(--color-things-divider)] bg-[var(--color-things-bg)] flex flex-col">
      <div class="px-6 pt-6 pb-4 flex items-center justify-between">
        <h3 class="text-[13px] font-medium text-[var(--color-things-secondary)]">Details</h3>
        <button class="w-6 h-6 flex items-center justify-center text-[var(--color-things-muted)] hover:text-[var(--color-things-text)] rounded transition-colors" @click=${onClose}>
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-6 space-y-5">
        <div>
          <input
            type="text"
            .value=${task.title}
            class="w-full text-[15px] font-medium bg-transparent border-0 focus:outline-none text-[var(--color-things-text)]"
            @change=${(e: Event) => onUpdate({ title: (e.target as HTMLInputElement).value })}
          />
        </div>

        <div>
          <textarea
            .value=${task.notes}
            placeholder="Notes"
            rows="3"
            class="w-full text-[13px] bg-transparent border-0 focus:outline-none text-[var(--color-things-text)] placeholder:text-[var(--color-things-muted)] resize-none leading-relaxed"
            @change=${(e: Event) => onUpdate({ notes: (e.target as HTMLTextAreaElement).value })}
          ></textarea>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[12px] text-[var(--color-things-secondary)]">When</span>
            <input
              type="date"
              .value=${task.startDate ?? ''}
              class="text-[13px] bg-transparent border-0 focus:outline-none text-[var(--color-things-blue)] cursor-pointer"
              @change=${(e: Event) => {
                const value = (e.target as HTMLInputElement).value
                onUpdate({ startDate: value || null })
              }}
            />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[12px] text-[var(--color-things-secondary)]">Deadline</span>
            <input
              type="date"
              .value=${task.deadline ?? ''}
              class="text-[13px] bg-transparent border-0 focus:outline-none text-[var(--color-things-red)] cursor-pointer"
              @change=${(e: Event) => {
                const value = (e.target as HTMLInputElement).value
                onUpdate({ deadline: value || null })
              }}
            />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[12px] text-[var(--color-things-secondary)]">Someday</span>
            <input
              type="checkbox"
              .checked=${task.someday}
              @change=${(e: Event) => onUpdate({ someday: (e.target as HTMLInputElement).checked })}
            />
          </div>
        </div>

        ${task.checklist.length > 0 || true ? html`
          <div>
            <div class="text-[12px] text-[var(--color-things-secondary)] mb-2">Checklist</div>
            <ul class="space-y-1">
              ${task.checklist.map(item => html`
                <li class="flex items-center gap-2 group/item">
                  <input
                    type="checkbox"
                    .checked=${item.checked}
                    @change=${() => onToggleChecklistItem(item.id)}
                  />
                  <span class="flex-1 text-[13px] ${item.checked ? 'line-through text-[var(--color-things-muted)]' : 'text-[var(--color-things-text)]'}">${item.title}</span>
                  <button class="opacity-0 group-hover/item:opacity-100 text-[var(--color-things-muted)] hover:text-[var(--color-things-red)] transition-opacity" @click=${() => onRemoveChecklistItem(item.id)}>
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </li>
              `)}
              <li>
                <input
                  type="text"
                  placeholder="Add item..."
                  class="w-full text-[13px] bg-transparent border-0 border-b border-[var(--color-things-divider)] focus:outline-none focus:border-[var(--color-things-blue)] py-1 placeholder:text-[var(--color-things-muted)]"
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
            </ul>
          </div>
        ` : ''}
      </div>

      <div class="px-6 py-4">
        <button
          class="text-[13px] text-[var(--color-things-red)] hover:opacity-80 transition-opacity"
          @click=${onDelete}
        >
          Delete Task
        </button>
      </div>
    </div>
  `
}
