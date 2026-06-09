import { TaskRepository } from '../data/task-repository'
import { ProjectRepository } from '../data/project-repository'
import { TagRepository } from '../data/tag-repository'
import {
  createTask,
  completeTask,
  uncompleteTask,
  deleteTask,
  restoreTask,
  addChecklistItem,
  toggleChecklistItem,
  removeChecklistItem,
  type TaskData,
} from '../domain/task'
import type { ProjectData } from '../domain/project'
import type { TagData } from '../domain/tag'
import type { ProjectColor } from '../domain/colors'
import type { Bucket } from '../domain/bucket'

export interface ToastState {
  id: string
  message: string
  onUndo: () => void
  expiresAt: number
}

export interface AppState {
  currentPath: string
  expandedTaskId: string | null
  expandedTask: TaskData | null
  tasks: TaskData[]
  projects: ProjectData[]
  tags: TagData[]
  searchQuery: string
  sidebarOpen: boolean
  toasts: ToastState[]
}

type Listener = (state: AppState) => void

const INITIAL_STATE: AppState = {
  currentPath: '/inbox',
  expandedTaskId: null,
  expandedTask: null,
  tasks: [],
  projects: [],
  tags: [],
  searchQuery: '',
  sidebarOpen: false,
  toasts: [],
}

export class AppService {
  private state: AppState = { ...INITIAL_STATE }
  private listeners: Listener[] = []
  private taskRepo = new TaskRepository()
  private projectRepo = new ProjectRepository()
  private tagRepo = new TagRepository()
  private unsubscribers: Array<{ unsubscribe: () => void }> = []

  getState(): AppState {
    return this.state
  }

  subscribe(listener: Listener): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state)
    }
  }

  private setState(partial: Partial<AppState>) {
    this.state = { ...this.state, ...partial }
    this.notify()
  }

  // Navigation
  navigate(path: string) {
    this.setState({
      currentPath: path,
      expandedTaskId: null,
      expandedTask: null,
      searchQuery: '',
      sidebarOpen: false,
    })
    this.loadTasksForCurrentView()
  }

  toggleSidebar() {
    this.setState({ sidebarOpen: !this.state.sidebarOpen })
  }

  closeSidebar() {
    this.setState({ sidebarOpen: false })
  }

  // Task operations
  async createTask(title: string, projectId: string | null = null) {
    const task = createTask({ title, projectId })
    await this.taskRepo.save(task)
    this.loadTasksForCurrentView()
  }

  async expandTask(id: string) {
    if (this.state.expandedTaskId === id) {
      this.collapseTask()
      return
    }
    const task = await this.taskRepo.get(id)
    this.setState({ expandedTaskId: id, expandedTask: task ?? null })
  }

  collapseTask() {
    this.setState({ expandedTaskId: null, expandedTask: null })
  }

  async completeTask(id: string) {
    await this.taskRepo.mutate(id, completeTask)
    this.showToast('Task completed', async () => {
      await this.taskRepo.mutate(id, uncompleteTask)
      this.refreshExpanded(id)
      this.loadTasksForCurrentView()
    })
    this.refreshExpanded(id)
    this.loadTasksForCurrentView()
  }

  async uncompleteTask(id: string) {
    await this.taskRepo.mutate(id, uncompleteTask)
    this.showToast('Task restored', async () => {
      await this.taskRepo.mutate(id, completeTask)
      this.refreshExpanded(id)
      this.loadTasksForCurrentView()
    })
    this.refreshExpanded(id)
    this.loadTasksForCurrentView()
  }

  async toggleComplete(id: string) {
    const task = await this.taskRepo.get(id)
    if (!task) return
    if (task.completedAt) {
      await this.uncompleteTask(id)
    } else {
      await this.completeTask(id)
    }
  }

  async updateTask(id: string, changes: Partial<TaskData>) {
    const task = await this.taskRepo.get(id)
    if (!task) return
    const updated = { ...task, ...changes, updatedAt: new Date().toISOString() }
    await this.taskRepo.save(updated)
    this.refreshExpanded(id)
    this.loadTasksForCurrentView()
  }

  async deleteTask(id: string) {
    await this.taskRepo.mutate(id, deleteTask)
    this.setState({ expandedTaskId: null, expandedTask: null })
    this.showToast('Task deleted', async () => {
      await this.taskRepo.mutate(id, restoreTask)
      this.loadTasksForCurrentView()
    })
    this.loadTasksForCurrentView()
  }

  // Checklist operations
  async addChecklistItem(taskId: string, title: string) {
    await this.taskRepo.mutate(taskId, t => addChecklistItem(t, title))
    this.refreshExpanded(taskId)
  }

  async toggleChecklistItem(taskId: string, itemId: string) {
    await this.taskRepo.mutate(taskId, t => toggleChecklistItem(t, itemId))
    this.refreshExpanded(taskId)
  }

  async removeChecklistItem(taskId: string, itemId: string) {
    await this.taskRepo.mutate(taskId, t => removeChecklistItem(t, itemId))
    this.refreshExpanded(taskId)
  }

  // Search
  setSearchQuery(query: string) {
    this.setState({ searchQuery: query })
  }

  getFilteredTasks(): TaskData[] {
    if (!this.state.searchQuery) return this.state.tasks
    const q = this.state.searchQuery.toLowerCase()
    return this.state.tasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.notes.toLowerCase().includes(q)
    )
  }

  // Project operations
  async createProject(name: string, color: ProjectColor) {
    await this.projectRepo.create(name, color)
  }

  async deleteProject(id: string) {
    await this.projectRepo.delete(id)
  }

  // Tag operations
  async createTag(name: string, color: ProjectColor) {
    await this.tagRepo.create(name, color)
  }

  async deleteTag(id: string) {
    await this.tagRepo.delete(id)
  }

  // Toast
  showToast(message: string, onUndo: () => void, duration = 5000) {
    const id = crypto.randomUUID()
    const toast: ToastState = { id, message, onUndo, expiresAt: Date.now() + duration }
    this.setState({ toasts: [...this.state.toasts, toast] })
    setTimeout(() => this.dismissToast(id), duration)
  }

  dismissToast(id: string) {
    this.setState({ toasts: this.state.toasts.filter(t => t.id !== id) })
  }

  // View helpers
  getViewName(): string {
    const path = this.state.currentPath
    if (path === '/inbox') return 'Inbox'
    if (path === '/today') return 'Today'
    if (path === '/upcoming') return 'Upcoming'
    if (path === '/anytime') return 'Anytime'
    if (path === '/someday') return 'Someday'
    if (path === '/logbook') return 'Logbook'
    if (path.startsWith('/projects/')) {
      const id = path.slice('/projects/'.length)
      const project = this.state.projects.find(p => p.id === id)
      return project?.name ?? 'Project'
    }
    if (path.startsWith('/tags/')) {
      const id = path.slice('/tags/'.length)
      const tag = this.state.tags.find(t => t.id === id)
      return tag?.name ?? 'Tag'
    }
    return 'Things'
  }

  getViewIcon(): string {
    if (this.state.currentPath === '/today') return '⭐'
    if (this.state.currentPath.startsWith('/projects/')) return '🔵'
    return ''
  }

  getProjectName(projectId: string | null): string {
    if (!projectId) return ''
    return this.state.projects.find(p => p.id === projectId)?.name ?? ''
  }

  // Observability setup
  init() {
    this.unsubscribers.push(
      this.projectRepo.observeAll().subscribe(projects => {
        this.setState({ projects })
      })
    )
    this.unsubscribers.push(
      this.tagRepo.observeAll().subscribe(tags => {
        this.setState({ tags })
      })
    )
    this.loadTasksForCurrentView()
  }

  destroy() {
    for (const unsub of this.unsubscribers) {
      unsub.unsubscribe()
    }
    this.unsubscribers = []
  }

  private async refreshExpanded(id: string) {
    if (this.state.expandedTaskId === id) {
      const task = await this.taskRepo.get(id)
      this.setState({ expandedTask: task ?? null })
    }
  }

  private loadTasksForCurrentView() {
    // Unsubscribe from previous view
    for (const unsub of this.unsubscribers) {
      unsub.unsubscribe()
    }
    this.unsubscribers = []

    // Re-subscribe to projects and tags
    this.unsubscribers.push(
      this.projectRepo.observeAll().subscribe(projects => {
        this.setState({ projects })
      })
    )
    this.unsubscribers.push(
      this.tagRepo.observeAll().subscribe(tags => {
        this.setState({ tags })
      })
    )

    const path = this.state.currentPath
    const projectId = path.match(/^\/projects\/(.+)$/)?.[1] ?? null
    const tagId = path.match(/^\/tags\/(.+)$/)?.[1] ?? null

    if (projectId) {
      this.unsubscribers.push(
        this.taskRepo.observeByProject(projectId).subscribe(tasks => {
          this.setState({ tasks })
        })
      )
    } else if (tagId) {
      this.unsubscribers.push(
        this.taskRepo.observeByTag(tagId).subscribe(tasks => {
          this.setState({ tasks })
        })
      )
    } else if (path === '/logbook') {
      this.unsubscribers.push(
        this.taskRepo.observe('logbook').subscribe(tasks => {
          this.setState({ tasks })
        })
      )
    } else {
      const bucket = pathToBucket(path)
      this.unsubscribers.push(
        this.taskRepo.observe(bucket).subscribe(tasks => {
          this.setState({ tasks })
        })
      )
    }
  }
}

function pathToBucket(path: string): Bucket {
  if (path === '/today') return 'today'
  if (path === '/upcoming') return 'upcoming'
  if (path === '/anytime') return 'anytime'
  if (path === '/someday') return 'someday'
  return 'inbox'
}
