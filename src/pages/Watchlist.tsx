import { useState } from 'react'
import { mockWatchlist, WatchlistItem } from '../data/mockData'

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

const PlusIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

export default function Watchlist() {
  const [stocks, setStocks] = useState<WatchlistItem[]>(mockWatchlist)
  const [newTicker, setNewTicker] = useState('')
  const [inputFocused, setInputFocused] = useState(false)

  function handleAddStock(e: React.FormEvent) {
    e.preventDefault()
    const sym = newTicker.trim().toUpperCase()
    if (!sym) return
    const newStock: WatchlistItem = {
      symbol: sym,
      name: `${sym} Corporation`,
      price: Math.round((Math.random() * 400 + 20) * 100) / 100,
      changePercent: Math.round((Math.random() * 10 - 5) * 100) / 100,
      rsi: Math.round((Math.random() * 50 + 25) * 10) / 10,
      smaAbove: Math.random() > 0.5,
      macdCross: Math.random() > 0.5,
      signalActive: false,
    }
    setStocks((prev) => [...prev, newStock])
    setNewTicker('')
  }

  function handleRemove(symbol: string) {
    setStocks((prev) => prev.filter((s) => s.symbol !== symbol))
  }

  const columns = ['Ticker', 'Company', 'Price', 'Change', 'RSI', '50-day MA', 'MACD', '']

  return (
    <div style={{ padding: '36px 40px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
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
            My Watchlist
          </h1>
          <p
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '13px',
              color: 'var(--neutral-600)',
            }}
          >
            {stocks.length} stocks tracked
          </p>
        </div>
        <button
          onClick={() => {
            const input = document.getElementById('add-stock-input')
            input?.focus()
          }}
          className="signal-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            background: 'var(--signal)',
            color: 'var(--ink)',
            border: 'none',
            borderRadius: '9px',
            padding: '10px 18px',
            fontFamily: "'Sora', sans-serif",
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          <PlusIcon />
          Add Stock
        </button>
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
            {stocks.map((stock, i) => (
              <tr
                key={`${stock.symbol}-${i}`}
                className={i % 2 === 0 ? 'table-row-even' : 'table-row-odd'}
                style={{
                  borderBottom:
                    i < stocks.length - 1 ? '1px solid rgba(46,58,80,0.4)' : 'none',
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
        <form onSubmit={handleAddStock} style={{ display: 'flex', gap: '12px', maxWidth: '480px' }}>
          <input
            id="add-stock-input"
            type="text"
            value={newTicker}
            onChange={(e) => setNewTicker(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="Enter ticker e.g. AAPL"
            maxLength={6}
            style={{
              flex: 1,
              padding: '11px 16px',
              background: 'var(--ink)',
              border: `1px solid ${inputFocused ? 'var(--signal)' : 'var(--ink-soft)'}`,
              borderRadius: '9px',
              color: 'var(--white)',
              fontFamily: "'DM Mono', monospace",
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
            + Add Stock
          </button>
        </form>
      </div>
    </div>
  )
}
