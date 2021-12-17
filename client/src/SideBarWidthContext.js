import { createContext } from 'react'

export const SideBarWidthContext = createContext({
    currentWidth: window.innerWidth * 0.15,
    setCurrentWidth: () => { }
})