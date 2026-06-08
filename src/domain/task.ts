export interface ChecklistItem {
  id: string
  title: string
  checked: boolean
  order: number
}

export interface TaskData {
  id: string
  title: string
  notes: string
  projectId: string | null
  tags: string[]
  checklist: ChecklistItem[]
  heading: boolean
  startDate: string | null
  deadline: string | null
  someday: boolean
  completedAt: string | null
  deletedAt: string | null
  order: number
  createdAt: string
  updatedAt: string
}

export function createTask(overrides: Partial<TaskData> = {}): TaskData {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    title: '',
    notes: '',
    projectId: null,
    tags: [],
    checklist: [],
    heading: false,
    startDate: null,
    deadline: null,
    someday: false,
    completedAt: null,
    deletedAt: null,
    order: Date.now(),
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

export function completeTask(task: TaskData): TaskData {
  return {
    ...task,
    completedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function uncompleteTask(task: TaskData): TaskData {
  return {
    ...task,
    completedAt: null,
    updatedAt: new Date().toISOString(),
  }
}

export function deleteTask(task: TaskData): TaskData {
  return {
    ...task,
    deletedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function restoreTask(task: TaskData): TaskData {
  return {
    ...task,
    deletedAt: null,
    updatedAt: new Date().toISOString(),
  }
}

export function addChecklistItem(task: TaskData, title: string): TaskData {
  const item: ChecklistItem = {
    id: crypto.randomUUID(),
    title,
    checked: false,
    order: task.checklist.length,
  }
  return {
    ...task,
    checklist: [...task.checklist, item],
    updatedAt: new Date().toISOString(),
  }
}

export function toggleChecklistItem(task: TaskData, itemId: string): TaskData {
  return {
    ...task,
    checklist: task.checklist.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    ),
    updatedAt: new Date().toISOString(),
  }
}

export function removeChecklistItem(task: TaskData, itemId: string): TaskData {
  return {
    ...task,
    checklist: task.checklist.filter(item => item.id !== itemId),
    updatedAt: new Date().toISOString(),
  }
}
