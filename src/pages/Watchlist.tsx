import { useState, useEffect, useRef } from 'react'
import { WatchlistItem } from '../data/mockData'
import { useWatchlistStore } from '../store/watchlistStore'
import { searchSymbols, SearchResult } from '../lib/finnhub'

const TrashIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)


export default function Watchlist() {
  const { stocks, loading, addSymbol, removeSymbol } = useWatchlistStore()
  const stockList = Object.values(stocks)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const data = await searchSymbols(query)
        setResults(data)
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [query])

  function handleSelect(symbol: string) {
    setQuery(symbol)
    setResults([])
    inputRef.current?.focus()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const sym = query.trim().toUpperCase()
    if (!sym) return
    addSymbol(sym)
    setQuery('')
    setResults([])
  }

  function handleRemove(symbol: string) {
    removeSymbol(symbol)
  }

  const showDropdown = inputFocused && (results.length > 0 || searching)

  const columns = ['Ticker', 'Company', 'Price', 'Change', 'RSI', '50-day MA', 'MACD', '']

  return (
    <div style={{ padding: '36px 40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: '32px',
              color: 'var(--white)',
              marginBottom: '4px',
            }}
          >
            My Watchlist
          </h1>
          <p
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '13px',
              color: 'var(--neutral-600)',
            }}
          >
            {loading ? 'Loading…' : `${stockList.length} stocks tracked`}
          </p>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: 'var(--ink-mid)',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid var(--ink-soft)',
          marginBottom: '24px',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--ink-soft)' }}>
              {columns.map((col, i) => (
                <th
                  key={i}
                  style={{
                    padding: '14px 18px',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--neutral-100)',
                    fontWeight: '500',
                    textAlign: i === columns.length - 1 ? 'center' : 'left',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stockList.map((stock, i) => (
              <tr
                key={`${stock.symbol}-${i}`}
                className={i % 2 === 0 ? 'table-row-even' : 'table-row-odd'}
                style={{
                  borderBottom:
                    i < stockList.length - 1 ? '1px solid rgba(46,58,80,0.4)' : 'none',
                  transition: 'background 0.1s',
                }}
              >
                {/* Ticker */}
                <td style={{ padding: '13px 18px' }}>
                  <span
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: '16px',
                      color: 'var(--white)',
                    }}
                  >
                    {stock.symbol}
                  </span>
                </td>

                {/* Company */}
                <td style={{ padding: '13px 18px' }}>
                  <span
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: '13px',
                      color: 'var(--neutral-400)',
                    }}
                  >
                    {stock.name}
                  </span>
                </td>

                {/* Price */}
                <td style={{ padding: '13px 18px' }}>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '14px',
                      color: 'var(--white)',
                    }}
                  >
                    ${stock.price.toFixed(2)}
                  </span>
                </td>

                {/* Change */}
                <td style={{ padding: '13px 18px' }}>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '14px',
                      color: stock.changePercent >= 0 ? 'var(--signal)' : 'var(--warn)',
                      fontWeight: '500',
                    }}
                  >
                    {stock.changePercent >= 0 ? '+' : '\u2212'}
                    {Math.abs(stock.changePercent).toFixed(2)}%
                  </span>
                </td>

                {/* RSI */}
                <td style={{ padding: '13px 18px' }}>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '14px',
                      color: stock.rsi < 30 ? 'var(--warn)' : 'var(--neutral-400)',
                      fontWeight: stock.rsi < 30 ? '500' : '400',
                    }}
                  >
                    {stock.rsi.toFixed(1)}
                  </span>
                </td>

                {/* 50-day MA */}
                <td style={{ padding: '13px 18px' }}>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '13px',
                      color: stock.smaAbove ? 'var(--signal)' : 'var(--neutral-600)',
                    }}
                  >
                    {stock.smaAbove ? 'Above ✓' : 'Below ✗'}
                  </span>
                </td>

                {/* MACD */}
                <td style={{ padding: '13px 18px' }}>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '13px',
                      color: stock.macdCross ? 'var(--signal)' : 'var(--neutral-600)',
                    }}
                  >
                    {stock.macdCross ? 'Cross ✓' : 'None ✗'}
                  </span>
                </td>

                {/* Remove */}
                <td style={{ padding: '13px 18px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleRemove(stock.symbol)}
                    className="trash-btn"
                    title={`Remove ${stock.symbol}`}
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Stock Form */}
      <div
        style={{
          background: 'var(--ink-mid)',
          borderRadius: '14px',
          padding: '20px 24px',
          border: '1px solid var(--ink-soft)',
        }}
      >
        <p
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: '13px',
            color: 'var(--neutral-400)',
            marginBottom: '14px',
            fontWeight: '500',
          }}
        >
          Add a stock to your watchlist
        </p>
        <form onSubmit={handleSubmit} style={{ position: 'relative', maxWidth: '480px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              ref={inputRef}
              id="add-stock-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Search ticker or company name…"
              autoComplete="off"
              style={{
                flex: 1,
                padding: '11px 16px',
                background: 'var(--ink)',
                border: `1px solid ${inputFocused ? 'var(--signal)' : 'var(--ink-soft)'}`,
                borderRadius: '9px',
                color: 'var(--white)',
                fontFamily: "'Sora', sans-serif",
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.15s',
                boxShadow: inputFocused ? '0 0 0 2px rgba(0,229,160,0.12)' : 'none',
              }}
            />
            <button
              type="submit"
              className="signal-btn"
              style={{
                padding: '11px 22px',
                background: 'var(--signal)',
                color: 'var(--ink)',
                border: 'none',
                borderRadius: '9px',
                fontFamily: "'Sora', sans-serif",
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              + Add
            </button>
          </div>

          {/* Search dropdown */}
          {showDropdown && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                right: '90px',
                background: 'var(--ink-mid)',
                border: '1px solid var(--ink-soft)',
                borderRadius: '10px',
                overflow: 'hidden',
                zIndex: 50,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}
            >
              {searching && (
                <div
                  style={{
                    padding: '12px 16px',
                    fontFamily: "'Sora', sans-serif",
                    fontSize: '13px',
                    color: 'var(--neutral-600)',
                  }}
                >
                  Searching…
                </div>
              )}
              {!searching && results.map((r) => (
                <button
                  key={r.symbol}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(r.symbol) }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '11px 16px',
                    background: 'none',
                    border: 'none',
                    borderBottom: '1px solid rgba(46,58,80,0.4)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  className="search-result-row"
                >
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '13px',
                      color: 'var(--signal)',
                      minWidth: '52px',
                    }}
                  >
                    {r.symbol}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: '13px',
                      color: 'var(--neutral-400)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {r.description}
                  </span>
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

    </div>
  )
}
