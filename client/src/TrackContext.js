import { createContext } from 'react'

export const TrackContext = createContext({
    nowPlaying: {contextUri: '',
                 trackUri: '',
                 trackName: '',
                 isPaused: false},
    setNowPlaying: () => { }
})

