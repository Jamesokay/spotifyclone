import { useContext, useState, useEffect } from 'react'
import { TrackContext } from './TrackContext'
import useInterval from './useInterval'
import toMinsSecs from './toMinsSecs'
import playTrack from './playTrack'
import { AuthContext } from './AuthContext'




export default function WebPlayer() {

  const trackContext = useContext(TrackContext)
  const accessToken = useContext(AuthContext)
  const track = trackContext.currentTrack
  const player = trackContext.player
  const paused = trackContext.paused
  const isReady = trackContext.ready
  const [counter, setCounter] = useState(0);
  var image = track.album.images[0].url
  var total = track.duration_ms
  var percent = ((counter/total) * 100).toFixed(2)
  var bar = document.getElementById('playProgressBar')
  

  


  useInterval(() => {
    if (isReady && !paused) {
    setCounter(counter + 1000);
    }
  }, 1000);

  useEffect(() => {
    setCounter(0)
  }, [track.name])


  
  function setNewPlayback(progress) {
    let newPosition = Math.floor((track.duration_ms / 100) * progress)
    setCounter(newPosition)
    let data = {
      uris: [track.uri],
      position_ms: newPosition
    }
    playTrack(accessToken, data)   
  }





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

 if (isReady) {
  return (

    <div className='playBar'>
      <div className='playingTrack'>
        <img className='playingTrackImg' src={image} alt='' />
        <div className='playingTrackInfo'>
          <span className='playingTrackName'>{track.name}</span>
          <br />
          {(track.artists)?
            track.artists.map((artist, index, artists) =>
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
      <div className='playButton' onClick={() => player.togglePlay()}>
      {(paused)?
        <div className='playIcon'></div>
        :
        <div className='pauseIcon'></div>
      }
      </div>
      <div className='playedTime'>{toMinsSecs(counter)}</div>
      <div id='playProgressBar' onMouseUp={(e) => {
        let progress = Math.floor(e.screenX - bar.offsetLeft)
        let total = bar.offsetWidth
        setNewPlayback(Math.floor((progress / total) * 100))
      }}>
        <div className='playProgress' style={{width: percent + '%'}}></div>
      </div>
      <div className='playingTimeTotal'>{toMinsSecs(total)}</div>
      <div className='prevBox' onClick={() => player.previousTrack()}>
        <div className='prevTrackButton'></div>
      </div>
      <div className='nextBox' onClick={() => player.nextTrack()}>
        <div className='nextTrackButton'></div>
      </div>
    </div>
    )
    }
    else {
      return (
        <div className='playBar'></div>
      )
    }

}
