import { createContext } from "react"

export type Theme = "light" | "dark"

export interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
export const THEME_STORAGE_KEY = "arfix-theme"

export const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light"
  }

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}
