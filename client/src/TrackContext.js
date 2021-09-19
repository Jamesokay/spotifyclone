import { createContext, useState, useContext, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import axios from 'axios'

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


function TrackContextProvider({ children }) {
  const [player, setPlayer] = useState(undefined)
  const [currentTrack, setCurrentTrack] = useState(track)
  const [paused, setPaused] = useState(false);
//  const [active, setActive] = useState(false)
  const accessToken = useContext(AuthContext)
  const [devId, setDevId] = useState("")


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
        setDevId(device_id)
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

       setPaused(state.paused);


    //   player.getCurrentState().then( state => { 
    //       (!state)? setActive(false) : setActive(true) 
    //   })

    }))

    player.connect();
  
  }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return
    if (!devId) return

    let data = {
      device_ids: [devId]
    }

    const options = {
      url: 'https://api.spotify.com/v1/me/player/',
      method: 'PUT',
      headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          },
      data
      }
  
    axios(options)
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })


  }, [accessToken, devId])

  // useEffect(() => {
  //   if (!accessToken) return
  //   if (!currentTrack) return

  //     console.log(currentTrack)

  // }, [accessToken, currentTrack])


  
  const value = {currentTrack, setCurrentTrack, player, paused}
  return <TrackContext.Provider value={value}>{children}</TrackContext.Provider>
}

export {TrackContext, TrackContextProvider}

