import { html, TemplateResult } from 'lit-html'
import type { ProjectData } from '../../domain/project'
import type { TagData } from '../../domain/tag'

type NavItem = {
  label: string
  path: string
  icon: TemplateResult
  badge?: number
  badgeCount?: number
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Inbox',
    path: '/inbox',
    icon: html`<svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none"><path d="M4 7h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" fill="#007AFF"/><path d="M4 7l2-3h12l2 3" stroke="#007AFF" stroke-width="1.5" fill="none"/><path d="M4 12h5l1 2h4l1-2h5" stroke="white" stroke-width="1.5" fill="none"/></svg>`,
  },
  {
    label: 'Today',
    path: '/today',
    icon: html`<svg class="w-[18px] h-[18px]" viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#FFCC00"/></svg>`,
  },
  {
    label: 'Upcoming',
    path: '/upcoming',
    icon: html`<svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="3" fill="#FF2D55"/><rect x="3" y="4" width="18" height="5" rx="3" fill="#FF3B30"/><circle cx="8" cy="15" r="1.5" fill="white"/><circle cx="12" cy="15" r="1.5" fill="white"/><circle cx="16" cy="15" r="1.5" fill="white"/></svg>`,
  },
  {
    label: 'Anytime',
    path: '/anytime',
    icon: html`<svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="4" rx="1" fill="#34C759" opacity="0.6"/><rect x="2" y="11" width="20" height="4" rx="1" fill="#34C759" opacity="0.8"/><rect x="2" y="16" width="20" height="4" rx="1" fill="#34C759"/></svg>`,
  },
  {
    label: 'Someday',
    path: '/someday',
    icon: html`<svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#30B0C7" stroke-width="1.5" fill="none"/><rect x="3" y="14" width="18" height="7" rx="3" fill="#30B0C7" opacity="0.3"/></svg>`,
  },
]

const LOGBOOK_ITEM: NavItem = {
  label: 'Logbook',
  path: '/logbook',
  icon: html`<svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" fill="#34C759"/><path d="M8 12l3 3 5-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
}

export function renderSidebar(
  currentPath: string,
  projects: ProjectData[] = [],
  tags: TagData[] = [],
  onNewProject: () => void,
  onNewTag: () => void,
  isOpen: boolean = false,
  onClose: () => void = () => {},
): TemplateResult {
  return html`
    <aside class="fixed lg:static inset-y-0 left-0 z-40 w-[250px] h-full bg-[var(--color-things-sidebar)] flex flex-col overflow-y-auto select-none border-r border-[var(--color-things-divider)] transform transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0">
      <div class="flex items-center justify-between px-3 pt-3 pb-1 lg:hidden">
        <span class="text-[15px] font-semibold text-[var(--color-things-text)]">Things</span>
        <button class="w-6 h-6 flex items-center justify-center text-[var(--color-things-secondary)] hover:text-[var(--color-things-text)]" @click=${onClose}>
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <nav class="flex-1 px-3 pt-2 lg:pt-3 pb-2">
        <ul class="space-y-0">
          ${NAV_ITEMS.map(item => navItem(item, currentPath))}
        </ul>

        <ul class="mt-1 space-y-0">
          ${navItem(LOGBOOK_ITEM, currentPath)}
        </ul>

        <div class="mt-8 mb-2 px-2 flex items-center justify-between">
          <span class="text-[11px] font-semibold text-[var(--color-things-secondary)] uppercase tracking-wide">Projects</span>
          <button class="w-5 h-5 flex items-center justify-center text-[var(--color-things-muted)] hover:text-[var(--color-things-text)] rounded transition-colors" @click=${onNewProject}>
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </button>
        </div>
        <ul class="space-y-0">
          ${projects.map(p => html`
            <li>
              <a href="#/projects/${p.id}" class="flex items-center gap-2.5 px-2 py-[6px] lg:py-[4px] rounded text-[13px] transition-colors
                ${currentPath === `/projects/${p.id}` ? 'bg-[var(--color-things-hover)] text-[var(--color-things-text)] font-medium' : 'text-[var(--color-things-secondary)] hover:text-[var(--color-things-text)] hover:bg-[var(--color-things-hover)]'}">
                <span class="w-[18px] h-[18px] rounded-[4px] flex items-center justify-center" style="background: ${getColorVar(p.color)}20">
                  <svg class="w-[12px] h-[12px]" viewBox="0 0 24 24" fill="${getColorVar(p.color)}"><rect x="3" y="3" width="18" height="18" rx="3"/></svg>
                </span>
                ${p.name}
              </a>
            </li>
          `)}
        </ul>

        <div class="mt-8 mb-2 px-2 flex items-center justify-between">
          <span class="text-[11px] font-semibold text-[var(--color-things-secondary)] uppercase tracking-wide">Tags</span>
          <button class="w-5 h-5 flex items-center justify-center text-[var(--color-things-muted)] hover:text-[var(--color-things-text)] rounded transition-colors" @click=${onNewTag}>
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </button>
        </div>
        <ul class="space-y-0">
          ${tags.map(t => html`
            <li>
              <a href="#/tags/${t.id}" class="flex items-center gap-2.5 px-2 py-[6px] lg:py-[4px] rounded text-[13px] transition-colors
                ${currentPath === `/tags/${t.id}` ? 'bg-[var(--color-things-hover)] text-[var(--color-things-text)] font-medium' : 'text-[var(--color-things-secondary)] hover:text-[var(--color-things-text)] hover:bg-[var(--color-things-hover)]'}">
                <span class="w-[18px] h-[18px] rounded-full flex items-center justify-center" style="background: ${getColorVar(t.color)}20">
                  <span class="w-[8px] h-[8px] rounded-full" style="background: ${getColorVar(t.color)}"></span>
                </span>
                ${t.name}
              </a>
            </li>
          `)}
        </ul>
      </nav>

      <div class="px-3 py-3 border-t border-[var(--color-things-divider)]">
        <button class="flex items-center gap-2 text-[13px] text-[var(--color-things-secondary)] hover:text-[var(--color-things-text)] transition-colors px-2" @click=${onNewProject}>
          <svg class="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          New List
        </button>
      </div>
    </aside>
  `
}

function navItem(item: NavItem, currentPath: string): TemplateResult {
  const isActive = currentPath === item.path

  return html`
    <li>
      <a href="#${item.path}" class="flex items-center gap-2.5 px-2 py-[6px] lg:py-[4px] rounded text-[13px] transition-colors
        ${isActive ? 'bg-[var(--color-things-hover)] text-[var(--color-things-text)] font-medium' : 'text-[var(--color-things-secondary)] hover:text-[var(--color-things-text)] hover:bg-[var(--color-things-hover)]'}">
        <span class="w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">${item.icon}</span>
        <span class="flex-1">${item.label}</span>
        ${item.badge ? html`
          <span class="w-[18px] h-[18px] rounded-full bg-[var(--color-things-red)] text-white text-[11px] font-semibold flex items-center justify-center">${item.badge}</span>
        ` : ''}
        ${item.badgeCount !== undefined ? html`
          <span class="text-[11px] text-[var(--color-things-muted)]">${item.badgeCount}</span>
        ` : ''}
      </a>
    </li>
  `
}

function getColorVar(color: string): string {
  const map: Record<string, string> = {
    red: '#FF3B30',
    orange: '#FF9500',
    yellow: '#FFCC00',
    green: '#34C759',
    mint: '#00C7BE',
    teal: '#30B0C7',
    cyan: '#32ADE6',
    blue: '#007AFF',
    purple: '#AF52DE',
    pink: '#FF2D55',
    gray: '#8E8E93',
    brown: '#A2845E',
  }
  return map[color] ?? '#8E8E93'
}
