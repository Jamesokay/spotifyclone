import { createContext, useState, useContext, useEffect } from 'react'
import { AuthContext } from './AuthContext'
// import SpotifyWebApi from 'spotify-web-api-node'

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

// const spotifyApi = new SpotifyWebApi({
//   clientId: localStorage.getItem('clientId')
// })

function TrackContextProvider({ children }) {
  const [player, setPlayer] = useState(undefined)
  const [currentTrack, setCurrentTrack] = useState(track)
  const accessToken = useContext(AuthContext)
  const [isPlaying, setIsPlaying] = useState(false)
  
  // useEffect(() => {
  //   if (!accessToken) return
  //   spotifyApi.setAccessToken(accessToken)
  // }, [accessToken])

  // useEffect(() => {
  //   if (!accessToken) return

  //     spotifyApi.getMyCurrentPlayingTrack()
  //     .then(data => {     
  //       setCurrentTrack({
  //         name: data.body.item.name,
  //         album: data.body.item.album,
  //         artists: data.body.item.artists
  //       })
  //     })
  //     .catch(error => {
  //       console.log(error)
  //     })
  // }, [accessToken])

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

    player.connect();

    player.addListener('player_state_changed', ( state => {
      if (!state) {
          return;
      }
 
       setCurrentTrack(state.track_window.current_track);

    }))}
  }, [accessToken]);

  useEffect(() => {
    if (!player) return

      player.togglePlay()
    
  }, [player, isPlaying])

 


  
  const value = {currentTrack, setCurrentTrack, isPlaying, setIsPlaying}
  return <TrackContext.Provider value={value}>{children}</TrackContext.Provider>
}

export {TrackContext, TrackContextProvider}

