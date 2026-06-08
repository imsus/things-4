import { render, html } from 'lit-html'
import { Router } from './presentation/router'
import { renderSidebar } from './presentation/views/sidebar'
import { renderInboxView } from './presentation/views/inbox'
import { renderTaskDetail } from './presentation/views/task-detail'
import { TaskService } from './services/task-service'
import { showToast } from './presentation/components/toast'
import { db } from './data/database'
import { liveQuery } from 'dexie'
import type { TaskData } from './domain/task'
import './styles.css'

const app = document.getElementById('app')!
const router = new Router()
const taskService = new TaskService()

let currentPath = '/inbox'
let selectedTaskId: string | null = null
let selectedTask: TaskData | null = null

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
  renderApp()
})

// Subscribe to inbox tasks
liveQuery(() =>
  db.tasks
    .where('deletedAt')
    .equals('')
    .and(t => t.completedAt === null && t.projectId === null && !t.heading)
    .sortBy('order')
).subscribe(tasks => {
  renderApp(tasks)
})

let cachedTasks: TaskData[] = []

function renderApp(tasks?: TaskData[]) {
  if (tasks) cachedTasks = tasks

  render(html`
    <div class="flex h-screen bg-white">
      ${renderSidebar(currentPath)}
      ${renderInboxView(
        cachedTasks,
        handleTaskClick,
        handleNewTask,
        handleToggleComplete,
      )}
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

async function handleNewTask(title: string) {
  await taskService.create(title)
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
