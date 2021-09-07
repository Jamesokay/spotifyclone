import { createContext, useState, useContext, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import SpotifyWebApi from 'spotify-web-api-node'

const TrackContext = createContext()

const spotifyApi = new SpotifyWebApi({
  clientId: localStorage.getItem('clientId')
})

function TrackContextProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState({})
  const accessToken = useContext(AuthContext)
  
  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    if (!accessToken) return

      spotifyApi.getMyCurrentPlayingTrack()
      .then(data => {       
        setCurrentTrack({
          name: data.body.item.name, 
          artists: data.body.item.artists, 
          imgUrl: data.body.item.album.images[0].url,
          albumId: data.body.item.album.id
        })
      })
      .catch(error => {
        console.log(error)
      })
  }, [accessToken])


  
  const value = {currentTrack, setCurrentTrack}
  return <TrackContext.Provider value={value}>{children}</TrackContext.Provider>
}

export {TrackContext, TrackContextProvider}

