import { createContext } from 'react'

export const ThemeContext = createContext({
    currentTheme: '0, 0, 0',
    setCurrentTheme: () => { }
})