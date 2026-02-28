import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  rsiEnabled: boolean
  rsiThreshold: number
  smaEnabled: boolean
  macdEnabled: boolean
  toggleRsi: () => void
  setRsiThreshold: (value: number) => void
  toggleSma: () => void
  toggleMacd: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      rsiEnabled: true,
      rsiThreshold: 30,
      smaEnabled: true,
      macdEnabled: true,
      toggleRsi: () => set((s) => ({ rsiEnabled: !s.rsiEnabled })),
      setRsiThreshold: (value) => set({ rsiThreshold: value }),
      toggleSma: () => set((s) => ({ smaEnabled: !s.smaEnabled })),
      toggleMacd: () => set((s) => ({ macdEnabled: !s.macdEnabled })),
    }),
    { name: 'pivot-settings' }
  )
)
