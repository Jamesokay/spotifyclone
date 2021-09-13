import { useContext, useState, useEffect } from 'react'
import { TrackContext } from './TrackContext'
import { AuthContext } from './AuthContext'


export default function WebPlayer({ dispatch }) {

  const trackContext = useContext(TrackContext)
  const accessToken = useContext(AuthContext)
  const track = trackContext.currentTrack
  const [isPlaying, setIsPlaying] = useState(false)
  let testPlayer

  function pageChange(pageType, pageId) {
    if (pageType === 'artist') {
      dispatch({
        type: 'ARTIST_PAGE',
        id: pageId
      })
    }
    else if (pageType === 'album') {
      dispatch({
        type: 'ALBUM_PAGE',
        id: pageId
      })
    }
  }

  const loadScript = () => {
    const script = document.createElement("script");
    script.id = "spotify-player";
    script.type = "text/javascript";
    script.async = "async";
    script.defer = "defer";
    script.src = "https://sdk.scdn.co/spotify-player.js";
    document.body.appendChild(script);
  }

  const InitializePlayer = () => {
    console.log('initializing player');
    let { Player } = window.Spotify;
    testPlayer = new Player({
        name: 'test SDK player',
        getOAuthToken: (cb) => {
            cb(accessToken);
        },
    })

    // Ready
    testPlayer.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });

    // Not Ready
    testPlayer.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    testPlayer.addListener('initialization_error', ({ message }) => { 
      console.error(message);
    });

    testPlayer.addListener('authentication_error', ({ message }) => {
      console.error(message);
    });

    testPlayer.addListener('account_error', ({ message }) => {
      console.error(message);
    });

    testPlayer.connect();
  }

  useEffect(() => {
    if (!accessToken) return
    // initialize script
    loadScript();

    window.onSpotifyWebPlaybackSDKReady = () => InitializePlayer();
    // get current state of the player
    return () => {
        testPlayer.disconnect();
    }
    // eslint-disable-next-line
}, [accessToken])

  return (
    <div className='playBar'>
      <div className='playingTrack'>
        <img className='playingTrackImg' src={track.imgUrl} alt='' />
        <div className='playingTrackInfo'>
          <span className='playingTrackName' onClick={() => pageChange('album', track.albumId)}>{track.name}</span>
          <br />
          {(track.artists)?
            track.artists.map((artist, index, artists) =>
              <span key={artist.id}> 
                <span className='playingTrackArtist' onClick={() => pageChange('artist', artist.id)}>{artist.name}</span>
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
      <div className='playButton'>
      {(!isPlaying)?
        <div className='playIcon' onClick={() => setIsPlaying(true)}></div>
        :
        <div className='pauseIcon' onClick={() => setIsPlaying(false)}></div>
      }
      </div>
      <div className='playProgressBar'>
        <div className='playProgress'></div>
      </div>
      <div className='prevBox'>
        <div className='prevTrackButton'></div>
      </div>
      <div className='nextBox'>
        <div className='nextTrackButton'></div>
      </div>
    </div>
    )
}
