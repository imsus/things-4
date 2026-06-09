import { html, TemplateResult } from 'lit-html'

export function renderSearch(
  query: string,
  onSearch: (query: string) => void,
): TemplateResult {
  return html`
    <div class="px-8 pt-2 pb-0">
      <div class="relative">
        <svg class="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-things-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Search"
          class="w-full pl-6 py-1 text-[13px] bg-transparent border-0 border-b border-transparent focus:outline-none focus:border-[var(--color-things-divider)] placeholder:text-[var(--color-things-muted)]"
          .value=${query}
          @input=${(e: Event) => onSearch((e.target as HTMLInputElement).value)}
        />
      </div>
    </div>
  `
}
