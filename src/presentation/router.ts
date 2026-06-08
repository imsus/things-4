export type Route = {
  pattern: RegExp
  params: string[]
}

export type RouterListener = (route: Route) => void

export class Router {
  private routes: Array<{ pattern: RegExp; paramNames: string[] }> = []
  private listeners: RouterListener[] = []

  addRoute(pattern: string, paramNames: string[] = []) {
    const regex = pattern.replace(/:(\w+)/g, (_, name) => {
      paramNames.push(name)
      return '([^/]+)'
    })
    this.routes.push({ pattern: new RegExp(`^${regex}$`), paramNames })
  }

  listen(callback: RouterListener) {
    this.listeners.push(callback)
    window.addEventListener('hashchange', () => this.resolve())
    this.resolve()
  }

  navigate(path: string) {
    window.location.hash = path
  }

  resolve() {
    const hash = window.location.hash.slice(1) || '/inbox'
    for (const route of this.routes) {
      const match = hash.match(route.pattern)
      if (match) {
        const params: Record<string, string> = {}
        route.paramNames.forEach((name, i) => {
          params[name] = match[i + 1]!
        })
        this.listeners.forEach(cb => cb({ pattern: route.pattern, params: Object.keys(params).length ? params as unknown as string[] : [] }))
        return
      }
    }
  }

  getCurrentPath(): string {
    return window.location.hash.slice(1) || '/inbox'
  }
}
