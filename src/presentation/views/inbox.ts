import { html, TemplateResult } from 'lit-html'
import type { TaskData } from '../../domain/task'

export function renderInboxView(
  tasks: TaskData[],
  onTaskClick: (id: string) => void,
  onNewTask: (title: string) => void,
  onToggleComplete: (id: string) => void,
): TemplateResult {
  return html`
    <div class="flex-1 flex flex-col h-full overflow-hidden">
      <header class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Inbox</h2>
        <p class="text-sm text-gray-500 mt-1">${tasks.length} tasks</p>
      </header>
      <div class="flex-1 overflow-y-auto px-6 py-4">
        ${tasks.length === 0
          ? html`<p class="text-gray-400 text-sm">No tasks in Inbox. Add one below.</p>`
          : html`
            <ul class="space-y-1">
              ${tasks.map(task => renderTaskItem(task, onTaskClick, onToggleComplete))}
            </ul>
          `}
      </div>
      <div class="px-6 py-3 border-t border-gray-200">
        <input
          type="text"
          placeholder="New task..."
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === 'Enter') {
              const input = e.target as HTMLInputElement
              const title = input.value.trim()
              if (title) {
                onNewTask(title)
                input.value = ''
              }
            }
          }}
        />
      </div>
    </div>
  `
}

function renderTaskItem(
  task: TaskData,
  onTaskClick: (id: string) => void,
  onToggleComplete: (id: string) => void,
): TemplateResult {
  const isCompleted = task.completedAt !== null

  return html`
    <li class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 group cursor-pointer"
        @click=${() => onTaskClick(task.id)}>
      <button
        class="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors
          ${isCompleted ? 'bg-blue-500 border-blue-500' : 'border-gray-300 hover:border-blue-400'}"
        @click=${(e: Event) => {
          e.stopPropagation()
          onToggleComplete(task.id)
        }}
      >
        ${isCompleted ? html`<svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>` : ''}
      </button>
      <span class="text-sm text-gray-900 ${isCompleted ? 'line-through text-gray-400' : ''}">${task.title}</span>
      ${task.tags.length > 0 ? html`
        <div class="flex gap-1 ml-auto">
          ${task.tags.map(() => html`<span class="w-2 h-2 rounded-full bg-gray-300"></span>`)}
        </div>
      ` : ''}
    </li>
  `
}
