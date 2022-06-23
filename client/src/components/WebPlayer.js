import { useContext, useState, useEffect } from 'react'
import useInterval from '../hooks/useInterval'
import toMinsSecs from '../utils/toMinsSecs'
import { putWithToken } from '../utils/putWithToken'
import { TrackContext } from '../contexts'
import { useSelector } from 'react-redux'
import { ShuffleIcon } from '../icons/icons'
import PlayingTrack from './PlayingTrack'

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
  const [paused, setPaused] = useState(false)
  const accessToken = useSelector(state => state.user.token)
  const [devId, setDevId] = useState("")
  const [ready, setReady] = useState(false)
  const [vol, setVol] = useState(0)
  const [prevVol, setPrevVol] = useState(0)
  const [volDrag, setVolDrag] = useState(false)
  const [volLevel, setVolLevel] = useState("")
  const [mute, setMute] = useState(false)
  const [counter, setCounter] = useState(0)
  var total = currentTrack.duration_ms
  var percent = ((counter/total) * 100).toFixed(2)
  var playerDiv = document.getElementById('player')
  var bar = document.getElementById('playProgressBar')
  var volBar = document.getElementById('volumeBar')
  const [dragging, setDragging] = useState(false)
  const [dragPos, setDragPos] = useState(0)
  const [shuffling, setShuffling] = useState(false)
  const [repeat, setRepeat] = useState(0)
  const { setNowPlaying } = useContext(TrackContext)
 
  useEffect(() => {
    if (!accessToken) return
    const script = document.createElement("script")
    script.src = "https://sdk.scdn.co/spotify-player.js"
    script.async = true
    document.body.appendChild(script)

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({ name: 'Web Playback SDK', getOAuthToken: cb => { cb(accessToken); }, volume: 0.5 })
      setPlayer(player)

      player.addListener('ready', ({ device_id }) => {
        setDevId(device_id)
        console.log('Ready with Device ID', device_id)
      })

      player.addListener('not_ready', ({ device_id }) => { console.log('Device ID has gone offline', device_id) })
   
      player.addListener('player_state_changed', ( state => {
        if (!state) { return }
        console.log('player thinks repeat mode is ' + state.repeat_mode)
        setCurrentTrack(state.track_window.current_track);
        setShuffling(state.shuffle)
        setCounter(state.position)
        setPaused(state.paused)
      }))
      player.connect()
    }
  }, [accessToken])

  useEffect(() => {
    if (!accessToken) return
    if (!devId) return
    try {
      await putWithToken('https://api.spotify.com/v1/me/player/', accessToken, { device_ids: [devId] })
      setReady(true)
    } catch (err) { console.error(err) }
  }, [accessToken, devId])

  useEffect(() => {
    if (!accessToken) return
    const initializeRepeat = async () => {
      try { await putWithToken(`https://api.spotify.com/v1/me/player/repeat?state=off`, accessToken) } 
      catch (err) { console.error(err) }
    }
    initializeRepeat()
  }, [accessToken])

  useEffect(() => {
    if (!ready) return
    if (!player) return
    player.getVolume().then(vol => { setVol(vol * 100) })
  }, [ready, player])

  useInterval(() => {
    if (ready && !paused) { setCounter(counter + 1000) }
  }, 1000)

  useEffect(() => {
    if (!ready) return
    if (!player) return 
    player.setVolume(vol / 100)
  }, [ready, player, vol])

  useEffect(() => {
    if (vol === 0) { setVolLevel("M14 9.5 L19 14.5 M14 14.5 L19 9.5") }
    else if (vol < 25) { setVolLevel("M14 9.5 a 5 5 0 0 1 0 5") }
    else if (vol > 25 && vol < 75) { setVolLevel("M14 8.8 a 5 5 0 0 1 0 7") }
    else if (vol > 75) { setVolLevel("M17 6 a10 10 0 0 1 0 12 M14 9 a4 4 0 0 1 0 6") }
  }, [vol])

  useEffect(() => {
    if (!player) return
    if (!currentTrack.name) return
    player.getCurrentState()
    .then(res => {
      setNowPlaying({contextUri: res.context.uri, trackUri: res.track_window.current_track.uri, trackName: res.track_window.current_track.name, isPaused: paused})
    }).catch(error => { console.log(error) })
  }, [player, currentTrack.name, setNowPlaying, paused])

  // FUNCTIONS

  const toggleShuffle = async (bool) => {
    setShuffling(bool)
    try { await putWithToken(`https://api.spotify.com/v1/me/player/shuffle?state=${bool}`, accessToken) } 
    catch (err) { console.error(err) }
  }

  const setNewPlayback = async (progress) => {
    let newPosition = Math.floor((currentTrack.duration_ms / 100) * progress)
    setCounter(newPosition)
    try { await putWithToken(`https://api.spotify.com/v1/me/player/seek?position_ms=${newPosition}`, accessToken) } 
    catch (err) { console.error(err) }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    if (dragging) {
      if (e.screenX < (bar.offsetLeft + playerDiv.offsetLeft)) { setDragPos(0) }
      else if (e.screenX > (bar.offsetLeft + bar.offsetWidth + playerDiv.offsetLeft)) { setDragPos(bar.offsetWidth) }
      else { setDragPos(e.screenX - (bar.offsetLeft + playerDiv.offsetLeft)) }
    }
    else if (volDrag) {
      if (e.screenX < volBar.offsetLeft) { setVol(0) }
      else if (e.screenX > (volBar.offsetLeft + volBar.offsetWidth)) { setVol(100) }
      else { setVol(e.screenX - volBar.offsetLeft) }
    }
    else return
  }

  const handleNewDragPosition = (e) => {
    e.preventDefault()
    if (dragging) {
      setDragging(false)
      if (e.screenX < (bar.offsetLeft + playerDiv.offsetLeft)) { setNewPlayback(0) }
      else if (e.screenX > (bar.offsetLeft + bar.offsetWidth + playerDiv.offsetLeft)) { setNewPlayback(100) }
      else { setNewPlayback(Math.floor(((e.screenX - (bar.offsetLeft + playerDiv.offsetLeft)) / bar.offsetWidth) * 100)) }
    }
    else if (volDrag) {
      setVolDrag(false)
      if (e.screenX < volBar.offsetLeft) { setVol(0) }
      else if (e.screenX > (volBar.offsetLeft + volBar.offsetWidth)) { setVol(100) }
      else { setVol(e.screenX - volBar.offsetLeft) }
    }
    else return
  }

 if (currentTrack.name) {
  return (
    <div className='playBar' onMouseMove={(e)=> handleDrag(e)} onMouseUp={(e) => handleNewDragPosition(e)}>
      <PlayingTrack track={currentTrack} />


      <div id='playFunctions'>
        <ShuffleIcon state={shuffling} updateState={toggleShuffle} />
        <div className='prevBox' onClick={() => player.previousTrack()}>
          <div className='prevTrackButton' />
        </div>
        <div className='playButton' onClick={() => player.togglePlay()}>
          <div className={paused? 'playIcon' : 'pauseIcon'} /> 
        </div>
        <div className='nextBox' onClick={() => player.nextTrack()}>
          <div className='nextTrackButton' />
        </div>
      <div>
      <svg className='repeat' role="img" height="16" width="16" viewBox="0 0 16 16"
          onClick={()=> {
            if (repeat === 0) { setRepeat(1) }
            else if (repeat === 1) { setRepeat(2) }
            else if (repeat === 2) { setRepeat(0) }}}>
            <path className={repeat >= 1? 'repeatActive' : 'repeatIcon'} d="M5.5 5H10v1.5l3.5-2-3.5-2V4H5.5C3 4 1 6 1 8.5c0 .6.1 1.2.4 1.8l.9-.5C2.1 9.4 2 9 2 8.5 2 6.6 3.6 5 5.5 5zm9.1 1.7l-.9.5c.2.4.3.8.3 1.3 0 1.9-1.6 3.5-3.5 3.5H6v-1.5l-3.5 2 3.5 2V13h4.5C13 13 15 11 15 8.5c0-.6-.1-1.2-.4-1.8z"></path>
            <circle style={repeat === 2? {visibility: 'visible'} : {visibility: 'hidden'}} cx="12" cy="6" r="4.5" stroke="#212121" strokeWidth="1" fill="#1ed760"/>
            <text className="repeatOne" x="12" y="6.5" textAnchor="middle" stroke="#212121" strokeWidth="1px" alignmentBaseline="middle"
                  style={(repeat === 2)? {visibility: 'visible'} : {visibility: 'hidden'}}
             >1
            </text>
      </svg>
       <div className='circle1' style={(repeat === 0)? {visibility: 'hidden'} : {visibility: 'visible'}}/>
      </div>
      </div>

    <div id='player'>
      <div className='playedTime'>{dragging? toMinsSecs(Math.floor((currentTrack.duration_ms / 100) * (dragPos / bar.offsetWidth) * 100)) : toMinsSecs(counter)}</div>
      <div id='playProgressBar'
           onMouseDown={(e)=> {
             setDragPos(e.screenX - (bar.offsetLeft + playerDiv.offsetLeft))
             setDragging(true)}}>
            <div className='playProgress' style={(dragging)? {width: dragPos, backgroundColor: '#1ed760'} : {width: percent + '%'}}>
              <div className='drag' onMouseDown={()=> setDragging(true)} style={dragging? {visibility: 'visible'} : {}} />
            </div>
      </div>
      <div className='playingTimeTotal'>{toMinsSecs(total)}</div>
    </div>

      <svg className='volumeIcon' width="24" fill="none" height="24" viewBox="0 0 24 24" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
           onClick={()=> {
             if (mute) {
               setMute(false)
               setVol(prevVol)
             } else {
               setMute(true)
               setPrevVol(vol)
               setVol(0)
             }}}
           >
            <polygon points="11,6 6,9 3,9 3,15 6,15 11,18 11,6"></polygon>
            <path d={volLevel}></path>            
        </svg>
      <div id='volumeBar'
           onMouseDown={(e)=> {
             if ((e.screenX - volBar.offsetLeft) >= 0 && (e.screenX - volBar.offsetLeft) <= 100) { setVol(e.screenX - volBar.offsetLeft) }
             setVolDrag(true)}}>
        <div id='volume' style={(volDrag)? {width: vol, backgroundColor: '#1ed760'} : {width: vol}}>
            <div className='drag' onMouseDown={()=> setVolDrag(true)} style={volDrag? {visibility: 'visible'} : {}}>
            </div>
        </div>
      </div>
    </div>
    )
    }
    else {
      return (
        <div className='playBar' />
      )
    }
}