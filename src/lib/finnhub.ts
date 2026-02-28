const BASE = 'https://finnhub.io/api/v1'
const TOKEN = import.meta.env.VITE_FINNHUB_API_KEY

if (!TOKEN) {
  console.error(
    '[Finnhub] VITE_FINNHUB_API_KEY is not set.\n' +
    'Add it to .env.local, then restart the dev server (Vite only reads env vars at startup).'
  )
}

async function apiFetch<T>(path: string): Promise<T> {
  const sep = path.includes('?') ? '&' : '?'
  const url = `${BASE}${path}${sep}token=${TOKEN}`
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Finnhub ${res.status}: ${body || path}`)
  }
  return res.json() as Promise<T>
}

// ─── API response types ───────────────────────────────────────────────────────

export interface Quote {
  c: number   // current price
  d: number   // change
  dp: number  // change percent
  h: number   // high
  l: number   // low
  o: number   // open
  pc: number  // prev close
}

export interface CompanyProfile {
  name: string
  ticker: string
}

// ─── API calls (all free-tier endpoints) ─────────────────────────────────────

export async function getQuote(symbol: string): Promise<Quote> {
  return apiFetch<Quote>(`/quote?symbol=${symbol}`)
}

export async function getCompanyProfile(symbol: string): Promise<CompanyProfile> {
  return apiFetch<CompanyProfile>(`/stock/profile2?symbol=${symbol}`)
}

// ─── Client-side indicator computation ───────────────────────────────────────

/** RSI using Wilder's smoothing method (standard 14-period). */
function computeRSI(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 50
  const changes = closes.slice(1).map((c, i) => c - closes[i])
  let avgGain = 0
  let avgLoss = 0
  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) avgGain += changes[i]
    else avgLoss += Math.abs(changes[i])
  }
  avgGain /= period
  avgLoss /= period
  for (let i = period; i < changes.length; i++) {
    avgGain = (avgGain * (period - 1) + Math.max(0, changes[i])) / period
    avgLoss = (avgLoss * (period - 1) + Math.abs(Math.min(0, changes[i]))) / period
  }
  if (avgLoss === 0) return 100
  return 100 - 100 / (1 + avgGain / avgLoss)
}

function computeEMA(values: number[], period: number): number[] {
  if (!values.length) return []
  const k = 2 / (period + 1)
  const result = [values[0]]
  for (let i = 1; i < values.length; i++) {
    result.push(values[i] * k + result[i - 1] * (1 - k))
  }
  return result
}

function computeSMA(closes: number[], period: number): number | null {
  if (closes.length < period) return null
  const slice = closes.slice(-period)
  return slice.reduce((a, b) => a + b, 0) / period
}

function computeMACD(closes: number[]): { macd: number; signal: number } | null {
  if (closes.length < 35) return null
  const ema12 = computeEMA(closes, 12)
  const ema26 = computeEMA(closes, 26)
  // MACD line is only meaningful after EMA-26 has enough data (index 25+)
  const macdLine = ema12.map((v, i) => v - ema26[i]).slice(25)
  const signalLine = computeEMA(macdLine, 9)
  return {
    macd: macdLine.at(-1)!,
    signal: signalLine.at(-1)!,
  }
}

export interface Indicators {
  rsi: number
  sma50: number | null   // 50-day SMA value (used to recompute smaAbove on quote polls)
  smaAbove: boolean      // current price > 50-day SMA
  macdCross: boolean     // MACD line above signal line (bullish)
}

export interface SearchResult {
  symbol: string
  description: string
  type: string
}

export async function searchSymbols(query: string): Promise<SearchResult[]> {
  const data = await apiFetch<{ result: SearchResult[] }>(
    `/search?q=${encodeURIComponent(query)}&exchange=US`
  )
  return (data.result ?? []).filter((r) => r.type === 'Common Stock').slice(0, 6)
}

export interface NewsItem {
  id: number
  headline: string
  source: string
  datetime: number  // Unix timestamp
  url: string
  image: string
  summary: string
}

export async function getMarketNews(): Promise<NewsItem[]> {
  return apiFetch<NewsItem[]>('/news?category=general')
}

export interface Recommendation {
  period: string   // "YYYY-MM-DD"
  strongBuy: number
  buy: number
  hold: number
  sell: number
  strongSell: number
}

export async function getRecommendations(symbol: string): Promise<Recommendation[]> {
  return apiFetch<Recommendation[]>(`/stock/recommendation?symbol=${symbol}`)
}

/** Computes RSI-14, SMA-50, and MACD from candle close prices. */
export function computeIndicators(closes: number[], currentPrice: number): Indicators {
  const sma50 = computeSMA(closes, 50)
  const macd = computeMACD(closes)
  return {
    rsi: computeRSI(closes),
    sma50,
    smaAbove: sma50 !== null ? currentPrice > sma50 : false,
    macdCross: macd !== null ? macd.macd > macd.signal : false,
  }
}
