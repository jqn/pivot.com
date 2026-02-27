import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Watchlist from './pages/Watchlist'
import Signals from './pages/Signals'
import Settings from './pages/Settings'
import BrandKit from './pages/BrandKit'

export type Page = 'landing' | 'dashboard' | 'watchlist' | 'signals' | 'settings' | 'brand-kit'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing')

  // Landing page: full-width, no sidebar
  if (currentPage === 'landing') {
    return <Landing onNavigate={setCurrentPage} />
  }

  // App pages: sidebar + content layout
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
        {currentPage === 'settings' && <Settings onNavigate={setCurrentPage} />}
        {currentPage === 'brand-kit' && <BrandKit onNavigate={setCurrentPage} />}
      </main>
    </div>
  )
}
