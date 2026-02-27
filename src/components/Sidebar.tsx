import { Page } from '../App'

interface NavItem {
  id: Page
  label: string
  icon: React.ReactNode
}

const DashboardIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
)

const WatchlistIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <circle cx="3.5" cy="6" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="3.5" cy="12" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="3.5" cy="18" r="0.5" fill="currentColor" stroke="none" />
  </svg>
)

const SignalsIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const SettingsIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'watchlist', label: 'Watchlist', icon: <WatchlistIcon /> },
  { id: 'signals', label: 'Signals', icon: <SignalsIcon /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
]

interface SidebarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

const PivotLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="9" fill="#00E5A0" />
      <polyline
        points="5,27 10,23 15,25 20,17 29,10"
        stroke="#0B0F1A"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="29" cy="10" r="3" fill="#0B0F1A" />
    </svg>
    <span
      style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: '22px',
        color: 'var(--white)',
        letterSpacing: '-0.01em',
        lineHeight: 1,
      }}
    >
      Pivot
    </span>
  </div>
)

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside
      style={{
        width: '240px',
        minWidth: '240px',
        height: '100vh',
        background: 'var(--ink)',
        borderRight: '1px solid var(--ink-soft)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 24px 20px' }}>
        <PivotLogo />
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--ink-soft)', margin: '0 16px 12px' }} />

      {/* Nav */}
      <nav style={{ flex: 1, padding: '4px 12px' }}>
        {navItems.map((item) => {
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="nav-item"
              style={{
                background: isActive ? 'var(--ink-mid)' : 'transparent',
                color: isActive ? 'var(--white)' : 'var(--neutral-400)',
                fontWeight: isActive ? '500' : '400',
                borderLeft: isActive ? '3px solid var(--signal)' : '3px solid transparent',
                paddingLeft: isActive ? '10px' : '12px',
              }}
            >
              {item.icon}
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* User info */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--ink-soft)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--signal), var(--signal-dim))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--ink)',
            fontFamily: "'DM Serif Display', serif",
            fontSize: '14px',
            fontWeight: '700',
            flexShrink: 0,
          }}
        >
          D
        </div>
        <span
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: '12px',
            color: 'var(--neutral-400)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          demo@pivot.app
        </span>
      </div>
    </aside>
  )
}
