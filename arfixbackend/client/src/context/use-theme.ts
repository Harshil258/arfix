import { useContext } from "react"
import { ThemeContext } from "./theme-context-core"
import type { ThemeContextValue } from "./theme-context-core"

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider")
  }

  return context
}
