import { createContext, useState } from 'react'

const TrackContext = createContext()

function TrackContextProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState({
      name: '',
      artists: [],
      imgUrl: ''
  })
  const value = {currentTrack, setCurrentTrack}
  return <TrackContext.Provider value={value}>{children}</TrackContext.Provider>
}

export {TrackContext, TrackContextProvider}

