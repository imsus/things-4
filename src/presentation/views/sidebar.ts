import { html, TemplateResult } from 'lit-html'
import type { ProjectData } from '../../domain/project'
import type { TagData } from '../../domain/tag'

const ICONS: Record<string, TemplateResult> = {
  inbox: html`<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" /></svg>`,
  today: html`<svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>`,
  upcoming: html`<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>`,
  anytime: html`<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
  someday: html`<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
  logbook: html`<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
  project: html`<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>`,
  tag: html`<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" /></svg>`,
}

type NavItem = {
  label: string
  path: string
  icon: string
  color?: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Inbox', path: '/inbox', icon: 'inbox' },
  { label: 'Today', path: '/today', icon: 'today' },
  { label: 'Upcoming', path: '/upcoming', icon: 'upcoming' },
  { label: 'Anytime', path: '/anytime', icon: 'anytime' },
  { label: 'Someday', path: '/someday', icon: 'someday' },
]

export function renderSidebar(
  currentPath: string,
  projects: ProjectData[] = [],
  tags: TagData[] = [],
  onNewProject: () => void,
  onNewTag: () => void,
): TemplateResult {
  return html`
    <aside class="w-[260px] h-full bg-[var(--color-things-sidebar)] flex flex-col overflow-y-auto select-none">
      <div class="pt-6 pb-4 px-5">
        <h1 class="text-[15px] font-semibold text-[var(--color-things-text)] tracking-tight">Things</h1>
      </div>

      <nav class="flex-1 px-2">
        <ul class="space-y-0">
          ${NAV_ITEMS.map(item => navItem(item, currentPath))}
        </ul>

        <div class="mt-8 mb-2 px-2 flex items-center justify-between">
          <span class="text-[11px] font-semibold text-[var(--color-things-secondary)] uppercase tracking-wider">Projects</span>
          <button class="w-5 h-5 flex items-center justify-center text-[var(--color-things-muted)] hover:text-[var(--color-things-text)] rounded transition-colors" @click=${onNewProject}>
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </button>
        </div>
        <ul class="space-y-0">
          ${projects.map(p => navItem({ label: p.name, path: `/projects/${p.id}`, icon: 'project', color: p.color }, currentPath))}
        </ul>

        <div class="mt-8 mb-2 px-2 flex items-center justify-between">
          <span class="text-[11px] font-semibold text-[var(--color-things-secondary)] uppercase tracking-wider">Tags</span>
          <button class="w-5 h-5 flex items-center justify-center text-[var(--color-things-muted)] hover:text-[var(--color-things-text)] rounded transition-colors" @click=${onNewTag}>
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </button>
        </div>
        <ul class="space-y-0">
          ${tags.map(t => navItem({ label: t.name, path: `/tags/${t.id}`, icon: 'tag', color: t.color }, currentPath))}
        </ul>

        <div class="mt-8 mb-2 px-2">
          <span class="text-[11px] font-semibold text-[var(--color-things-secondary)] uppercase tracking-wider">Logbook</span>
        </div>
        <ul class="space-y-0">
          ${navItem({ label: 'Logbook', path: '/logbook', icon: 'logbook' }, currentPath)}
        </ul>
      </nav>
    </aside>
  `
}

function navItem(item: NavItem, currentPath: string): TemplateResult {
  const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/')
  const icon = ICONS[item.icon] ?? ICONS['inbox']

  const colorDot = item.color
    ? html`<span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background: var(--color-things-${item.color}, #8E8E93)"></span>`
    : ''

  return html`
    <li>
      <a
        href="#${item.path}"
        class="flex items-center gap-2.5 px-2 py-[5px] rounded-md text-[13px] transition-colors
          ${isActive
            ? 'bg-[var(--color-things-hover)] text-[var(--color-things-text)] font-medium'
            : 'text-[var(--color-things-secondary)] hover:text-[var(--color-things-text)] hover:bg-[var(--color-things-hover)]'}"
      >
        <span class="${isActive ? 'text-[var(--color-things-blue)]' : 'text-[var(--color-things-muted)]'}">
          ${item.color ? colorDot : icon}
        </span>
        ${item.label}
      </a>
    </li>
  `
}
