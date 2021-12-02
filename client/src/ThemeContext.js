import { createContext } from 'react'

export const ThemeContext = createContext({
    currentTheme: {red: 0, 
                   green: 0, 
                   blue: 0},
    setCurrentTheme: () => { }
})