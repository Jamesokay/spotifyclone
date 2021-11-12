import { createContext } from 'react'

export const PlaylistContext = createContext({
    newTrack: '',
    setNewTrack: () => { }
})