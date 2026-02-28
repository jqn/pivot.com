import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getQuote, getCompanyProfile, computeIndicators } from '../lib/finnhub'
import { getTimeSeries } from '../lib/twelvedata'
import { useSettingsStore } from './settingsStore'
import type { WatchlistItem, SignalItem } from '../data/mockData'

interface WatchlistState {
  symbols: string[]
  stocks: Record<string, WatchlistItem>
  // Cached SMA-50 values so quote-only polls can recompute smaAbove without candle data
  _sma50s: Record<string, number>
  signalLog: SignalItem[]
  loading: boolean
  error: string | null
  lastUpdated: number | null
  _pollId: ReturnType<typeof setInterval> | null

  addSymbol: (symbol: string) => Promise<void>
  removeSymbol: (symbol: string) => void
  fetchStockData: (symbol: string) => Promise<void>
  fetchQuoteOnly: (symbol: string) => Promise<void>
  fetchAll: () => Promise<void>
  startPolling: () => void
  stopPolling: () => void
  clearSignalLog: () => void
}

function computeSignal(
  rsi: number,
  smaAbove: boolean,
  macdCross: boolean
): boolean {
  const { rsiEnabled, rsiThreshold, smaEnabled, macdEnabled } =
    useSettingsStore.getState()
  const rsiOk = !rsiEnabled || rsi < rsiThreshold
  const smaOk = !smaEnabled || smaAbove
  const macdOk = !macdEnabled || macdCross
  return rsiOk && smaOk && macdOk
}

function buildConditions(
  rsi: number,
  smaAbove: boolean,
  macdCross: boolean
): string[] {
  const { rsiEnabled, rsiThreshold, smaEnabled, macdEnabled } =
    useSettingsStore.getState()
  return [
    rsiEnabled && rsi < rsiThreshold ? `RSI ${rsi.toFixed(1)} below ${rsiThreshold}` : null,
    smaEnabled && smaAbove ? 'Price above 50-day MA' : null,
    macdEnabled && macdCross ? 'MACD bullish crossover' : null,
  ].filter(Boolean) as string[]
}

function makeLogEntry(
  symbol: string,
  name: string,
  price: number,
  rsi: number,
  smaAbove: boolean,
  macdCross: boolean
): SignalItem {
  return {
    id: `${symbol}-${Date.now()}`,
    symbol,
    name,
    price,
    triggeredAt: new Date().toISOString(),
    conditions: buildConditions(rsi, smaAbove, macdCross),
  }
}

const DEFAULT_SYMBOLS = ['NVDA', 'AAPL', 'MSFT', 'TSLA', 'AMZN', 'META']
const MAX_LOG = 100

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      symbols: DEFAULT_SYMBOLS,
      stocks: {},
      _sma50s: {},
      signalLog: [],
      loading: false,
      error: null,
      lastUpdated: null,
      _pollId: null,

      /** Full fetch: quote + TwelveData candles (for indicators) + profile if new symbol */
      async fetchStockData(symbol) {
        try {
          const existing = get().stocks[symbol]
          const [quote, closes, profile] = await Promise.all([
            getQuote(symbol),
            getTimeSeries(symbol),
            existing?.name ? Promise.resolve(null) : getCompanyProfile(symbol),
          ])

          const name = profile?.name ?? existing?.name ?? symbol
          const price = quote.c
          const changePercent = quote.dp

          const indicators = closes
            ? computeIndicators(closes, price)
            : {
                rsi: existing?.rsi ?? 50,
                sma50: get()._sma50s[symbol] ?? null,
                smaAbove: existing?.smaAbove ?? false,
                macdCross: existing?.macdCross ?? false,
              }

          const { rsi, sma50, smaAbove, macdCross } = indicators
          const signalActive = computeSignal(rsi, smaAbove, macdCross)
          const wasActive = existing?.signalActive ?? false

          set((state) => {
            const newLog =
              signalActive && !wasActive
                ? [makeLogEntry(symbol, name, price, rsi, smaAbove, macdCross), ...state.signalLog].slice(0, MAX_LOG)
                : state.signalLog

            return {
              stocks: {
                ...state.stocks,
                [symbol]: { symbol, name, price, changePercent, rsi, smaAbove, macdCross, signalActive },
              },
              _sma50s: sma50 !== null
                ? { ...state._sma50s, [symbol]: sma50 }
                : state._sma50s,
              signalLog: newLog,
            }
          })
        } catch (err) {
          console.error(`Failed to fetch data for ${symbol}:`, err)
        }
      },

      /** Quote-only fetch: Finnhub /quote only (used by 30s poller to stay within rate limits) */
      async fetchQuoteOnly(symbol) {
        try {
          const quote = await getQuote(symbol)
          const price = quote.c
          const changePercent = quote.dp
          const existing = get().stocks[symbol]
          if (!existing) return

          // Recompute smaAbove with cached SMA-50
          const sma50 = get()._sma50s[symbol] ?? null
          const smaAbove = sma50 !== null ? price > sma50 : existing.smaAbove
          const { rsi, macdCross } = existing
          const signalActive = computeSignal(rsi, smaAbove, macdCross)
          const wasActive = existing.signalActive

          set((state) => {
            const newLog =
              signalActive && !wasActive
                ? [makeLogEntry(symbol, existing.name, price, rsi, smaAbove, macdCross), ...state.signalLog].slice(0, MAX_LOG)
                : state.signalLog

            return {
              stocks: {
                ...state.stocks,
                [symbol]: { ...existing, price, changePercent, smaAbove, signalActive },
              },
              signalLog: newLog,
            }
          })
        } catch (err) {
          console.error(`Failed to fetch quote for ${symbol}:`, err)
        }
      },

      async fetchAll() {
        const { symbols, fetchStockData } = get()
        set({ loading: true, error: null })
        try {
          await Promise.all(symbols.map((sym) => fetchStockData(sym)))
          set({ loading: false, lastUpdated: Date.now() })
        } catch (err) {
          set({ loading: false, error: err instanceof Error ? err.message : 'Fetch failed' })
        }
      },

      async addSymbol(symbol) {
        const sym = symbol.toUpperCase().trim()
        if (!sym || get().symbols.includes(sym)) return
        set((state) => ({ symbols: [...state.symbols, sym] }))
        await get().fetchStockData(sym)
      },

      removeSymbol(symbol) {
        set((state) => {
          const stocks = { ...state.stocks }
          const _sma50s = { ...state._sma50s }
          delete stocks[symbol]
          delete _sma50s[symbol]
          return { symbols: state.symbols.filter((s) => s !== symbol), stocks, _sma50s }
        })
      },

      clearSignalLog() {
        set({ signalLog: [] })
      },

      startPolling() {
        const { _pollId, fetchAll } = get()
        if (_pollId) return
        fetchAll()
        // Poll quotes only every 30s to stay within rate limits
        const id = setInterval(() => {
          const { symbols, fetchQuoteOnly } = get()
          symbols.forEach((sym) => fetchQuoteOnly(sym))
        }, 30_000)
        set({ _pollId: id })
      },

      stopPolling() {
        const { _pollId } = get()
        if (_pollId) {
          clearInterval(_pollId)
          set({ _pollId: null })
        }
      },
    }),
    {
      name: 'pivot-watchlist',
      // Persist symbols and signal history; stock data is always refetched
      partialize: (state) => ({ symbols: state.symbols, signalLog: state.signalLog }),
    }
  )
)
