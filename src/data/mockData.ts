export interface WatchlistItem {
  symbol: string
  name: string
  price: number
  changePercent: number
  rsi: number
  smaAbove: boolean
  macdCross: boolean
  signalActive: boolean
}

export interface SignalItem {
  id: number
  symbol: string
  name: string
  price: number
  triggeredAt: string
  conditions: string[]
}

export const mockWatchlist: WatchlistItem[] = [
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 118.24, changePercent: -2.81, rsi: 28.4, smaAbove: true, macdCross: true, signalActive: true },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.43, changePercent: 1.24, rsi: 52.1, smaAbove: true, macdCross: false, signalActive: false },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.60, changePercent: 0.53, rsi: 61.3, smaAbove: true, macdCross: false, signalActive: false },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 244.18, changePercent: -4.07, rsi: 27.8, smaAbove: false, macdCross: true, signalActive: false },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 198.72, changePercent: 0.88, rsi: 29.1, smaAbove: true, macdCross: true, signalActive: true },
  { symbol: 'META', name: 'Meta Platforms', price: 521.34, changePercent: 2.14, rsi: 44.7, smaAbove: true, macdCross: false, signalActive: false },
]

export const mockSignals: SignalItem[] = [
  { id: 1, symbol: 'NVDA', name: 'NVIDIA Corporation', price: 118.24, triggeredAt: 'Today, 9:32 AM', conditions: ['RSI dropped below 30 → 28.4', 'Price crossed above 50-day MA', 'MACD bullish crossover'] },
  { id: 2, symbol: 'AMZN', name: 'Amazon.com Inc.', price: 198.72, triggeredAt: 'Today, 10:15 AM', conditions: ['RSI dropped below 30 → 29.1', 'Price crossed above 50-day MA', 'MACD bullish crossover'] },
  { id: 3, symbol: 'TSLA', name: 'Tesla Inc.', price: 238.90, triggeredAt: 'Feb 25, 2:41 PM', conditions: ['RSI dropped below 30 → 28.2', 'MACD bullish crossover'] },
  { id: 4, symbol: 'AAPL', name: 'Apple Inc.', price: 182.10, triggeredAt: 'Feb 24, 11:05 AM', conditions: ['RSI dropped below 30 → 29.8', 'Price crossed above 50-day MA'] },
  { id: 5, symbol: 'NVDA', name: 'NVIDIA Corporation', price: 104.50, triggeredAt: 'Feb 20, 9:45 AM', conditions: ['RSI dropped below 30 → 27.1', 'Price crossed above 50-day MA', 'MACD bullish crossover'] },
]
