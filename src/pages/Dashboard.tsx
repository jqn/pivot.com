import { mockWatchlist, mockSignals, WatchlistItem, SignalItem } from '../data/mockData'
import { Page } from '../App'

function formatChange(change: number): string {
  if (change >= 0) return `+${change.toFixed(2)}%`
  return `\u2212${Math.abs(change).toFixed(2)}%`
}

function WatchlistCard({ stock }: { stock: WatchlistItem }) {
  const changeColor = stock.changePercent >= 0 ? 'var(--signal)' : 'var(--warn)'
  const rsiColor = stock.rsi < 30 ? 'var(--warn)' : 'var(--neutral-400)'

  return (
    <div
      style={{
        background: 'var(--ink-mid)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '12px',
        position: 'relative',
        border: stock.signalActive ? '1px solid rgba(0,229,160,0.2)' : '1px solid transparent',
      }}
    >
      {/* Signal Active badge — absolutely positioned top-right */}
      {stock.signalActive && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'var(--signal)',
            color: 'var(--ink)',
            padding: '4px 10px',
            borderRadius: '20px',
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
          }}
        >
          ⚡ Signal Active
        </div>
      )}

      {/* Row 1: Ticker | Price */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '4px',
          paddingRight: stock.signalActive ? '140px' : '0',
        }}
      >
        <span
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '22px',
            color: 'var(--white)',
            lineHeight: 1.1,
          }}
        >
          {stock.symbol}
        </span>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '17px',
            color: 'var(--white)',
            letterSpacing: '-0.01em',
          }}
        >
          ${stock.price.toFixed(2)}
        </span>
      </div>

      {/* Row 2: Company name | % change */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <span
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: '12px',
            color: 'var(--neutral-400)',
          }}
        >
          {stock.name}
        </span>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '13px',
            color: changeColor,
            fontWeight: '500',
          }}
        >
          {formatChange(stock.changePercent)}
        </span>
      </div>

      {/* Indicator badges */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            color: rsiColor,
            background: 'rgba(11,15,26,0.6)',
            padding: '4px 9px',
            borderRadius: '6px',
            border: stock.rsi < 30 ? '1px solid rgba(255,107,53,0.3)' : '1px solid rgba(46,58,80,0.5)',
          }}
        >
          RSI {stock.rsi.toFixed(1)}
        </span>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            color: stock.smaAbove ? 'var(--neutral-400)' : 'var(--neutral-600)',
            background: 'rgba(11,15,26,0.6)',
            padding: '4px 9px',
            borderRadius: '6px',
            border: '1px solid rgba(46,58,80,0.5)',
          }}
        >
          SMA {stock.smaAbove ? '✓' : '✗'}
        </span>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            color: stock.macdCross ? 'var(--neutral-400)' : 'var(--neutral-600)',
            background: 'rgba(11,15,26,0.6)',
            padding: '4px 9px',
            borderRadius: '6px',
            border: '1px solid rgba(46,58,80,0.5)',
          }}
        >
          MACD {stock.macdCross ? '✓' : '✗'}
        </span>
      </div>
    </div>
  )
}

function SignalCard({ signal, onViewDetails }: { signal: SignalItem; onViewDetails: () => void }) {
  return (
    <div
      style={{
        background: 'var(--ink-mid)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '16px',
        border: '1px solid rgba(0,229,160,0.15)',
      }}
    >
      {/* Top: badge + timestamp */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <span
          style={{
            background: 'var(--signal)',
            color: 'var(--ink)',
            fontFamily: "'DM Mono', monospace",
            fontSize: '10px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '4px 10px',
            borderRadius: '6px',
          }}
        >
          ⚡ Buy Signal
        </span>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '12px',
            color: 'var(--neutral-400)',
          }}
        >
          {signal.triggeredAt}
        </span>
      </div>

      {/* Ticker */}
      <div
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: '36px',
          color: 'var(--white)',
          lineHeight: 1,
          marginBottom: '6px',
          letterSpacing: '-0.01em',
        }}
      >
        {signal.symbol}
      </div>

      {/* Company + price */}
      <div
        style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: '13px',
          color: 'var(--neutral-400)',
          marginBottom: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span>{signal.name}</span>
        <span style={{ color: 'var(--ink-soft)' }}>·</span>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            color: 'var(--white)',
          }}
        >
          ${signal.price.toFixed(2)}
        </span>
      </div>

      {/* Conditions */}
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px' }}>
        {signal.conditions.map((cond, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: "'Sora', sans-serif",
              fontSize: '13px',
              color: 'var(--neutral-200)',
              marginBottom: i < signal.conditions.length - 1 ? '8px' : '0',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--signal)',
                flexShrink: 0,
              }}
            />
            {cond}
          </li>
        ))}
      </ul>

      {/* CTA button */}
      <button
        onClick={onViewDetails}
        className="signal-btn"
        style={{
          width: '100%',
          padding: '12px',
          background: 'var(--signal)',
          color: 'var(--ink)',
          border: 'none',
          borderRadius: '10px',
          fontFamily: "'Sora', sans-serif",
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          letterSpacing: '0.01em',
        }}
      >
        View Details →
      </button>
    </div>
  )
}

interface DashboardProps {
  onNavigate: (page: Page) => void
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const activeSymbols = new Set(
    mockWatchlist.filter((w) => w.signalActive).map((w) => w.symbol)
  )
  const activeSignals = mockSignals.filter((s) => activeSymbols.has(s.symbol))

  return (
    <div style={{ padding: '36px 40px', minHeight: '100%' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '3fr 2fr',
          gap: '36px',
          alignItems: 'start',
        }}
      >
        {/* LEFT — Watchlist */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '28px',
                color: 'var(--white)',
                marginBottom: '4px',
              }}
            >
              My Watchlist
            </h2>
            <p
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: '13px',
                color: 'var(--neutral-600)',
              }}
            >
              {mockWatchlist.length} stocks tracked
            </p>
          </div>
          <div>
            {mockWatchlist.map((stock) => (
              <WatchlistCard key={stock.symbol} stock={stock} />
            ))}
          </div>
        </div>

        {/* RIGHT — Active Signals */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '28px',
                color: 'var(--white)',
                marginBottom: '4px',
              }}
            >
              Active Signals
            </h2>
            <p
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: '13px',
                color: 'var(--neutral-600)',
              }}
            >
              {activeSignals.length} buy signals triggered
            </p>
          </div>
          <div>
            {activeSignals.map((signal) => (
              <SignalCard
                key={signal.id}
                signal={signal}
                onViewDetails={() => onNavigate('signals')}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
