import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Watchlist from './pages/Watchlist'
import Signals from './pages/Signals'
import Settings from './pages/Settings'

export type Page = 'dashboard' | 'watchlist' | 'signals' | 'settings'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: 'var(--ink)',
      }}
    >
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          background: 'var(--ink)',
        }}
      >
        {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} />}
        {currentPage === 'watchlist' && <Watchlist />}
        {currentPage === 'signals' && <Signals />}
        {currentPage === 'settings' && <Settings />}
      </main>
    </div>
  )
}
