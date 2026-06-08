import { html, TemplateResult } from 'lit-html'

export function renderSearch(
  query: string,
  onSearch: (query: string) => void,
): TemplateResult {
  return html`
    <div class="px-4 py-2">
      <input
        type="text"
        placeholder="Search tasks..."
        class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        .value=${query}
        @input=${(e: Event) => onSearch((e.target as HTMLInputElement).value)}
      />
    </div>
  `
}
