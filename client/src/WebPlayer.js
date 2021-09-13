import { useContext, useState, useEffect } from 'react'
// import { TrackContext } from './TrackContext'
import { AuthContext } from './AuthContext'

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

export default function WebPlayer({ dispatch }) {

//  const trackContext = useContext(TrackContext)
  const accessToken = useContext(AuthContext)
//  const track = trackContext.currentTrack
 const [isPlaying, setIsPlaying] = useState(false)
  
  const [player, setPlayer] = useState(undefined)
  const [is_paused, setPaused] = useState(false)
  const [is_active, setActive] = useState(false)
  const [current_track, setTrack] = useState(track)

  // function pageChange(pageType, pageId) {
  //   if (pageType === 'artist') {
  //     dispatch({
  //       type: 'ARTIST_PAGE',
  //       id: pageId
  //     })
  //   }
  //   else if (pageType === 'album') {
  //     dispatch({
  //       type: 'ALBUM_PAGE',
  //       id: pageId
  //     })
  //   }
  // }

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
 
      setTrack(state.track_window.current_track);
      setPaused(state.paused);
  
  
      player.getCurrentState().then( state => { 
          (!state)? setActive(false) : setActive(true) 
      });
    }))}
  }, [accessToken]);



  return (

    <div className='playBar'>
      <div className='playingTrack'>
        <img className='playingTrackImg' src={current_track.album.images[0].url} alt='' />
        <div className='playingTrackInfo'>
          <span className='playingTrackName'>{current_track.name}</span>
          <br />
          {(current_track.artists)?
            current_track.artists.map((artist, index, artists) =>
              <span key={artist.id}> 
                <span className='playingTrackArtist'>{artist.name}</span>
                {(index < artists.length - 1)?
                  <span className='playerPunc'>, </span>
                  :
                  <span></span>
                }
              </span>
            )
          :
          <span></span>
          }

        </div>
      </div>
      <div className='playButton' onClick={() => { player.togglePlay() }}>
      {(!isPlaying)?
        <div className='playIcon' onClick={() => setIsPlaying(true)}></div>
        :
        <div className='pauseIcon' onClick={() => setIsPlaying(false)}></div>
      }
      </div>
      <div className='playProgressBar'>
        <div className='playProgress'></div>
      </div>
      <div className='prevBox' onClick={() => { player.previousTrack() }}>
        <div className='prevTrackButton'></div>
      </div>
      <div className='nextBox' onClick={() => { player.nextTrack() }}>
        <div className='nextTrackButton'></div>
      </div>
    </div>
    )
}
