import { useContext, useState, useEffect } from 'react'
import { TrackContext } from './TrackContext'
import useInterval from './useInterval'
import toMinsSecs from './toMinsSecs'
import playTrack from './playTrack'
import { AuthContext } from './AuthContext'
import axios from 'axios'




export default function WebPlayer() {

  const trackContext = useContext(TrackContext)
  const accessToken = useContext(AuthContext)
  const track = trackContext.currentTrack
  const player = trackContext.player
  const paused = trackContext.paused
  const isReady = trackContext.ready
  const [contextUri, setContextUri] = useState('')
  const [counter, setCounter] = useState(0);
  var image = track.album.images[0].url
  var total = track.duration_ms
  var percent = ((counter/total) * 100).toFixed(2)
  var bar = document.getElementById('playProgressBar')
  const [barHover, setBarHover] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [dragPos, setDragPos] = useState(0)
  

  


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
    if (!accessToken) return
    if (!track.name) return

    const options = {
      url: 'https://api.spotify.com/v1/me/player',
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + accessToken },
    }
    
    axios(options)
    .then(response => {
      console.log(response.data)
      setContextUri(response.data.context.uri)
    })
    .catch(error => {
      console.log(error)
    })

  }, [track.name, accessToken])




  
  function setNewPlayback(progress) {
    let newPosition = Math.floor((track.duration_ms / 100) * progress)
    setCounter(newPosition)

    if (!contextUri) {
      let data = {
        uris: [track.uri],
        position_ms: newPosition
      }
      playTrack(accessToken, data) 
    } 
    else {
      let data = {
        context_uri: contextUri,
        offset: {uri: track.uri},
        position_ms: newPosition
      }
      playTrack(accessToken, data)
    } 
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
            setNewPlayback(99)
          }
          else {
            setNewPlayback(Math.floor(((e.screenX - bar.offsetLeft) / bar.offsetWidth) * 100))
          }
        }}}>
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
