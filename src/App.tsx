import { useState, useEffect } from 'react'
import { Toaster } from 'sonner'
import Sidebar from './components/Sidebar'
import { useWatchlistStore } from './store/watchlistStore'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Watchlist from './pages/Watchlist'
import Signals from './pages/Signals'
import Settings from './pages/Settings'
import BrandKit from './pages/BrandKit'

export type Page = 'landing' | 'dashboard' | 'watchlist' | 'signals' | 'settings' | 'brand-kit'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing')
  const startPolling = useWatchlistStore((s) => s.startPolling)
  const stopPolling = useWatchlistStore((s) => s.stopPolling)

  useEffect(() => {
    startPolling()
    return () => stopPolling()
  }, [startPolling, stopPolling])

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Landing page: full-width, no sidebar
  if (currentPage === 'landing') {
    return (
      <>
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: 'var(--ink-mid)',
              border: '1px solid rgba(0,229,160,0.25)',
              color: 'var(--white)',
              fontFamily: "'Sora', sans-serif",
              fontSize: '13px',
            },
          }}
        />
        <Landing onNavigate={setCurrentPage} />
      </>
    )
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
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: 'var(--ink-mid)',
            border: '1px solid rgba(0,229,160,0.25)',
            color: 'var(--white)',
            fontFamily: "'Sora', sans-serif",
            fontSize: '13px',
          },
        }}
      />
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
