import { render, html } from 'lit-html'
import { Router } from './presentation/router'
import { renderSidebar } from './presentation/views/sidebar'
import { renderTaskDetail } from './presentation/views/task-detail'
import { renderSearch } from './presentation/components/search'
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
let selectedTaskId: string | null = null
let selectedTask: TaskData | null = null
let cachedTasks: TaskData[] = []
let cachedProjects: ProjectData[] = []
let cachedTags: TagData[] = []
let searchQuery = ''
let unsubscribeCurrentView: { unsubscribe: () => void } | null = null

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
  selectedTaskId = null
  selectedTask = null
  searchQuery = ''
  console.log('[Router] navigate to', currentPath)
  loadTasksForCurrentView()
  renderApp()
})

// Keyboard shortcuts
document.addEventListener('keydown', (e: KeyboardEvent) => {
  // Don't trigger shortcuts when typing in inputs
  const target = e.target as HTMLElement
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
    if (e.key === 'Escape') {
      ;(target as HTMLInputElement).blur()
    }
    return
  }

  if (e.key === 'n' || e.key === 'N') {
    e.preventDefault()
    console.log('[Keyboard] N pressed → focus new task input')
    const input = document.querySelector('input[placeholder="New task..."]') as HTMLInputElement | null
    if (input) input.focus()
  } else if (e.key === 'Escape') {
    console.log('[Keyboard] Escape pressed → close detail')
    handleCloseDetail()
  } else if (e.key === 'Delete' || e.key === 'Backspace') {
    if (selectedTaskId) {
      console.log('[Keyboard] Delete pressed → delete task', selectedTaskId)
      handleDeleteTask()
    }
  }
})

function loadTasksForCurrentView() {
  // Unsubscribe from previous view's live query
  if (unsubscribeCurrentView) {
    unsubscribeCurrentView.unsubscribe()
    unsubscribeCurrentView = null
  }

  const projectId = extractProjectId(currentPath)
  const tagId = extractTagId(currentPath)
  console.log('[View] load tasks for', currentPath, { projectId, tagId })

  if (projectId) {
    unsubscribeCurrentView = liveQuery(() =>
      db.tasks
        .where('projectId')
        .equals(projectId)
        .and(t => t.completedAt === null && t.deletedAt === null && !t.heading)
        .sortBy('order')
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
    // Inbox view (default)
    unsubscribeCurrentView = liveQuery(() =>
      db.tasks
        .toArray()
        .then(tasks => tasks
          .filter(t => t.completedAt === null && t.deletedAt === null && t.projectId === null && !t.heading)
          .sort((a, b) => a.order - b.order)
        )
    ).subscribe(tasks => { cachedTasks = tasks; renderApp() })
  }
}

// Subscribe to projects and tags
liveQuery(() => db.projects.orderBy('order').toArray()).subscribe(projects => {
  console.log('[Data] projects updated', projects.length)
  cachedProjects = projects
  renderApp()
})

liveQuery(() => db.tags.orderBy('order').toArray()).subscribe(tags => {
  console.log('[Data] tags updated', tags.length)
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
  return 'Things 4'
}

function getFilteredTasks(): TaskData[] {
  if (!searchQuery) return cachedTasks
  const q = searchQuery.toLowerCase()
  return cachedTasks.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.notes.toLowerCase().includes(q)
  )
}

function renderApp() {
  const filteredTasks = getFilteredTasks()

  render(html`
    <div class="flex h-screen bg-white">
      ${renderSidebar(currentPath, cachedProjects, cachedTags, handleNewProject, handleNewTag)}
      <div class="flex-1 flex flex-col h-full overflow-hidden">
        ${renderSearch(searchQuery, handleSearch)}
        <header class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">${getViewName(currentPath)}</h2>
          <p class="text-sm text-gray-500 mt-1">${filteredTasks.length} tasks</p>
        </header>
        <div class="flex-1 overflow-y-auto px-6 py-4">
          ${filteredTasks.length === 0
            ? html`<p class="text-gray-400 text-sm">${searchQuery ? 'No matching tasks.' : 'No tasks yet.'}</p>`
            : html`
              <ul class="space-y-1">
                ${filteredTasks.map(task => renderTaskItem(task))}
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
                  const projectId = extractProjectId(currentPath)
                  handleNewTask(title, projectId)
                  input.value = ''
                }
              }
            }}
          />
        </div>
      </div>
      ${renderTaskDetail(
        selectedTask,
        handleCloseDetail,
        handleUpdateTask,
        handleDeleteTask,
        handleAddChecklistItem,
        handleToggleChecklistItem,
        handleRemoveChecklistItem,
      )}
    </div>
  `, app)
}

function renderTaskItem(task: TaskData) {
  const isCompleted = task.completedAt !== null
  return html`
    <li class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 group cursor-pointer"
        @click=${() => handleTaskClick(task.id)}>
      <button
        class="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors
          ${isCompleted ? 'bg-blue-500 border-blue-500' : 'border-gray-300 hover:border-blue-400'}"
        @click=${(e: Event) => { e.stopPropagation(); handleToggleComplete(task.id) }}
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

async function handleTaskClick(id: string) {
  console.log('[Task] click', id)
  selectedTaskId = id
  selectedTask = (await taskService.getById(id)) ?? null
  renderApp()
}

function handleCloseDetail() {
  console.log('[Task] close detail panel')
  selectedTaskId = null
  selectedTask = null
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
      if (selectedTaskId === id) {
        selectedTask = (await taskService.getById(id)) ?? null
        renderApp()
      }
    })
  } else {
    console.log('[Task] complete', id)
    await taskService.complete(id)
    showToast('Task completed', async () => {
      await taskService.uncomplete(id)
      if (selectedTaskId === id) {
        selectedTask = (await taskService.getById(id)) ?? null
        renderApp()
      }
    })
  }
  if (selectedTaskId === id) {
    selectedTask = (await taskService.getById(id)) ?? null
    renderApp()
  }
}

async function handleUpdateTask(changes: Partial<TaskData>) {
  if (!selectedTaskId) return
  console.log('[Task] update', selectedTaskId, changes)
  await taskService.update(selectedTaskId, changes)
  selectedTask = (await taskService.getById(selectedTaskId)) ?? null
  renderApp()
}

async function handleDeleteTask() {
  if (!selectedTaskId) return
  const id = selectedTaskId
  console.log('[Task] delete', id)
  await taskService.delete(id)
  selectedTaskId = null
  selectedTask = null
  renderApp()
  showToast('Task deleted', async () => {
    console.log('[Task] restore', id)
    await taskService.restore(id)
  })
}

async function handleAddChecklistItem(title: string) {
  if (!selectedTaskId) return
  console.log('[Checklist] add', selectedTaskId, title)
  await taskService.addChecklistItem(selectedTaskId, title)
  selectedTask = (await taskService.getById(selectedTaskId)) ?? null
  renderApp()
}

async function handleToggleChecklistItem(itemId: string) {
  if (!selectedTaskId) return
  console.log('[Checklist] toggle', selectedTaskId, itemId)
  await taskService.toggleChecklistItem(selectedTaskId, itemId)
  selectedTask = (await taskService.getById(selectedTaskId)) ?? null
  renderApp()
}

async function handleRemoveChecklistItem(itemId: string) {
  if (!selectedTaskId) return
  console.log('[Checklist] remove', selectedTaskId, itemId)
  await taskService.removeChecklistItem(selectedTaskId, itemId)
  selectedTask = (await taskService.getById(selectedTaskId)) ?? null
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

function handleSearch(query: string) {
  console.log('[Search]', query)
  searchQuery = query
  renderApp()
}
