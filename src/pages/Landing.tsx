import { Page } from '../App'

interface LandingProps {
  onNavigate: (page: Page) => void
}

// ─── Logo (reused inline) ───────────────────────────────────────────────────
const LogoMark = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="9" fill="#00E5A0" />
    <g transform="translate(6, 30) scale(0.025)">
      <path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z" fill="#0B0F1A" />
    </g>
  </svg>
)

// ─── Mini app preview ───────────────────────────────────────────────────────
const AppPreview = () => {
  const cards = [
    { sym: 'NVDA', price: '118.24', change: '−2.81%', neg: true, rsi: '28.4', rsiWarn: true, signal: true },
    { sym: 'AAPL', price: '189.43', change: '+1.24%', neg: false, rsi: '52.1', rsiWarn: false, signal: false },
    { sym: 'AMZN', price: '198.72', change: '+0.88%', neg: false, rsi: '29.1', rsiWarn: true, signal: true },
  ]
  return (
    <div
      style={{
        background: 'var(--ink-mid)',
        borderRadius: '14px',
        border: '1px solid var(--ink-soft)',
        overflow: 'hidden',
        boxShadow: '0 48px 96px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
        maxWidth: '720px',
        margin: '0 auto',
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          background: '#141929',
          padding: '11px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          borderBottom: '1px solid var(--ink-soft)',
        }}
      >
        <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#FF5F57', flexShrink: 0 }} />
        <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#FFBD2E', flexShrink: 0 }} />
        <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#28CA41', flexShrink: 0 }} />
        <div
          style={{
            flex: 1,
            marginLeft: '10px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '5px',
            height: '22px',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '10px',
            gap: '6px',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
            pivot.app/dashboard
          </span>
        </div>
      </div>

      {/* App shell */}
      <div style={{ display: 'flex', height: '300px' }}>
        {/* Mini sidebar */}
        <div
          style={{
            width: '130px',
            background: 'var(--ink)',
            borderRight: '1px solid var(--ink-soft)',
            padding: '14px 10px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '18px', paddingLeft: '4px' }}>
            <LogoMark size={22} />
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '14px', color: 'var(--white)' }}>Pivot</span>
          </div>
          {[
            { label: 'Dashboard', active: true },
            { label: 'Watchlist', active: false },
            { label: 'Signals', active: false },
            { label: 'Settings', active: false },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: '7px 8px',
                borderRadius: '6px',
                marginBottom: '2px',
                background: item.active ? 'var(--ink-mid)' : 'transparent',
                borderLeft: item.active ? '2px solid var(--signal)' : '2px solid transparent',
                fontFamily: "'Sora', sans-serif",
                fontSize: '11px',
                color: item.active ? 'var(--white)' : 'var(--neutral-600)',
                fontWeight: item.active ? '500' : '400',
                paddingLeft: item.active ? '6px' : '8px',
              }}
            >
              {item.label}
            </div>
          ))}
        </div>

        {/* Mini dashboard content */}
        <div style={{ flex: 1, padding: '14px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px', overflow: 'hidden' }}>
          {/* Left: watchlist cards */}
          <div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '13px', color: 'var(--white)', marginBottom: '10px' }}>
              My Watchlist
            </div>
            {cards.map((c) => (
              <div
                key={c.sym}
                style={{
                  background: 'var(--ink-mid)',
                  borderRadius: '8px',
                  padding: '9px 11px',
                  marginBottom: '7px',
                  border: c.signal ? '1px solid rgba(0,229,160,0.2)' : '1px solid transparent',
                  position: 'relative',
                }}
              >
                {c.signal && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '7px',
                      right: '8px',
                      background: 'var(--signal)',
                      color: 'var(--ink)',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '7px',
                      padding: '2px 6px',
                      borderRadius: '10px',
                    }}
                  >
                    ⚡ Active
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', paddingRight: c.signal ? '55px' : '0' }}>
                  <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '13px', color: 'var(--white)' }}>{c.sym}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--white)' }}>${c.price}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '9px', color: 'var(--neutral-600)' }}>Corp.</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: c.neg ? 'var(--warn)' : 'var(--signal)' }}>{c.change}</span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <span style={{ background: 'rgba(11,15,26,0.6)', padding: '2px 5px', borderRadius: '3px', fontFamily: "'DM Mono', monospace", fontSize: '8px', color: c.rsiWarn ? 'var(--warn)' : 'var(--neutral-600)' }}>RSI {c.rsi}</span>
                  <span style={{ background: 'rgba(11,15,26,0.6)', padding: '2px 5px', borderRadius: '3px', fontFamily: "'DM Mono', monospace", fontSize: '8px', color: 'var(--neutral-600)' }}>SMA ✓</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: signal card */}
          <div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '13px', color: 'var(--white)', marginBottom: '10px' }}>
              Active Signals
            </div>
            <div
              style={{
                background: 'var(--ink-mid)',
                borderRadius: '8px',
                padding: '11px',
                border: '1px solid rgba(0,229,160,0.15)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ background: 'var(--signal)', color: 'var(--ink)', fontFamily: "'DM Mono', monospace", fontSize: '7px', padding: '2px 6px', borderRadius: '3px', textTransform: 'uppercase' }}>⚡ Buy Signal</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', color: 'var(--neutral-600)' }}>9:32 AM</span>
              </div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '22px', color: 'var(--white)', lineHeight: 1, marginBottom: '4px' }}>NVDA</div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '9px', color: 'var(--neutral-600)', marginBottom: '10px' }}>NVIDIA · $118.24</div>
              {['RSI → 28.4', '50-day MA ✓', 'MACD cross ✓'].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--signal)', flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '9px', color: 'var(--neutral-400)' }}>{c}</span>
                </div>
              ))}
              <div style={{ marginTop: '10px', background: 'var(--signal)', borderRadius: '5px', padding: '6px', textAlign: 'center', fontFamily: "'Sora', sans-serif", fontSize: '9px', fontWeight: '600', color: 'var(--ink)' }}>
                View Details →
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Feature cards ──────────────────────────────────────────────────────────
const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
        <circle cx="3.5" cy="6" r="0.5" fill="currentColor" stroke="none" />
        <circle cx="3.5" cy="12" r="0.5" fill="currentColor" stroke="none" />
        <circle cx="3.5" cy="18" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: 'Smart Watchlist',
    body: 'Track your stocks with live RSI, 50-day MA, and MACD indicators surfaced in one clean view — no spreadsheets required.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: 'Buy Signal Alerts',
    body: 'Get a signal the instant multiple conditions align. Only high-conviction setups make the cut — zero noise, all signal.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    title: 'Configurable Triggers',
    body: 'You control the rules. Mix RSI thresholds, moving average crossovers, and MACD signals — and require all or any to fire.',
  },
]

// ─── Steps ──────────────────────────────────────────────────────────────────
const steps = [
  { num: '01', title: 'Add your stocks', desc: 'Drop any tickers into your watchlist. Pivot begins monitoring immediately.' },
  { num: '02', title: 'Set your conditions', desc: 'Choose which technical conditions must align before a signal fires.' },
  { num: '03', title: 'Act on the signal', desc: 'When conditions converge, Pivot surfaces a clear buy signal — right in your dashboard.' },
]

// ─── Main component ──────────────────────────────────────────────────────────
export default function Landing({ onNavigate }: LandingProps) {
  return (
    <div
      style={{
        background: 'var(--ink)',
        minHeight: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        color: 'var(--white)',
      }}
    >
      {/* ── Navbar ── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(11,15,26,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(46,58,80,0.6)',
          padding: '0 48px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <LogoMark size={32} />
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '20px', color: 'var(--white)', letterSpacing: '-0.01em' }}>
            Pivot
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => onNavigate('signals')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--neutral-400)',
              fontFamily: "'Sora', sans-serif",
              fontSize: '14px',
              cursor: 'pointer',
              padding: '8px 12px',
            }}
          >
            Signal History
          </button>
          <button
            onClick={() => onNavigate('settings')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--neutral-400)',
              fontFamily: "'Sora', sans-serif",
              fontSize: '14px',
              cursor: 'pointer',
              padding: '8px 12px',
            }}
          >
            Settings
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="signal-btn"
            style={{
              background: 'var(--signal)',
              color: 'var(--ink)',
              border: 'none',
              borderRadius: '8px',
              padding: '9px 20px',
              fontFamily: "'Sora', sans-serif",
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Launch App →
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,229,160,0.12) 0%, transparent 60%)',
          padding: '96px 48px 80px',
          textAlign: 'center',
          maxWidth: '960px',
          margin: '0 auto',
        }}
      >
        {/* Tag chip */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            background: 'rgba(0,229,160,0.08)',
            border: '1px solid rgba(0,229,160,0.25)',
            borderRadius: '20px',
            padding: '6px 14px',
            marginBottom: '32px',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--signal)' }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: 'var(--signal)', letterSpacing: '0.04em' }}>
            Built for active traders
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(40px, 6vw, 68px)',
            lineHeight: 1.08,
            color: 'var(--white)',
            marginBottom: '24px',
            letterSpacing: '-0.02em',
          }}
        >
          Know exactly<br />
          <span style={{ color: 'var(--signal)' }}>when to buy.</span>
        </h1>

        {/* Sub */}
        <p
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: '18px',
            color: 'var(--neutral-400)',
            lineHeight: 1.7,
            maxWidth: '560px',
            margin: '0 auto 40px',
          }}
        >
          Pivot monitors your watchlist and fires a buy signal the moment RSI,
          moving averages, and MACD align — so you never miss the setup again.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '72px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate('dashboard')}
            className="signal-btn"
            style={{
              background: 'var(--signal)',
              color: 'var(--ink)',
              border: 'none',
              borderRadius: '10px',
              padding: '14px 32px',
              fontFamily: "'Sora', sans-serif",
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              letterSpacing: '0.01em',
            }}
          >
            Launch App — it's free →
          </button>
          <button
            onClick={() => {
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{
              background: 'none',
              border: '1px solid var(--ink-soft)',
              color: 'var(--neutral-400)',
              borderRadius: '10px',
              padding: '14px 28px',
              fontFamily: "'Sora', sans-serif",
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            See how it works
          </button>
        </div>

        {/* App preview */}
        <AppPreview />
      </section>

      {/* ── Stats bar ── */}
      <section
        style={{
          borderTop: '1px solid var(--ink-soft)',
          borderBottom: '1px solid var(--ink-soft)',
          background: 'var(--ink-mid)',
          padding: '32px 48px',
        }}
      >
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            textAlign: 'center',
          }}
        >
          {[
            { value: '3', label: 'Technical indicators monitored' },
            { value: '< 1s', label: 'Signal detection latency' },
            { value: '100%', label: 'Configurable by you' },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                padding: '8px 16px',
                borderRight: i < 2 ? '1px solid var(--ink-soft)' : 'none',
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: '38px',
                  color: 'var(--signal)',
                  lineHeight: 1.1,
                  marginBottom: '4px',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: '13px',
                  color: 'var(--neutral-600)',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section
        style={{
          padding: '96px 48px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '12px',
              color: 'var(--signal)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Features
          </div>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(28px, 4vw, 44px)',
              color: 'var(--white)',
              letterSpacing: '-0.02em',
              marginBottom: '14px',
            }}
          >
            Everything you need.<br />Nothing you don't.
          </h2>
          <p
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '16px',
              color: 'var(--neutral-600)',
              maxWidth: '480px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            A focused toolkit built around the indicators that matter most to swing and momentum traders.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                background: 'var(--ink-mid)',
                borderRadius: '18px',
                padding: '32px 28px',
                border: '1px solid var(--ink-soft)',
                transition: 'border-color 0.2s',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(0,229,160,0.1)',
                  border: '1px solid rgba(0,229,160,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--signal)',
                  marginBottom: '20px',
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: '22px',
                  color: 'var(--white)',
                  marginBottom: '10px',
                  letterSpacing: '-0.01em',
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: '14px',
                  color: 'var(--neutral-600)',
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        id="how-it-works"
        style={{
          background: 'var(--ink-mid)',
          borderTop: '1px solid var(--ink-soft)',
          borderBottom: '1px solid var(--ink-soft)',
          padding: '96px 48px',
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '12px',
                color: 'var(--signal)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              How it works
            </div>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 'clamp(28px, 4vw, 44px)',
                color: 'var(--white)',
                letterSpacing: '-0.02em',
              }}
            >
              Three steps to your first signal.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', position: 'relative' }}>
            {/* Connecting line */}
            <div
              style={{
                position: 'absolute',
                top: '28px',
                left: 'calc(16.67% + 28px)',
                right: 'calc(16.67% + 28px)',
                height: '1px',
                background: 'linear-gradient(90deg, var(--signal), rgba(0,229,160,0.3))',
              }}
            />

            {steps.map((step, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '0 28px' }}>
                {/* Step number circle */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: i === 0 ? 'var(--signal)' : 'var(--ink)',
                    border: `2px solid ${i === 0 ? 'var(--signal)' : 'var(--ink-soft)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 28px',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '14px',
                      fontWeight: '500',
                      color: i === 0 ? 'var(--ink)' : 'var(--neutral-400)',
                    }}
                  >
                    {step.num}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: '20px',
                    color: 'var(--white)',
                    marginBottom: '10px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: '14px',
                    color: 'var(--neutral-600)',
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        style={{
          padding: '100px 48px',
          textAlign: 'center',
          background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(0,229,160,0.08) 0%, transparent 70%)',
        }}
      >
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(28px, 4vw, 48px)',
            color: 'var(--white)',
            marginBottom: '16px',
            letterSpacing: '-0.02em',
          }}
        >
          Ready to spot your next setup?
        </h2>
        <p
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: '16px',
            color: 'var(--neutral-600)',
            marginBottom: '36px',
            maxWidth: '420px',
            margin: '0 auto 36px',
            lineHeight: 1.65,
          }}
        >
          Start watching your stocks and let Pivot tell you when to move.
        </p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="signal-btn"
          style={{
            background: 'var(--signal)',
            color: 'var(--ink)',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 40px',
            fontFamily: "'Sora', sans-serif",
            fontSize: '17px',
            fontWeight: '700',
            cursor: 'pointer',
            letterSpacing: '0.01em',
          }}
        >
          Open Pivot →
        </button>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: '1px solid var(--ink-soft)',
          padding: '32px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <LogoMark size={24} />
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '16px', color: 'var(--white)' }}>Pivot</span>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {(['dashboard', 'watchlist', 'signals', 'settings'] as Page[]).map((p) => (
            <button
              key={p}
              onClick={() => onNavigate(p)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--neutral-600)',
                fontFamily: "'Sora', sans-serif",
                fontSize: '13px',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {(p as string).charAt(0).toUpperCase() + (p as string).slice(1)}
            </button>
          ))}
        </div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: 'var(--neutral-600)' }}>
          © 2026 Pivot · UI Demo
        </span>
      </footer>
    </div>
  )
}
