import { createContext } from 'react'

export const TrackContext = createContext({
    nowPlaying: {contextUri: '',
                 trackUri: '',
                 isPaused: false},
    setNowPlaying: () => { }
})

