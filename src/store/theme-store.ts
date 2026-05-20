import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => {
          const nextTheme = state.theme === 'light' ? 'dark' : 'light'
          updateThemeClass(nextTheme)
          return { theme: nextTheme }
        }),
      setTheme: (theme: Theme) => {
        updateThemeClass(theme)
        set({ theme })
      },
    }),
    {
      name: 'base64-converter-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          updateThemeClass(state.theme)
        }
      },
    }
  )
)

function updateThemeClass(theme: Theme) {
  if (typeof window === 'undefined') return
  const root = window.document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}
