import { render, html } from 'lit-html'
import { Router } from './presentation/router'
import { renderSidebar } from './presentation/views/sidebar'
import { renderContent } from './presentation/views/content'
import { renderDetailPanel } from './presentation/views/detail-panel'
import './styles.css'

const app = document.getElementById('app')!
const router = new Router()

router.addRoute('/inbox')
router.addRoute('/today')
router.addRoute('/upcoming')
router.addRoute('/anytime')
router.addRoute('/someday')
router.addRoute('/logbook')
router.addRoute('/projects/:id', ['id'])
router.addRoute('/tags/:id', ['id'])

router.listen(() => {
  const currentPath = window.location.hash.slice(1) || '/inbox'
  renderApp(currentPath)
})

function renderApp(currentPath: string) {
  render(html`
    <div class="flex h-screen bg-white">
      ${renderSidebar(currentPath)}
      ${renderContent(currentPath)}
      ${renderDetailPanel()}
    </div>
  `, app)
}
