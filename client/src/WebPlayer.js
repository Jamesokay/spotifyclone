import { useContext, useState, useEffect } from 'react'
import { TrackContext } from './TrackContext'
import useInterval from './useInterval'
import toMinsSecs from './toMinsSecs'
// import playTrack from './playTrack'
import { AuthContext } from './AuthContext'
import axios from 'axios'




export default function WebPlayer() {

  const trackContext = useContext(TrackContext)
  const accessToken = useContext(AuthContext)
  const track = trackContext.currentTrack
  const player = trackContext.player
  const paused = trackContext.paused
  const isReady = trackContext.ready
  const [counter, setCounter] = useState(0)
  
  var image = track.album.images[0].url
  var total = track.duration_ms
  var percent = ((counter/total) * 100).toFixed(2)
  var bar = document.getElementById('playProgressBar')
  const [barHover, setBarHover] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [dragPos, setDragPos] = useState(0)
  const [shuffling, setShuffling] = useState(false)
  const [shuffleColour, setShuffleColour] = useState('grey')
  const [repeatIconColour, setRepeatIconColour] = useState('grey')
  

  


  useInterval(() => {
    if (isReady && !paused) {
    setCounter(counter + 1000);
    }
  }, 1000);

   useEffect(() => {
    setCounter(0)
  }, [track.name])


 

  //useEffect dependent on... something
  //getCurrentPlayback.context... everytime track.name changes? 





  useEffect(() => {
    console.log(shuffling)
    if (shuffling) {
      setShuffleColour('#1ed760')
    }
  }, [shuffling])



  

  function toggleShuffle(bool) {
    const options = {
      url: `https://api.spotify.com/v1/me/player/shuffle?state=${bool}`,
      method: 'PUT',
      headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
      }
    }

    axios(options)
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })
  }




  
  function setNewPlayback(progress) {
    let newPosition = Math.floor((track.duration_ms / 100) * progress)
    setCounter(newPosition)

    const options = {
      url: `https://api.spotify.com/v1/me/player/seek?position_ms=${newPosition}`,
      method: 'PUT',
      headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
      }
    }

    axios(options)
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })

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

    <div className='playBar'
        onMouseMove={(e)=> {
        if (dragging) {
          if (e.screenX < bar.offsetLeft) {
            setDragPos(0)
          }
          else if (e.screenX > (bar.offsetLeft + bar.offsetWidth)) {
            setDragPos(bar.offsetWidth)
          }
          else {
            setDragPos(e.screenX - bar.offsetLeft)
          }
        }}}
        onMouseUp={(e) => {
        if (dragging) {
          setDragging(false)
          if (e.screenX < bar.offsetLeft) {
            setNewPlayback(0)
          }
          else if (e.screenX > (bar.offsetLeft + bar.offsetWidth)) {
            setNewPlayback(100)
          }
          else {
            setNewPlayback(Math.floor(((e.screenX - bar.offsetLeft) / bar.offsetWidth) * 100))
          }
        }}}>
      <div className='playingTrack'>
        <img className='playingTrackImg' src={image} alt='' />
        <div className='playingTrackInfo'>
          <span className='playingTrackName'>{track.name}</span>
          <div className='trackArtists'>
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
      </div>

      <div id='playFunctions'>
      <svg className='shuffleIcon' 
           role="img" 
           height="16" 
           width="16" 
           viewBox="0 0 16 16"
           onMouseOver={()=> {
             if (!shuffling) {
               setShuffleColour('white')
             }
            }}
           onMouseLeave={()=> {
             if (!shuffling) {
               setShuffleColour('grey')
             }
            }}
           onClick={()=> {
             if (shuffling) {
               setShuffleColour('grey')
               setShuffling(false)
               toggleShuffle(false)
             }
             else {
              setShuffling(true)
              toggleShuffle(true)
             }
           }}>
            <path fill={shuffleColour} d="M4.5 6.8l.7-.8C4.1 4.7 2.5 4 .9 4v1c1.3 0 2.6.6 3.5 1.6l.1.2zm7.5 4.7c-1.2 0-2.3-.5-3.2-1.3l-.6.8c1 1 2.4 1.5 3.8 1.5V14l3.5-2-3.5-2v1.5zm0-6V7l3.5-2L12 3v1.5c-1.6 0-3.2.7-4.2 2l-3.4 3.9c-.9 1-2.2 1.6-3.5 1.6v1c1.6 0 3.2-.7 4.2-2l3.4-3.9c.9-1 2.2-1.6 3.5-1.6z"></path>
        </svg>
      <div className='prevBox' onClick={() => player.previousTrack()}>
        <div className='prevTrackButton'></div>
      </div>
      <div className='playButton' onClick={() => player.togglePlay()}>
      {(paused)?
        <div className='playIcon'></div>
        :
        <div className='pauseIcon'></div>
      }
      </div>
      <div className='nextBox' onClick={() => player.nextTrack()}>
        <div className='nextTrackButton'></div>
      </div>
      <svg className='repeatIcon'
          role="img" 
          height="16" 
          width="16" 
          viewBox="0 0 16 16"
          onMouseOver={()=> setRepeatIconColour('white')}
          onMouseLeave={()=> setRepeatIconColour('grey')}>
            <path fill={repeatIconColour} d="M5.5 5H10v1.5l3.5-2-3.5-2V4H5.5C3 4 1 6 1 8.5c0 .6.1 1.2.4 1.8l.9-.5C2.1 9.4 2 9 2 8.5 2 6.6 3.6 5 5.5 5zm9.1 1.7l-.9.5c.2.4.3.8.3 1.3 0 1.9-1.6 3.5-3.5 3.5H6v-1.5l-3.5 2 3.5 2V13h4.5C13 13 15 11 15 8.5c0-.6-.1-1.2-.4-1.8z"></path>
      </svg>
      </div>


      <div className='playedTime'>
        {(dragging)? 
          toMinsSecs(Math.floor((track.duration_ms / 100) * (dragPos / bar.offsetWidth) * 100))
        :
          toMinsSecs(counter)}
      </div>
      <div id='playProgressBar' 
           onMouseOver={()=> setBarHover(true)} 
           onMouseLeave={()=> setBarHover(false)} 
           onMouseDown={()=> setDragging(true)}>
            <div className='playProgress' style={(dragging)? {width: dragPos, backgroundColor: '#1ed760'} : {width: percent + '%'}}>
              <div id='playDrag' 
                   onMouseDown={()=> setDragging(true)}
                   style={(dragging || barHover)? {visibility: 'visible'} : {visibility: 'hidden'}}>
              </div>
            </div>
      </div>
      <div className='playingTimeTotal'>{toMinsSecs(total)}</div>
    </div>
    )
    }
    else {
      return (
        <div className='playBar'></div>
      )
    }

}
