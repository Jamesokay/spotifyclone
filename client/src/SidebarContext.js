import { createContext } from 'react'

export const SidebarContext = createContext({
    userPlaylists: [],
    setUserPlaylists: () => { }
})