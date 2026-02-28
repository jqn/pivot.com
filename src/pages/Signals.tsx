import { useState } from 'react'
import { useWatchlistStore } from '../store/watchlistStore'

const SearchIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: 'var(--neutral-400)' }}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

function formatTriggeredAt(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (isToday) return time
  return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} · ${time}`
}

export default function Signals() {
  const signalLog = useWatchlistStore((s) => s.signalLog)
  const clearSignalLog = useWatchlistStore((s) => s.clearSignalLog)
  const [filter, setFilter] = useState('')
  const [inputFocused, setInputFocused] = useState(false)

  const filteredSignals = signalLog.filter((s) =>
    s.symbol.toLowerCase().includes(filter.toLowerCase().trim())
  )

  const isEmpty = signalLog.length === 0
  const noResults = !isEmpty && filteredSignals.length === 0

  return (
    <div style={{ padding: '36px 40px' }}>
      {/* Heading */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: '32px',
              color: 'var(--white)',
              marginBottom: '4px',
            }}
          >
            Signal History
          </h1>
          <p
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '13px',
              color: 'var(--neutral-600)',
            }}
          >
            {isEmpty
              ? 'Signals will appear here when conditions are met'
              : `${signalLog.length} signal${signalLog.length !== 1 ? 's' : ''} recorded`}
          </p>
        </div>
        {!isEmpty && (
          <button
            onClick={clearSignalLog}
            style={{
              background: 'none',
              border: '1px solid var(--ink-soft)',
              borderRadius: '8px',
              padding: '8px 14px',
              fontFamily: "'Sora', sans-serif",
              fontSize: '13px',
              color: 'var(--neutral-600)',
              cursor: 'pointer',
            }}
          >
            Clear history
          </button>
        )}
      </div>

      {/* Filter row */}
      {!isEmpty && (
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--ink-mid)',
              border: `1px solid ${inputFocused ? 'var(--signal)' : 'var(--ink-soft)'}`,
              borderRadius: '9px',
              padding: '0 14px',
              transition: 'border-color 0.15s',
              boxShadow: inputFocused ? '0 0 0 2px rgba(0,229,160,0.12)' : 'none',
            }}
          >
            <SearchIcon />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Filter by ticker…"
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--white)',
                fontFamily: "'DM Mono', monospace",
                fontSize: '14px',
                padding: '11px 0',
                width: '200px',
              }}
            />
            {filter && (
              <button
                onClick={() => setFilter('')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--neutral-600)',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '16px',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            )}
          </div>
          {filter && (
            <span
              style={{
                marginLeft: '12px',
                fontFamily: "'Sora', sans-serif",
                fontSize: '13px',
                color: 'var(--neutral-600)',
              }}
            >
              {filteredSignals.length} result{filteredSignals.length !== 1 ? 's' : ''} for &ldquo;{filter}&rdquo;
            </span>
          )}
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: 'var(--neutral-600)',
            fontFamily: "'Sora', sans-serif",
            fontSize: '14px',
          }}
        >
          No signals yet — keep the app running and signals will be logged here when your conditions align.
        </div>
      )}

      {/* No filter results */}
      {noResults && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--neutral-600)',
            fontFamily: "'Sora', sans-serif",
            fontSize: '14px',
          }}
        >
          No signals matching &ldquo;{filter}&rdquo;
        </div>
      )}

      {/* Signal cards */}
      {filteredSignals.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredSignals.map((signal) => (
            <div
              key={signal.id}
              style={{
                background: 'var(--white)',
                borderRadius: '14px',
                padding: '24px',
                borderTop: '1px solid var(--neutral-200)',
                borderRight: '1px solid var(--neutral-200)',
                borderBottom: '1px solid var(--neutral-200)',
                borderLeft: '3px solid var(--signal)',
              }}
            >
              {/* Top row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: '22px',
                      color: 'var(--ink)',
                      lineHeight: 1,
                    }}
                  >
                    {signal.symbol}
                  </span>
                  <span
                    style={{
                      background: 'var(--signal)',
                      color: 'var(--ink)',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      padding: '3px 9px',
                      borderRadius: '5px',
                    }}
                  >
                    ⚡ Buy Signal
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '12px',
                    color: 'var(--neutral-400)',
                  }}
                >
                  {formatTriggeredAt(signal.triggeredAt)}
                </span>
              </div>

              {/* Company + price */}
              <div
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: '13px',
                  color: 'var(--neutral-600)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{signal.name}</span>
                <span style={{ color: 'var(--neutral-400)' }}>·</span>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    color: 'var(--ink)',
                    fontWeight: '500',
                  }}
                >
                  ${signal.price.toFixed(2)}
                </span>
              </div>

              {/* Condition pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {signal.conditions.map((cond, i) => (
                  <span
                    key={i}
                    style={{
                      background: 'var(--neutral-100)',
                      color: 'var(--ink-soft)',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '11px',
                      padding: '5px 11px',
                      borderRadius: '6px',
                      border: '1px solid var(--neutral-200)',
                    }}
                  >
                    {cond}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
