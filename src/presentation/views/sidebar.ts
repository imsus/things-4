import { html, TemplateResult } from 'lit-html'
import type { ProjectData } from '../../domain/project'
import type { TagData } from '../../domain/tag'

type SidebarItem = {
  label: string
  path: string
  color?: string
}

const NAV_ITEMS: SidebarItem[] = [
  { label: 'Inbox', path: '/inbox' },
  { label: 'Today', path: '/today' },
  { label: 'Upcoming', path: '/upcoming' },
  { label: 'Anytime', path: '/anytime' },
  { label: 'Someday', path: '/someday' },
]

export function renderSidebar(
  currentPath: string,
  projects: ProjectData[] = [],
  tags: TagData[] = [],
  onNewProject: () => void,
  onNewTag: () => void,
): TemplateResult {
  return html`
    <aside class="w-64 h-full bg-gray-50 border-r border-gray-200 flex flex-col overflow-y-auto">
      <div class="p-4">
        <h1 class="text-lg font-semibold text-gray-900">Things 4</h1>
      </div>

      <nav class="flex-1 px-2">
        <ul class="space-y-0.5">
          ${NAV_ITEMS.map(item => navItemTemplate(item, currentPath))}
        </ul>

        <div class="mt-6 mb-2 px-2 flex items-center justify-between">
          <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">Projects</span>
          <button class="text-gray-400 hover:text-gray-600 text-xs" @click=${onNewProject}>+</button>
        </div>
        <ul class="space-y-0.5">
          ${projects.map(p => navItemTemplate({ label: p.name, path: `/projects/${p.id}`, color: p.color }, currentPath))}
        </ul>

        <div class="mt-6 mb-2 px-2 flex items-center justify-between">
          <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">Tags</span>
          <button class="text-gray-400 hover:text-gray-600 text-xs" @click=${onNewTag}>+</button>
        </div>
        <ul class="space-y-0.5">
          ${tags.map(t => navItemTemplate({ label: t.name, path: `/tags/${t.id}`, color: t.color }, currentPath))}
        </ul>

        <div class="mt-6 mb-2 px-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Logbook</div>
        <ul class="space-y-0.5">
          ${navItemTemplate({ label: 'Logbook', path: '/logbook' }, currentPath)}
        </ul>
      </nav>
    </aside>
  `
}

function navItemTemplate(item: SidebarItem, currentPath: string): TemplateResult {
  const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/')
  const colorDot = item.color
    ? html`<span class="w-2 h-2 rounded-full bg-${item.color}-500 flex-shrink-0"></span>`
    : ''

  return html`
    <li>
      <a
        href="#${item.path}"
        class="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors
          ${isActive ? 'bg-gray-200 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}"
      >
        ${colorDot}
        ${item.label}
      </a>
    </li>
  `
}
