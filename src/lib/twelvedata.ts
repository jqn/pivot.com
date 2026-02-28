const BASE = 'https://api.twelvedata.com'
const TOKEN = import.meta.env.VITE_TWELVE_DATA_API_KEY

if (!TOKEN) {
  console.error(
    '[TwelveData] VITE_TWELVE_DATA_API_KEY is not set.\n' +
    'Add it to .env.local, then restart the dev server.'
  )
}

// Cache daily closes for 4 hours — candles don't change during a trading session
const CACHE_TTL_MS = 4 * 60 * 60 * 1000

interface CacheEntry {
  closes: number[]
  timestamp: number
}

function readCache(symbol: string): number[] | null {
  try {
    const raw = localStorage.getItem(`td-ts-${symbol}`)
    if (!raw) return null
    const entry: CacheEntry = JSON.parse(raw)
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(`td-ts-${symbol}`)
      return null
    }
    return entry.closes
  } catch {
    return null
  }
}

function writeCache(symbol: string, closes: number[]): void {
  try {
    localStorage.setItem(`td-ts-${symbol}`, JSON.stringify({ closes, timestamp: Date.now() }))
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

interface TimeSeriesResponse {
  status?: string
  message?: string
  values?: Array<{ datetime: string; close: string }>
}

/** Fetches up to 100 daily close prices. Returns closes in chronological order (oldest first).
 *  Results are cached in localStorage for 4 hours to avoid burning free-tier credits. */
export async function getTimeSeries(symbol: string): Promise<number[] | null> {
  const cached = readCache(symbol)
  if (cached) return cached

  const url = `${BASE}/time_series?symbol=${symbol}&interval=1day&outputsize=100&apikey=${TOKEN}`
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`TwelveData ${res.status}: ${body || symbol}`)
  }
  const data: TimeSeriesResponse = await res.json()
  if (data.status === 'error') throw new Error(`TwelveData: ${data.message ?? 'unknown error'}`)
  if (!data.values?.length) return null

  // API returns newest-first; reverse for chronological order
  const closes = data.values.map((v) => parseFloat(v.close)).reverse()
  writeCache(symbol, closes)
  return closes
}
