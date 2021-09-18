import { createContext, useState, useContext, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import SpotifyWebApi from 'spotify-web-api-node'

const TrackContext = createContext()

const track = {
  name: "",
  album: {
      images: [
          { url: "" }
      ]
  },
  artists: [
      { name: "" }
  ]
}

const spotifyApi = new SpotifyWebApi({
  clientId: localStorage.getItem('clientId')
})


function TrackContextProvider({ children }) {
  const [player, setPlayer] = useState(undefined)
  const [currentTrack, setCurrentTrack] = useState(track)
  const accessToken = useContext(AuthContext)

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])


  useEffect(() => {
    if (!accessToken) return

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
            name: 'Web Playback SDK',
            getOAuthToken: cb => { cb(accessToken); },
            volume: 0.5
        });

    setPlayer(player);   

    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    });

    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });
   

    player.addListener('player_state_changed', ( state => {
      if (!state) {
          return;
      }
 
       setCurrentTrack(state.track_window.current_track);

    }))

    player.connect();
  
  }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return
    if (!currentTrack) return

    console.log(currentTrack)
  }, [accessToken, currentTrack])


  
  const value = {currentTrack, setCurrentTrack, player}
  return <TrackContext.Provider value={value}>{children}</TrackContext.Provider>
}

export {TrackContext, TrackContextProvider}

