import { render, html } from 'lit-html'
import { Router } from './presentation/router'
import { renderSidebar } from './presentation/views/sidebar'
import { showProjectDialog } from './presentation/views/project-dialog'
import { showTagDialog } from './presentation/views/tag-dialog'
import { TaskService } from './services/task-service'
import { ProjectService } from './services/project-service'
import { TagService } from './services/tag-service'
import { showToast } from './presentation/components/toast'
import { db } from './data/database'
import { liveQuery } from 'dexie'
import type { TaskData } from './domain/task'
import type { ProjectData } from './domain/project'
import type { TagData } from './domain/tag'
import './styles.css'

const app = document.getElementById('app')!
const router = new Router()
const taskService = new TaskService()
const projectService = new ProjectService()
const tagService = new TagService()

let currentPath = '/inbox'
let expandedTaskId: string | null = null
let expandedTask: TaskData | null = null
let cachedTasks: TaskData[] = []
let cachedProjects: ProjectData[] = []
let cachedTags: TagData[] = []
let searchQuery = ''
let unsubscribeCurrentView: { unsubscribe: () => void } | null = null
let sidebarOpen = false

router.addRoute('/inbox')
router.addRoute('/today')
router.addRoute('/upcoming')
router.addRoute('/anytime')
router.addRoute('/someday')
router.addRoute('/logbook')
router.addRoute('/projects/:id', ['id'])
router.addRoute('/tags/:id', ['id'])

router.listen(() => {
  currentPath = window.location.hash.slice(1) || '/inbox'
  expandedTaskId = null
  expandedTask = null
  searchQuery = ''
  sidebarOpen = false
  console.log('[Router] navigate to', currentPath)
  loadTasksForCurrentView()
  renderApp()
})

document.addEventListener('keydown', (e: KeyboardEvent) => {
  const target = e.target as HTMLElement
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
    if (e.key === 'Escape') {
      ;(target as HTMLInputElement).blur()
    }
    return
  }

  if (e.key === 'n' || e.key === 'N') {
    e.preventDefault()
    console.log('[Keyboard] N pressed')
    const input = document.querySelector('input[placeholder="New task..."]') as HTMLInputElement | null
    if (input) input.focus()
  } else if (e.key === 'Escape') {
    console.log('[Keyboard] Escape pressed')
    collapseTask()
  } else if ((e.key === 'Delete' || e.key === 'Backspace') && expandedTaskId) {
    console.log('[Keyboard] Delete pressed')
    handleDeleteTask()
  }
})

function loadTasksForCurrentView() {
  if (unsubscribeCurrentView) {
    unsubscribeCurrentView.unsubscribe()
    unsubscribeCurrentView = null
  }

  const projectId = extractProjectId(currentPath)
  const tagId = extractTagId(currentPath)
  console.log('[View] load tasks for', currentPath, { projectId, tagId })

  if (projectId) {
    unsubscribeCurrentView = liveQuery(() =>
      db.tasks.toArray().then(tasks =>
        tasks
          .filter(t => t.completedAt === null && t.deletedAt === null && t.projectId === projectId && !t.heading)
          .sort((a, b) => a.order - b.order)
      )
    ).subscribe(tasks => { cachedTasks = tasks; renderApp() })
  } else if (tagId) {
    unsubscribeCurrentView = taskService.getTasksByTag(tagId).subscribe(tasks => { cachedTasks = tasks; renderApp() })
  } else if (currentPath === '/today') {
    unsubscribeCurrentView = taskService.getTodayTasks().subscribe(tasks => { cachedTasks = tasks; renderApp() })
  } else if (currentPath === '/upcoming') {
    unsubscribeCurrentView = taskService.getUpcomingTasks().subscribe(tasks => { cachedTasks = tasks; renderApp() })
  } else if (currentPath === '/anytime') {
    unsubscribeCurrentView = taskService.getAnytimeTasks().subscribe(tasks => { cachedTasks = tasks; renderApp() })
  } else if (currentPath === '/someday') {
    unsubscribeCurrentView = taskService.getSomedayTasks().subscribe(tasks => { cachedTasks = tasks; renderApp() })
  } else if (currentPath === '/logbook') {
    unsubscribeCurrentView = taskService.getCompletedTasks().subscribe(tasks => { cachedTasks = tasks; renderApp() })
  } else {
    unsubscribeCurrentView = liveQuery(() =>
      db.tasks.toArray().then(tasks =>
        tasks
          .filter(t => t.completedAt === null && t.deletedAt === null && t.projectId === null && !t.heading)
          .sort((a, b) => a.order - b.order)
      )
    ).subscribe(tasks => { cachedTasks = tasks; renderApp() })
  }
}

liveQuery(() => db.projects.orderBy('order').toArray()).subscribe(projects => {
  cachedProjects = projects
  renderApp()
})

liveQuery(() => db.tags.orderBy('order').toArray()).subscribe(tags => {
  cachedTags = tags
  renderApp()
})

function extractProjectId(path: string): string | null {
  const match = path.match(/^\/projects\/(.+)$/)
  return match ? match[1]! : null
}

function extractTagId(path: string): string | null {
  const match = path.match(/^\/tags\/(.+)$/)
  return match ? match[1]! : null
}

function getViewName(path: string): string {
  if (path === '/inbox') return 'Inbox'
  if (path === '/today') return 'Today'
  if (path === '/upcoming') return 'Upcoming'
  if (path === '/anytime') return 'Anytime'
  if (path === '/someday') return 'Someday'
  if (path === '/logbook') return 'Logbook'
  if (path.startsWith('/projects/')) {
    const project = cachedProjects.find(p => p.id === extractProjectId(path))
    return project?.name ?? 'Project'
  }
  if (path.startsWith('/tags/')) {
    const tag = cachedTags.find(t => t.id === extractTagId(path))
    return tag?.name ?? 'Tag'
  }
  return 'Things'
}

function getViewIcon(path: string): string {
  if (path === '/today') return '⭐'
  if (path.startsWith('/projects/')) return '🔵'
  return ''
}

function getFilteredTasks(): TaskData[] {
  if (!searchQuery) return cachedTasks
  const q = searchQuery.toLowerCase()
  return cachedTasks.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.notes.toLowerCase().includes(q)
  )
}

function getProjectName(projectId: string | null): string {
  if (!projectId) return ''
  const project = cachedProjects.find(p => p.id === projectId)
  return project?.name ?? ''
}

function renderApp() {
  const filteredTasks = getFilteredTasks()
  const viewIcon = getViewIcon(currentPath)

  render(html`
    <div class="flex h-screen bg-[var(--color-things-bg)] relative">
      ${renderSidebar(currentPath, cachedProjects, cachedTags, handleNewProject, handleNewTag, sidebarOpen, () => { sidebarOpen = false; renderApp() })}

      ${sidebarOpen ? html`
        <div class="fixed inset-0 bg-black/20 z-30 lg:hidden" @click=${() => { sidebarOpen = false; renderApp() }}></div>
      ` : ''}

      <div class="flex-1 flex flex-col h-full overflow-hidden">
        <header class="px-6 lg:px-12 pt-8 lg:pt-12 pb-4 lg:pb-6 flex items-center gap-3">
          <button class="lg:hidden w-8 h-8 flex items-center justify-center text-[var(--color-things-secondary)] hover:text-[var(--color-things-text)]" @click=${() => { sidebarOpen = !sidebarOpen; renderApp() }}>
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          </button>
          <div class="flex items-center gap-3 flex-1">
            ${viewIcon ? html`<span class="text-[24px] lg:text-[28px]">${viewIcon}</span>` : ''}
            <h1 class="text-[24px] lg:text-[28px] font-bold text-[var(--color-things-text)] tracking-tight">${getViewName(currentPath)}</h1>
          </div>
        </header>
        <div class="flex-1 overflow-y-auto px-6 lg:px-12 pb-6 lg:pb-8">
          ${filteredTasks.length === 0
            ? html`<p class="text-[var(--color-things-muted)] text-[15px] mt-4">${searchQuery ? 'No matching tasks.' : 'No tasks yet.'}</p>`
            : html`
              <ul class="space-y-0">
                ${filteredTasks.map(task => renderTaskItem(task))}
              </ul>
            `}
        </div>
        <div class="px-6 lg:px-12 py-3 lg:py-4">
          <input
            type="text"
            placeholder="New task..."
            class="w-full px-0 py-2 text-[15px] bg-transparent border-0 border-b border-[var(--color-things-divider)] focus:outline-none focus:border-[var(--color-things-accent)] placeholder:text-[var(--color-things-muted)]"
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === 'Enter') {
                const input = e.target as HTMLInputElement
                const title = input.value.trim()
                if (title) {
                  const projectId = extractProjectId(currentPath)
                  handleNewTask(title, projectId)
                  input.value = ''
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  `, app)
}

function renderTaskItem(task: TaskData) {
  const isCompleted = task.completedAt !== null
  const isExpanded = expandedTaskId === task.id
  const projectName = getProjectName(task.projectId)
  const hasNotes = task.notes.length > 0
  const hasChecklist = task.checklist.length > 0
  const hasIcon = hasNotes || hasChecklist || task.startDate || task.deadline

  if (isExpanded && expandedTask) {
    return renderExpandedTask(expandedTask, projectName)
  }

  return html`
    <li class="flex items-start gap-3 lg:gap-4 px-3 lg:px-4 py-[10px] rounded-lg hover:bg-[var(--color-things-hover-subtle)] cursor-pointer transition-colors"
        @click=${() => handleTaskClick(task.id)}>
      <button
        aria-label="${isCompleted ? 'Mark task as incomplete' : 'Mark task as complete'}"
        class="mt-[2px] w-[16px] h-[16px] rounded-[4px] border-[1.5px] flex-shrink-0 flex items-center justify-center transition-all duration-150
          ${isCompleted
            ? 'bg-[var(--color-things-accent)] border-[var(--color-things-accent)]'
            : 'border-[var(--color-things-checkbox-border)] hover:border-[var(--color-things-accent)]'}"
        @click=${(e: Event) => { e.stopPropagation(); handleToggleComplete(task.id) }}
      >
        ${isCompleted ? html`<svg class="w-[10px] h-[10px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>` : ''}
      </button>
      <div class="flex-1 min-w-0">
        <span class="text-[15px] leading-snug ${isCompleted ? 'line-through text-[var(--color-things-muted)]' : 'text-[var(--color-things-text)]'}">${task.title}</span>
        ${projectName ? html`<div class="text-[11px] text-[var(--color-things-secondary)] mt-0.5">${projectName}</div>` : ''}
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        ${task.someday ? html`<span class="text-[11px] text-[var(--color-things-secondary)]">Someday</span>` : ''}
        ${task.startDate ? html`<span class="text-[11px] text-[var(--color-things-accent)]">${formatDate(task.startDate)}</span>` : ''}
        ${task.deadline ? html`<span class="text-[11px] text-[var(--color-things-red)]">${formatDate(task.deadline)}</span>` : ''}
        ${task.tags.length > 0 ? html`
          <div class="flex gap-1">
            ${task.tags.map(() => html`<span class="w-[6px] h-[6px] rounded-full bg-[var(--color-things-secondary)]"></span>`)}
          </div>
        ` : ''}
        ${hasIcon ? html`
          <span class="text-[var(--color-things-muted)]">
            ${hasChecklist ? html`<svg class="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>` : ''}
            ${hasNotes ? html`<svg class="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>` : ''}
          </span>
        ` : ''}
      </div>
    </li>
  `
}

function renderExpandedTask(task: TaskData, _projectName: string) {
  return html`
    <li class="px-3 lg:px-4 py-4 rounded-lg bg-[var(--color-things-hover-subtle)] mb-1">
      <div class="flex items-start gap-3 lg:gap-4">
        <button
          aria-label="${task.completedAt ? 'Mark task as incomplete' : 'Mark task as complete'}"
          class="mt-[2px] w-[16px] h-[16px] rounded-[4px] border-[1.5px] flex-shrink-0 flex items-center justify-center transition-all duration-150
            ${task.completedAt
              ? 'bg-[var(--color-things-accent)] border-[var(--color-things-accent)]'
              : 'border-[var(--color-things-checkbox-border)] hover:border-[var(--color-things-accent)]'}"
          @click=${() => handleToggleComplete(task.id)}
        >
          ${task.completedAt ? html`<svg class="w-[10px] h-[10px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>` : ''}
        </button>
        <div class="flex-1 min-w-0">
          <input
            type="text"
            .value=${task.title}
            class="w-full text-[20px] font-semibold bg-transparent border-0 focus:outline-none text-[var(--color-things-text)]"
            @change=${(e: Event) => handleUpdateTask({ title: (e.target as HTMLInputElement).value })}
          />
          ${task.notes ? html`
            <textarea
              .value=${task.notes}
              placeholder="Notes"
              rows="2"
              class="w-full text-[13px] bg-transparent border-0 focus:outline-none text-[var(--color-things-secondary)] placeholder:text-[var(--color-things-muted)] resize-none mt-1 leading-relaxed"
              @change=${(e: Event) => handleUpdateTask({ notes: (e.target as HTMLTextAreaElement).value })}
            ></textarea>
          ` : html`
            <textarea
              placeholder="Add notes..."
              rows="1"
              class="w-full text-[13px] bg-transparent border-0 focus:outline-none text-[var(--color-things-secondary)] placeholder:text-[var(--color-things-muted)] resize-none mt-1"
              @change=${(e: Event) => handleUpdateTask({ notes: (e.target as HTMLTextAreaElement).value })}
            ></textarea>
          `}
        </div>
      </div>

      <div class="mt-4 ml-6 lg:ml-8 space-y-0">
        ${task.checklist.map(item => html`
          <div class="flex items-center gap-3 py-1.5 border-b border-[var(--color-things-divider)] last:border-0 group/item">
            <button
              aria-label="${item.checked ? 'Mark item as incomplete' : 'Mark item as complete'}"
              class="w-[16px] h-[16px] rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-150
                ${item.checked
                  ? 'bg-[var(--color-things-checklist-circle)] border-[var(--color-things-checklist-circle)]'
                  : 'border-[var(--color-things-checklist-circle)]'}"
              @click=${() => handleToggleChecklistItem(item.id)}
            >
              ${item.checked ? html`<svg class="w-[8px] h-[8px] text-white" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" /></svg>` : ''}
            </button>
            <span class="flex-1 text-[15px] ${item.checked ? 'line-through text-[var(--color-things-muted)]' : 'text-[var(--color-things-text)]'}">${item.title}</span>
            <button aria-label="Remove checklist item" class="opacity-0 group-hover/item:opacity-100 text-[var(--color-things-muted)] hover:text-[var(--color-things-red)] transition-opacity" @click=${() => handleRemoveChecklistItem(item.id)}>
              <svg class="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        `)}
        <div class="flex items-center gap-3 py-1.5">
          <span class="w-[16px] h-[16px] rounded-full border-2 border-[var(--color-things-checklist-circle)] flex-shrink-0"></span>
          <input
            type="text"
            placeholder="Add item..."
            class="flex-1 text-[15px] bg-transparent border-0 focus:outline-none placeholder:text-[var(--color-things-muted)]"
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === 'Enter') {
                const input = e.target as HTMLInputElement
                const title = input.value.trim()
                if (title) {
                  handleAddChecklistItem(title)
                  input.value = ''
                }
              }
            }}
          />
        </div>
      </div>

      <div class="mt-4 ml-6 lg:ml-8 flex items-center gap-4 text-[var(--color-things-muted)]">
        <button aria-label="Delete task" class="flex items-center gap-1.5 text-[11px] hover:text-[var(--color-things-text)] transition-colors" @click=${() => handleDeleteTask()}>
          <svg class="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
          Delete
        </button>
      </div>
    </li>
  `
}

function formatDate(dateStr: string): string {
  const today = new Date().toISOString().split('T')[0]!
  if (dateStr === today) return 'Today'
  const d = new Date(dateStr + 'T00:00:00')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getMonth()]} ${d.getDate()}`
}

async function handleTaskClick(id: string) {
  if (expandedTaskId === id) {
    collapseTask()
    return
  }
  console.log('[Task] expand', id)
  expandedTaskId = id
  expandedTask = (await taskService.getById(id)) ?? null
  renderApp()
}

function collapseTask() {
  expandedTaskId = null
  expandedTask = null
  renderApp()
}

async function handleNewTask(title: string, projectId: string | null = null) {
  console.log('[Task] create', { title, projectId })
  await taskService.create(title, projectId)
}

async function handleToggleComplete(id: string) {
  const task = await taskService.getById(id)
  if (!task) return
  if (task.completedAt) {
    console.log('[Task] uncomplete', id)
    await taskService.uncomplete(id)
    showToast('Task restored', async () => {
      await taskService.complete(id)
      if (expandedTaskId === id) {
        expandedTask = (await taskService.getById(id)) ?? null
        renderApp()
      }
    })
  } else {
    console.log('[Task] complete', id)
    await taskService.complete(id)
    showToast('Task completed', async () => {
      await taskService.uncomplete(id)
      if (expandedTaskId === id) {
        expandedTask = (await taskService.getById(id)) ?? null
        renderApp()
      }
    })
  }
  if (expandedTaskId === id) {
    expandedTask = (await taskService.getById(id)) ?? null
    renderApp()
  }
}

async function handleUpdateTask(changes: Partial<TaskData>) {
  if (!expandedTaskId) return
  console.log('[Task] update', expandedTaskId, changes)
  await taskService.update(expandedTaskId, changes)
  expandedTask = (await taskService.getById(expandedTaskId)) ?? null
  renderApp()
}

async function handleDeleteTask() {
  if (!expandedTaskId) return
  const id = expandedTaskId
  console.log('[Task] delete', id)
  await taskService.delete(id)
  expandedTaskId = null
  expandedTask = null
  renderApp()
  showToast('Task deleted', async () => {
    console.log('[Task] restore', id)
    await taskService.restore(id)
  })
}

async function handleAddChecklistItem(title: string) {
  if (!expandedTaskId) return
  console.log('[Checklist] add', expandedTaskId, title)
  await taskService.addChecklistItem(expandedTaskId, title)
  expandedTask = (await taskService.getById(expandedTaskId)) ?? null
  renderApp()
}

async function handleToggleChecklistItem(itemId: string) {
  if (!expandedTaskId) return
  console.log('[Checklist] toggle', expandedTaskId, itemId)
  await taskService.toggleChecklistItem(expandedTaskId, itemId)
  expandedTask = (await taskService.getById(expandedTaskId)) ?? null
  renderApp()
}

async function handleRemoveChecklistItem(itemId: string) {
  if (!expandedTaskId) return
  console.log('[Checklist] remove', expandedTaskId, itemId)
  await taskService.removeChecklistItem(expandedTaskId, itemId)
  expandedTask = (await taskService.getById(expandedTaskId)) ?? null
  renderApp()
}

async function handleNewProject() {
  console.log('[Project] open create dialog')
  const result = await showProjectDialog()
  if (result) {
    console.log('[Project] create', result)
    await projectService.create(result.name, result.color)
  }
}

async function handleNewTag() {
  console.log('[Tag] open create dialog')
  const result = await showTagDialog()
  if (result) {
    console.log('[Tag] create', result)
    await tagService.create(result.name, result.color)
  }
}
