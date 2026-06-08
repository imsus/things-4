import { render, html } from 'lit-html'
import { Router } from './presentation/router'
import { renderSidebar } from './presentation/views/sidebar'
import { renderTaskDetail } from './presentation/views/task-detail'
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
  loadTasksForCurrentView()
  renderApp()
})

function loadTasksForCurrentView() {
  const projectId = extractProjectId(currentPath)
  const tagId = extractTagId(currentPath)

  if (projectId) {
    liveQuery(() =>
      db.tasks
        .where('projectId')
        .equals(projectId)
        .and(t => t.completedAt === null && t.deletedAt === null && !t.heading)
        .sortBy('order')
    ).subscribe(tasks => { cachedTasks = tasks; renderApp() })
  } else if (tagId) {
    taskService.getTasksByTag(tagId).subscribe(tasks => { cachedTasks = tasks; renderApp() })
  } else if (currentPath === '/today') {
    taskService.getTodayTasks().subscribe(tasks => { cachedTasks = tasks; renderApp() })
  } else if (currentPath === '/upcoming') {
    taskService.getUpcomingTasks().subscribe(tasks => { cachedTasks = tasks; renderApp() })
  } else if (currentPath === '/anytime') {
    taskService.getAnytimeTasks().subscribe(tasks => { cachedTasks = tasks; renderApp() })
  } else if (currentPath === '/someday') {
    taskService.getSomedayTasks().subscribe(tasks => { cachedTasks = tasks; renderApp() })
  } else if (currentPath === '/logbook') {
    taskService.getCompletedTasks().subscribe(tasks => { cachedTasks = tasks; renderApp() })
  } else {
    // Inbox view (default)
    liveQuery(() =>
      db.tasks
        .where('deletedAt')
        .equals('')
        .and(t => t.completedAt === null && t.projectId === null && !t.heading)
        .sortBy('order')
    ).subscribe(tasks => { cachedTasks = tasks; renderApp() })
  }
}

// Subscribe to projects and tags
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
  return 'Things 4'
}

function renderApp() {
  render(html`
    <div class="flex h-screen bg-white">
      ${renderSidebar(currentPath, cachedProjects, cachedTags, handleNewProject, handleNewTag)}
      <div class="flex-1 flex flex-col h-full overflow-hidden">
        <header class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">${getViewName(currentPath)}</h2>
          <p class="text-sm text-gray-500 mt-1">${cachedTasks.length} tasks</p>
        </header>
        <div class="flex-1 overflow-y-auto px-6 py-4">
          ${cachedTasks.length === 0
            ? html`<p class="text-gray-400 text-sm">No tasks yet.</p>`
            : html`
              <ul class="space-y-1">
                ${cachedTasks.map(task => renderTaskItem(task))}
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
  selectedTaskId = id
  selectedTask = (await taskService.getById(id)) ?? null
  renderApp()
}

function handleCloseDetail() {
  selectedTaskId = null
  selectedTask = null
  renderApp()
}

async function handleNewTask(title: string, projectId: string | null = null) {
  await taskService.create(title, projectId)
}

async function handleToggleComplete(id: string) {
  const task = await taskService.getById(id)
  if (!task) return
  if (task.completedAt) {
    await taskService.uncomplete(id)
    showToast('Task restored', async () => {
      await taskService.complete(id)
      if (selectedTaskId === id) {
        selectedTask = (await taskService.getById(id)) ?? null
        renderApp()
      }
    })
  } else {
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
  await taskService.update(selectedTaskId, changes)
  selectedTask = (await taskService.getById(selectedTaskId)) ?? null
  renderApp()
}

async function handleDeleteTask() {
  if (!selectedTaskId) return
  const id = selectedTaskId
  await taskService.delete(id)
  selectedTaskId = null
  selectedTask = null
  renderApp()
  showToast('Task deleted', async () => {
    await taskService.restore(id)
  })
}

async function handleAddChecklistItem(title: string) {
  if (!selectedTaskId) return
  await taskService.addChecklistItem(selectedTaskId, title)
  selectedTask = (await taskService.getById(selectedTaskId)) ?? null
  renderApp()
}

async function handleToggleChecklistItem(itemId: string) {
  if (!selectedTaskId) return
  await taskService.toggleChecklistItem(selectedTaskId, itemId)
  selectedTask = (await taskService.getById(selectedTaskId)) ?? null
  renderApp()
}

async function handleRemoveChecklistItem(itemId: string) {
  if (!selectedTaskId) return
  await taskService.removeChecklistItem(selectedTaskId, itemId)
  selectedTask = (await taskService.getById(selectedTaskId)) ?? null
  renderApp()
}

async function handleNewProject() {
  const result = await showProjectDialog()
  if (result) {
    await projectService.create(result.name, result.color)
  }
}

async function handleNewTag() {
  const result = await showTagDialog()
  if (result) {
    await tagService.create(result.name, result.color)
  }
}
