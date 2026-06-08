import { html, TemplateResult } from 'lit-html'

export function renderDetailPanel(): TemplateResult {
  return html`
    <div class="w-80 h-full border-l border-gray-200 bg-white hidden lg:flex flex-col">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-sm font-medium text-gray-500">Task Details</h3>
      </div>
      <div class="flex-1 flex items-center justify-center px-6">
        <p class="text-gray-400 text-sm">Select a task to edit</p>
      </div>
    </div>
  `
}
