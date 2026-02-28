import { useState, useEffect } from 'react'
import { WatchlistItem, SignalItem } from '../data/mockData'
import { useWatchlistStore } from '../store/watchlistStore'
import { getMarketNews, NewsItem, getRecommendations, Recommendation } from '../lib/finnhub'
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
  const stocks = useWatchlistStore((s) => s.stocks)
  const loading = useWatchlistStore((s) => s.loading)
  const error = useWatchlistStore((s) => s.error)
  const stockList = Object.values(stocks)
  const [news, setNews] = useState<NewsItem[]>([])
  const [recommendations, setRecommendations] = useState<Record<string, Recommendation>>({})

  useEffect(() => {
    getMarketNews().then((items) => setNews(items.slice(0, 8))).catch(() => {})
  }, [])

  useEffect(() => {
    if (!stockList.length) return
    Promise.allSettled(
      stockList.map((s) => getRecommendations(s.symbol).then((data) => ({ symbol: s.symbol, data })))
    ).then((results) => {
      const map: Record<string, Recommendation> = {}
      results.forEach((r) => {
        if (r.status === 'fulfilled' && r.value.data.length) {
          map[r.value.symbol] = r.value.data[0]
        }
      })
      setRecommendations(map)
    })
  }, [stockList.length])
  const activeSignals: SignalItem[] = stockList
    .filter((s) => s.signalActive)
    .map((s) => ({
      id: s.symbol,
      symbol: s.symbol,
      name: s.name,
      price: s.price,
      triggeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      conditions: [
        s.rsi < 30 ? `RSI dropped below 30 → ${s.rsi.toFixed(1)}` : null,
        s.smaAbove ? 'Price crossed above 50-day MA' : null,
        s.macdCross ? 'MACD bullish crossover' : null,
      ].filter(Boolean) as string[],
    }))

  if (error) {
    return (
      <div style={{ padding: '36px 40px' }}>
        <div
          style={{
            background: 'rgba(255,107,53,0.1)',
            border: '1px solid rgba(255,107,53,0.3)',
            borderRadius: '12px',
            padding: '20px 24px',
            fontFamily: "'DM Mono', monospace",
            fontSize: '13px',
            color: 'var(--warn)',
          }}
        >
          Failed to load market data: {error}
        </div>
      </div>
    )
  }

  if (loading && stockList.length === 0) {
    return (
      <div
        style={{
          padding: '36px 40px',
          color: 'var(--neutral-600)',
          fontFamily: "'Sora', sans-serif",
          fontSize: '14px',
        }}
      >
        Loading market data…
      </div>
    )
  }

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
              {stockList.length} stocks tracked
            </p>
          </div>
          <div>
            {stockList.map((stock) => (
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

      {/* Recommendation Trends */}
      {Object.keys(recommendations).length > 0 && (
        <div style={{ marginTop: '48px' }}>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: '28px',
              color: 'var(--white)',
              marginBottom: '6px',
            }}
          >
            Analyst Recommendations
          </h2>
          <p
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '13px',
              color: 'var(--neutral-600)',
              marginBottom: '24px',
            }}
          >
            Most recent analyst consensus for watched stocks
          </p>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {[
              { label: 'Strong Buy', color: '#00e5a0' },
              { label: 'Buy',        color: '#5de8c1' },
              { label: 'Hold',       color: '#4a5568' },
              { label: 'Sell',       color: '#f97316' },
              { label: 'Strong Sell',color: '#ff6b35' },
            ].map(({ label, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: color, flexShrink: 0 }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--neutral-400)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              background: 'var(--ink-mid)',
              borderRadius: '14px',
              border: '1px solid var(--ink-soft)',
              overflow: 'hidden',
            }}
          >
            {stockList
              .filter((s) => recommendations[s.symbol])
              .map((s, i, arr) => {
                const rec = recommendations[s.symbol]
                const total = rec.strongBuy + rec.buy + rec.hold + rec.sell + rec.strongSell
                if (total === 0) return null
                const pct = (n: number) => `${((n / total) * 100).toFixed(1)}%`
                const segments = [
                  { key: 'strongBuy', value: rec.strongBuy, color: '#00e5a0' },
                  { key: 'buy',       value: rec.buy,       color: '#5de8c1' },
                  { key: 'hold',      value: rec.hold,      color: '#4a5568' },
                  { key: 'sell',      value: rec.sell,      color: '#f97316' },
                  { key: 'strongSell',value: rec.strongSell,color: '#ff6b35' },
                ]
                return (
                  <div
                    key={s.symbol}
                    style={{
                      padding: '16px 20px',
                      borderBottom: i < arr.length - 1 ? '1px solid rgba(46,58,80,0.4)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {/* Symbol */}
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: '13px',
                          color: 'var(--white)',
                          width: '52px',
                          flexShrink: 0,
                        }}
                      >
                        {s.symbol}
                      </span>

                      {/* Stacked bar */}
                      <div
                        style={{
                          flex: 1,
                          height: '20px',
                          borderRadius: '5px',
                          overflow: 'hidden',
                          display: 'flex',
                        }}
                        title={`Strong Buy: ${rec.strongBuy} · Buy: ${rec.buy} · Hold: ${rec.hold} · Sell: ${rec.sell} · Strong Sell: ${rec.strongSell}`}
                      >
                        {segments.filter((seg) => seg.value > 0).map((seg) => (
                          <div
                            key={seg.key}
                            style={{
                              width: pct(seg.value),
                              background: seg.color,
                              transition: 'width 0.4s ease',
                            }}
                          />
                        ))}
                      </div>

                      {/* Total analysts */}
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: '11px',
                          color: 'var(--neutral-600)',
                          width: '48px',
                          textAlign: 'right',
                          flexShrink: 0,
                        }}
                      >
                        {total} analysts
                      </span>
                    </div>

                    {/* Period */}
                    <div
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '10px',
                        color: 'var(--neutral-600)',
                        marginTop: '6px',
                        paddingLeft: '68px',
                      }}
                    >
                      {new Date(rec.period).toLocaleDateString([], { month: 'long', year: 'numeric' })}
                      {rec.strongBuy > 0 && ` · ${pct(rec.strongBuy + rec.buy)} bullish`}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Market News */}
      {news.length > 0 && (
        <div style={{ marginTop: '48px' }}>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: '28px',
              color: 'var(--white)',
              marginBottom: '16px',
            }}
          >
            Market News
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--ink-soft)', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--ink-soft)' }}>
            {news.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '16px 20px',
                  background: 'var(--ink-mid)',
                  textDecoration: 'none',
                  transition: 'background 0.1s',
                }}
                className="news-row"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt=""
                    style={{
                      width: '64px',
                      height: '48px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      flexShrink: 0,
                    }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: '14px',
                      color: 'var(--white)',
                      fontWeight: '500',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.headline}
                  </p>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--signal)' }}>
                      {item.source}
                    </span>
                    <span style={{ color: 'var(--ink-soft)', fontSize: '10px' }}>·</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--neutral-600)' }}>
                      {new Date(item.datetime * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
