import { useContext, useState, useEffect } from 'react'
import useInterval from '../hooks/useInterval'
import toMinsSecs from '../utils/toMinsSecs'
import { AuthContext, TrackContext } from '../contexts'
import axios from 'axios'
import { Link } from 'react-router-dom'

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


export default function WebPlayer() {

  const [player, setPlayer] = useState(undefined)
  const [currentTrack, setCurrentTrack] = useState(track)
//  const [active, setActive] = useState(false)
  const [paused, setPaused] = useState(false);
  const accessToken = useContext(AuthContext)
  const [devId, setDevId] = useState("")
  const [ready, setReady] = useState(false)
  
  const [vol, setVol] = useState(0)
  const [prevVol, setPrevVol] = useState(0)
  const [volDrag, setVolDrag] = useState(false)
  const [volHover, setVolHover] = useState(false)
  const [volLevel, setVolLevel] = useState("")
  const [volIconColour, setVolIconColour] = useState('grey')
  const [mute, setMute] = useState(false)
  
  
  const [counter, setCounter] = useState(0)
  
  var total = currentTrack.duration_ms
  var percent = ((counter/total) * 100).toFixed(2)
  var playerDiv = document.getElementById('player')
  var bar = document.getElementById('playProgressBar')

  var volBar = document.getElementById('volumeBar')


  const [barHover, setBarHover] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [dragPos, setDragPos] = useState(0)
  const [shuffling, setShuffling] = useState(false)
  const [shuffleColour, setShuffleColour] = useState('grey')
 
  const [repeat, setRepeat] = useState(0)
  const [repeatCheck, setRepeatCheck] = useState(0)
  const [repeatInit, setRepeatInit] = useState(false)
  const [repeatIconColour, setRepeatIconColour] = useState('grey')

  const {nowPlaying, setNowPlaying} = useContext(TrackContext)
 
  

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
      setRepeatCheck(state.repeat_mode)
      setCurrentTrack(state.track_window.current_track);
      setShuffling(state.shuffle)
      setCounter(state.position)
      setPaused(state.paused)

      // player.getCurrentState().then( state => { 
      //   (!state)? setActive(false) : setActive(true) 
      // })

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
    .then(setReady(true))
    .catch(error => {
      console.log(error)
    })

  }, [accessToken, devId])


  useEffect(() => {
    if (!ready) return
    if (!player) return

    player.getVolume().then(vol => {
      setVol(vol * 100)
    })

  }, [ready, player])

  useEffect(() => {
    if (!player) return
    if (!currentTrack.name) return

    player.getCurrentState().then(state => {
      if (!state) {
        console.log("no state")
        return 
      }
      else {
        setRepeat(state.repeat_mode)
        setRepeatInit(true)
      }
    })

  }, [currentTrack.name, player])



  useInterval(() => {
    if (ready && !paused) {
    setCounter(counter + 1000);
    }
  }, 1000);


  useEffect(() => {
    if (shuffling) {
      setShuffleColour('#1ed760')
    }
  }, [shuffling])

  useEffect(()=> {
    if (repeat >= 1) {
      setRepeatIconColour('#1ed760')
    }
  }, [repeat])




  useEffect(() => {
    if (!ready) return
    if (!player) return 
    player.setVolume(vol / 100)
  }, [ready, player, vol])

  useEffect(() => {
    if (vol === 0) {
      setVolLevel("M14 9.5 L19 14.5 M14 14.5 L19 9.5")
    }
    else if (vol < 25) {
      setVolLevel("M14 9.5 a 5 5 0 0 1 0 5")
    }
    else if (vol > 25 && vol < 75) {
      setVolLevel("M14 8.8 a 5 5 0 0 1 0 7")
    }
    else if (vol > 75) {
      setVolLevel("M17 6 a10 10 0 0 1 0 12 M14 9 a4 4 0 0 1 0 6")
    }
  }, [vol])



  useEffect(() => {
    if (!player) return
    if (!currentTrack.name) return
    player.getCurrentState()
    .then(res => {
      setNowPlaying({contextUri: res.context.uri,
                     trackUri: res.track_window.current_track.uri,
                     trackName: res.track_window.current_track.name,
                     isPaused: paused})
    })
    .catch(error => {
      console.log(error)
    })

  }, [player, currentTrack.name, setNowPlaying, paused])


  useEffect(() => {
    console.log(nowPlaying)
  }, [nowPlaying])



  // FUNCTIONS

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
    let newPosition = Math.floor((currentTrack.duration_ms / 100) * progress)
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

  useEffect(() => {
    if (!accessToken) return
    if (!repeatInit) return
    
    let repeatMode
    
    if (repeat === 0) {
      repeatMode = "off"
    }
    else if (repeat === 1) {
      repeatMode = "context"
    }
    else if (repeat === 2) {
      repeatMode = "track"
    }
    
    const options = {
      url: `https://api.spotify.com/v1/me/player/repeat?state=${repeatMode}`,
      method: 'PUT',
      headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
      }
    }

    if (repeatCheck !== repeat) {

      axios(options)
      .then(response => {
        console.log("updated " + response.status)
      })
      .catch(error => {
        console.log(error)
      })
   }
    
  }, [accessToken, repeatCheck, repeat, repeatInit])
  


 if (currentTrack.name) {
  return (

    <div className='playBar'
        onMouseMove={(e)=> {
        if (dragging) {
          if (e.screenX < (bar.offsetLeft + playerDiv.offsetLeft)) {
            setDragPos(0)
          }
          else if (e.screenX > (bar.offsetLeft + bar.offsetWidth + playerDiv.offsetLeft)) {
            setDragPos(bar.offsetWidth)
          }
          else {
            setDragPos(e.screenX - (bar.offsetLeft + playerDiv.offsetLeft))
          }
        }
        if (volDrag) {
          if (e.screenX < volBar.offsetLeft) {
            setVol(0)
          }
          else if (e.screenX > (volBar.offsetLeft + volBar.offsetWidth)) {
            setVol(100)
          }
          else {
            setVol(e.screenX - volBar.offsetLeft)
          }
        }}}
        onMouseUp={(e) => {
        if (dragging) {
          setDragging(false)
          if (e.screenX < (bar.offsetLeft + playerDiv.offsetLeft)) {
            setNewPlayback(0)
          }
          else if (e.screenX > (bar.offsetLeft + bar.offsetWidth + playerDiv.offsetLeft)) {
            setNewPlayback(100)
          }
          else {
            setNewPlayback(Math.floor(((e.screenX - (bar.offsetLeft + playerDiv.offsetLeft)) / bar.offsetWidth) * 100))
          }
        }
        if (volDrag) {
          setVolDrag(false)
          if (e.screenX < volBar.offsetLeft) {
            setVol(0)
          }
          else if (e.screenX > (volBar.offsetLeft + volBar.offsetWidth)) {
            setVol(100)
          }
          else {
            setVol(e.screenX - volBar.offsetLeft)
          }
        }
        
        }}>
      <div className='playingTrack'>
      <div className='playingTrackImgContainer'>
        <img className='playingTrackImg' src={currentTrack.album.images[0].url} alt='' />
      </div>
        
        <div className='playingTrackText'>
        <Link style={{textDecoration: 'none'}} to={{pathname: `/album/${currentTrack.album.uri.slice(14)}`, state: currentTrack.album.uri.slice(14) }}>
        <span className={(currentTrack.name.length >= 30)? 'playingTrackNameScroll':'playingTrackName'}>{currentTrack.name}</span>
        </Link>
        <div className='trackArtists'>
          {currentTrack.artists.map((artist, index, artists) => 
             <span key={artist.uri}>
             <Link style={{textDecoration: 'none'}} to={{pathname: `/artist/${artist.uri.slice(15)}`, state: artist.uri.slice(15) }}>
                <span className='playingTrackArtist'>{artist.name}</span>
              </Link>
                {(index < artists.length - 1)?
                  <span className='playerPunc'>, </span>
                  :
                  <span></span>
                }
             </span>
            )}
        </div>
        </div>

              
      </div>

      <div id='playFunctions'>
      <div>
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
               setShuffleColour('white')
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
        <div className='circle' style={(shuffling)? {visibility: 'visible'} : {visibility: 'hidden'}}/>
        </div>
      <div className='prevBox' 
           onClick={() => player.previousTrack()}>
        <div className='prevTrackButton'></div>
      </div>
      <div className='playButton' onClick={() => player.togglePlay()}>
      {(paused)?
        <div className='playIcon'></div>
        :
        <div className='pauseIcon'></div>
      }
      </div>
      <div className='nextBox' 
           onClick={() => player.nextTrack()}>
        <div className='nextTrackButton'></div>
      </div>

      <div>
      <svg className='repeatIcon'
          role="img" 
          height="16" 
          width="16" 
          viewBox="0 0 16 16"
          onMouseOver={()=> { 
            if (repeat === 0) {
             setRepeatIconColour('white')
            }}}
          onMouseLeave={()=> {
            if (repeat === 0) {
              setRepeatIconColour('grey')
            }}}
          onClick={()=> {
            console.log("CLICK")
            if (repeat === 0) {
              setRepeat(1)
            }
            else if (repeat === 1) {
              setRepeat(2)
            }
            else if (repeat === 2) {
              setRepeat(0)
              setRepeatIconColour('white')
            }
          }}>
            <path fill={repeatIconColour} d="M5.5 5H10v1.5l3.5-2-3.5-2V4H5.5C3 4 1 6 1 8.5c0 .6.1 1.2.4 1.8l.9-.5C2.1 9.4 2 9 2 8.5 2 6.6 3.6 5 5.5 5zm9.1 1.7l-.9.5c.2.4.3.8.3 1.3 0 1.9-1.6 3.5-3.5 3.5H6v-1.5l-3.5 2 3.5 2V13h4.5C13 13 15 11 15 8.5c0-.6-.1-1.2-.4-1.8z"></path>
            <circle style={(repeat === 2)? {visibility: 'visible'} : {visibility: 'hidden'}}
                    cx="12" cy="6" r="4.5" stroke="#212121" strokeWidth="1" fill="#1ed760"/>
            <text className="repeatOne"
                  style={(repeat === 2)? {visibility: 'visible'} : {visibility: 'hidden'}}
                  x="12" y="6.5" 
                  textAnchor="middle"
                  stroke="#212121"
                  strokeWidth="1px"
                  alignmentBaseline="middle"
             >1
            </text>
      </svg>
       <div className='circle1' style={(repeat === 0)? {visibility: 'hidden'} : {visibility: 'visible'}}/>
      </div>
      </div>

    <div id='player'>
      <div className='playedTime'>
        {(dragging)? 
          toMinsSecs(Math.floor((currentTrack.duration_ms / 100) * (dragPos / bar.offsetWidth) * 100))
        :
          toMinsSecs(counter)}
      </div>
      <div id='playProgressBar' 
           onMouseOver={()=> setBarHover(true)} 
           onMouseLeave={()=> setBarHover(false)} 
           onMouseDown={(e)=> {
             setDragPos(e.screenX - (bar.offsetLeft + playerDiv.offsetLeft))
             console.log(playerDiv.offsetLeft)
             setDragging(true)}}>
            <div className='playProgress' style={(dragging)? {width: dragPos, backgroundColor: '#1ed760'} : {width: percent + '%'}}>
              <div className='drag' 
                   onMouseDown={()=> setDragging(true)}
                   style={(dragging || barHover)? {visibility: 'visible'} : {visibility: 'hidden'}}>
              </div>
            </div>
      </div>
      <div className='playingTimeTotal'>{toMinsSecs(total)}</div>
    </div>

      <svg className='volumeIcon'
           xmlns="http://www.w3.org/2000/svg" 
           width="24" 
           fill="none" 
           height="24" 
           viewBox="0 0 24 24" 
           stroke={volIconColour} 
           strokeWidth="1" 
           strokeLinecap="round" 
           strokeLinejoin="round"
           onMouseOver={()=> setVolIconColour('white')}
           onMouseLeave={()=> setVolIconColour('grey')}
           onClick={()=> {
             if (mute) {
               setMute(false)
               setVol(prevVol)
             }
             else {
               setMute(true)
               setPrevVol(vol)
               setVol(0)
             }
           }}
           >
            <polygon points="11,6 6,9 3,9 3,15 6,15 11,18 11,6"></polygon>
            <path d={volLevel}></path>
                
        </svg>
      <div id='volumeBar'
           onMouseOver={()=> setVolHover(true)} 
           onMouseLeave={()=> setVolHover(false)}  
           onMouseDown={(e)=> {
             if ((e.screenX - volBar.offsetLeft) >= 0 && (e.screenX - volBar.offsetLeft) <= 100) {
               setVol(e.screenX - volBar.offsetLeft)
             }
             setVolDrag(true)}}>
        <div id='volume' style={(volDrag)? {width: vol, backgroundColor: '#1ed760'} : {width: vol}}>
            <div className='drag' 
                 onMouseDown={()=> setVolDrag(true)}
                 style={(volDrag || volHover)? {visibility: 'visible'} : {visibility: 'hidden'}}>
            </div>
        </div>
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