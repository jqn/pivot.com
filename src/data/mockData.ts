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
  id: string
  symbol: string
  name: string
  price: number
  triggeredAt: string
  conditions: string[]
}
