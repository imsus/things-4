import { html, TemplateResult } from 'lit-html'

export function renderContent(path: string): TemplateResult {
  const viewName = getViewName(path)

  return html`
    <div class="flex-1 flex flex-col h-full overflow-hidden">
      <header class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">${viewName}</h2>
      </header>
      <div class="flex-1 overflow-y-auto px-6 py-4">
        <p class="text-gray-400 text-sm">No tasks yet.</p>
      </div>
      <div class="px-6 py-3 border-t border-gray-200">
        <input
          type="text"
          placeholder="New task..."
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  `
}

function getViewName(path: string): string {
  if (path === '/inbox') return 'Inbox'
  if (path === '/today') return 'Today'
  if (path === '/upcoming') return 'Upcoming'
  if (path === '/anytime') return 'Anytime'
  if (path === '/someday') return 'Someday'
  if (path === '/logbook') return 'Logbook'
  if (path.startsWith('/projects/')) return 'Project'
  if (path.startsWith('/tags/')) return 'Tag'
  return 'Things 4'
}
