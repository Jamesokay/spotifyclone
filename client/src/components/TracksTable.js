import { useContext, useEffect, useState } from 'react'
import { PlaylistContext, PageContext, TrackContext, RightClickContext, NotificationContext, SideBarWidthContext } from '../contexts'
import { TablePlayingIcon, TableHeartOutlineIcon, TableHeartFilledIcon, ClockIcon, EllipsisIcon } from '../icons/icons'
import useViewport from '../hooks/useViewPort'
import playTrack from '../utils/playTrack'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'

export default function TracksTable({content, page, trackDepth }) {

    const accessToken = useSelector(state => state.user.token)
    const history = useHistory()
    const [scrolling, setScrolling] = useState(false)
    const {setNewTrack} = useContext(PlaylistContext)
    const {currentPage} = useContext(PageContext)
    const { nowPlaying } = useContext(TrackContext)
    const [likedTracks, setLikedTracks] = useState([])
    const { rightClick, setRightClick } = useContext(RightClickContext)
    const [preventProp, setPreventProp] = useState(false)
    const { setNotification } = useContext(NotificationContext)
    const { width } = useViewport()
    const { currentWidth } = useContext(SideBarWidthContext)
    const breakPoint = 800


    function getLikedIds(arr) {
      let newArr = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].saved) {
          newArr.push(arr[i].id)
        }
      }
      return newArr
    }
     
    useEffect(() => {
      if (content.length === 0) return
      setLikedTracks(getLikedIds(content))

      return function cleanUp() {
        setLikedTracks([])
      }
    }, [content])


      useEffect(() => {

        let options = {
          root: null,
          rootMargin: '-8.1% 0% 0% 0%',
          threshold: [0, 1]
        }
    
        function navTableHead(entries) {
          if (entries[0].intersectionRatio > 0) {           
            setScrolling(false)
          }
          else {           
            setScrolling(true)
          }
        }
     
          let observer = new IntersectionObserver(navTableHead, options)
          let target = document.getElementById('tableHeader')
          

        observer.observe(target)

        return function cleanUp() {
          observer.disconnect()
        }
      }, [])

      function addTrack(data, trackObj) {
        setNotification('Added to playlist')
        let playlistId = currentPage.pageUri.slice(17)
        const options = {
          url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              },
          data
          }
      
        axios(options)
        .then(response => {
           console.log(response)
           setNewTrack(trackObj)
    
        })
        .catch(error => {
          console.log(error)
        })
      }


     function handleLike(id) {

      if (likedTracks.includes(id)) {
        setLikedTracks(likedTracks => likedTracks.filter(item => item !== id))
        setNotification({text: 'Removed from your Liked Songs',
                       action: 'unlike' + id})
        const options = {
          url: `https://api.spotify.com/v1/me/tracks?ids=${id}`,
          method: 'DELETE',
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
      else {
        setLikedTracks(likedTracks => [...likedTracks, id])
        setNotification({text: 'Added to your Liked Songs',
                         action: 'like' + id})
        const options = {
            url: `https://api.spotify.com/v1/me/tracks?ids=${id}`,
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
   }


    if (page === 'artist') {
        return (
          <div>
            <div id='tableHeader' />        
            <table className='artistTable' cellSpacing='0' cellPadding='0'>
            <tbody>
            {content.slice(0,trackDepth).map(cont =>
            <tr className='trackRow' key={cont.id} style={{color: 'white'}}>              
              {(cont.uri === nowPlaying.trackUri && !nowPlaying.isPaused)?
                <td className='trackCell firstCell'>
                  <TablePlayingIcon />
                </td>
              :
              <td className='trackCell firstCell'>
                <span className='trackIndex'>{cont.num}</span>
                <div className='trackTablePlayIcon'
                     style={(rightClick.id === cont.id)? {visibility: 'visible'} : {}}
                     onClick={() => playTrack(accessToken, {context_uri: cont.albumUri, offset: { uri: cont.uri }})} />
              </td>
              } 
              <td className='trackCell'>
                <div style={{display: 'inline-flex', alignItems: 'center'}}>
                  <img className='trackImage' src={cont.trackImage} alt=''/>
                  <span style={(cont.uri === nowPlaying.trackUri)? {color: '#1ed760'} : {color: 'white'}}>{cont.name}</span>
                </div>
              </td>
              <td className='trackCell lastCell'>
                <div className='trackOptionsFlex'>
                  <span onClick={() => handleLike(cont.id)}> 
                    {likedTracks.includes(cont.id)? <TableHeartFilledIcon /> : <TableHeartOutlineIcon />}
                  </span> 
                  <span>{cont.duration}</span>
                  <EllipsisIcon />
                </div>
              </td>            
            </tr>
            )}
            </tbody>
            </table>
          </div>
        )
    }
    else if (page === 'album') {
        return (
          <div>
            <div id='tableHeader'></div>
            <table className='tableReg' cellSpacing='0' cellPadding='0'>
              <thead>
                <tr id='tableTop' style={(scrolling)? {backgroundColor:'rgb(24, 24, 24)'} : {backgroundColor: 'transparent'}}>
                  <th className='empty' style={(scrolling)? {borderBottom: '1px solid rgb(105, 105, 105, 0.3)'} : {borderBottom: 'none'}}></th>
                  <th className='trackHead'>#</th>
                  <th>TITLE</th>
                  <th className='trackHead trackFunctions'>
                    <ClockIcon />
                  </th>
                  <th className='empty' style={(scrolling)? {borderBottom: '1px solid rgb(105, 105, 105, 0.3)'} : {borderBottom: 'none'}}></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{height: '15px'}}></td>
                </tr>            
                {content.map(cont =>
                <tr className='trackRow' key={cont.id}
                    onContextMenu={() => {                  
                      if (!preventProp) {
                        setRightClick({id: cont.id, type: 'track'})
                      }}}
                    style={(rightClick.id === cont.id)? {background: 'grey'} : {}} >
                  <td className='emptyCell' style={((width - currentWidth) <= breakPoint)? {width: '1.125vw', minWidth: '16px'} : {}} />
                  {(cont.albumUri === nowPlaying.contextUri && cont.uri === nowPlaying.trackUri && !nowPlaying.isPaused)?
                  <td className='trackCell firstCell'>
                    <TablePlayingIcon />
                  </td>
                  :
                  <td className='trackCell firstCell'>
                    <span className='trackIndex'>{cont.num}</span>
                    <div className='trackTablePlayIcon'
                         style={(rightClick.id === cont.id)? {visibility: 'visible'} : {}}
                         onClick={() => playTrack(accessToken, {context_uri: cont.albumUri, offset: { uri: cont.uri }})} />
                  </td>
                  } 
                  <td className='trackCell'>
                    <p className='trackName' 
                       style={(cont.albumUri === nowPlaying.contextUri && cont.uri === nowPlaying.trackUri)? {color: '#1ed760'} : {color: 'white'}}>{cont.name}</p>                     
                    {cont.artists.map((artist, index, artists) => 
                    <span key={artist.id}>                 
                      <span className='trackLink'
                            style={(rightClick.id === cont.id)? {color: 'white', textDecoration: 'underline'} : {}}
                            onMouseEnter={() => setPreventProp(true)}
                            onMouseLeave={() => setPreventProp(false)}
                            onContextMenu={() => setRightClick({id: cont.id, type: 'artist'})}
                            onClick={(e) => {
                              e.preventDefault()
                              history.push({
                                  pathname: `/artist/${artist.id}`,
                                  search: '', 
                                  state: artist.id
                              })}}
                      >{artist.name}</span>
                      {(index < artists.length - 1)?
                      <span>, </span>
                      :
                      <></>
                      }
                    </span>
                    )}               
                  </td>             
                  <td className='trackCell lastCell'>
                    <div className='trackOptionsFlex'>
                      <span onClick={() => handleLike(cont.id)}> 
                      {likedTracks.includes(cont.id)? <TableHeartFilledIcon /> : <TableHeartOutlineIcon />}
                      </span> 
                      <span>{cont.duration}</span>
                      <EllipsisIcon />
                    </div>
                  </td>
                  <td className='emptyCell' />
                </tr>
               )}
              </tbody>
            </table>
          </div>
        )
    }


    else if (page === 'playlist') {
        return (
          <div>
            <div id='tableHeader'></div>
            <table className='tableReg' cellSpacing='0' cellPadding='0'>
              <thead>
                <tr id='tableTop' style={(scrolling)? {backgroundColor:'rgb(24, 24, 24)'} : {backgroundColor: 'transparent'}}>
                  <th className='empty' style={(scrolling)? {borderBottom: '1px solid rgb(105, 105, 105, 0.3)'} : {borderBottom: 'none'}}></th>
                  <th className='trackHead'>#</th>
                  <th style={{width: '40%'}}>TITLE</th>           
                  <th>ALBUM</th>
                  <th className='trackHead trackFunctions'>
                    <ClockIcon />
                  </th>
                  <th className='empty' style={(scrolling)? {borderBottom: '1px solid rgb(105, 105, 105, 0.3)'} : {borderBottom: 'none'}}></th>
                </tr>
              </thead>
              <tbody>
              <tr>
                <td style={{height: '15px'}}></td>
              </tr>
              {content.map(cont =>
                <tr className='trackRow' 
                    onContextMenu={() => {
                      if (!preventProp) {
                        setRightClick({id: cont.id, type: 'track'})
                      }}}
                    style={(rightClick.id === cont.id)? {background: 'grey'} : {}} 
                    key={cont.id}
                    >
                <td className='emptyCell' style={((width - currentWidth) <= breakPoint)? {width: '1.125vw', minWidth: '16px'} : {}} />
                {(cont.context === nowPlaying.contextUri && cont.name === nowPlaying.trackName && !nowPlaying.isPaused)?
                  <td className='trackCell firstCell'>
                    <TablePlayingIcon />
                  </td>
                  :
                  <td className='trackCell firstCell'>
                    <span className='trackIndex'>{cont.num}</span>
                    <div className='trackTablePlayIcon'
                    style={(rightClick.id === cont.id)? {visibility: 'visible'} : {}}
                    onClick={() => 
                      playTrack(accessToken, 
                    {context_uri: cont.context,
                     offset: { uri: cont.uri }})}
                    ></div>
                  </td>
                }       
                  <td className='trackCell'>
                    <div className='trackDetails'>
                      <img className='trackImage' src={cont.trackImage} alt='' />
                      <div className='trackText'>
                        <p className='trackName'
                           style={(cont.context === nowPlaying.contextUri && cont.name === nowPlaying.trackName)? {color: '#1ed760'} : {color: 'white'}}>{cont.name}</p> 
                        {cont.artists.map((artist, index, artists) => 
                        <span key={artist.id}>                 
                          <span className='trackLink'
                                style={(rightClick.id === cont.id)? {color: 'white', textDecoration: 'underline'} : {}}
                                onMouseEnter={() => setPreventProp(true)}
                                onMouseLeave={() => setPreventProp(false)}
                                onContextMenu={() => setRightClick({id: cont.id, type: 'artist'})}
                                onClick={(e) => {
                                  e.preventDefault()
                                  history.push({
                                  pathname: `/artist/${artist.id}`,
                                  search: '', 
                                  state: artist.id
                                  })}}
                          >{artist.name}</span>
                          {(index < artists.length - 1)?
                          <span>, </span>
                          :
                          <span></span>
                          }
                        </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className='trackCell'>
                    <div className='trackText'>
                      <span className='trackLink'
                            style={(rightClick.id === cont.id)? {color: 'white', textDecoration: 'underline'} : {}}
                            onMouseEnter={() => setPreventProp(true)}
                            onMouseLeave={() => setPreventProp(false)}
                            onContextMenu={() => setRightClick({id: cont.id, type: 'album'})}
                            onClick={() => {        
                             history.push({
                               pathname: `/album/${cont.albumId}`,
                               search: '', 
                               state: cont.albumId
                             })}}
                      >{cont.albumName}</span>
                    </div>
                  </td>
                  <td className='trackCell lastCell'>
                    <div className='trackOptionsFlex'>
                      <span onClick={() => handleLike(cont.id)}> 
                        {likedTracks.includes(cont.id)? <TableHeartFilledIcon /> : <TableHeartOutlineIcon />}
                      </span> 
                      <span>{cont.duration}</span>
                      <EllipsisIcon />
                    </div>   
                  </td>
                  <td className='emptyCell' />
                </tr>
              )}
              </tbody>
            </table>
          </div>
        )
    }


    else if (page === 'playlistRecommend') {
      return (
        <div>
        <div id='tableHeader'></div>
        <table className='tableReg' cellSpacing='0' cellPadding='0'>
        <tbody>
        {content.slice(0, 10).map(cont =>
        <tr className='trackRow' key={cont.id}
            onContextMenu={() => {
              if (!preventProp) {
                setRightClick({id: cont.id, type: 'track'})
              }}}
            style={(rightClick.id === cont.id)? {background: 'grey'} : {}}>
        <td className='emptyCell'></td>
          <td className='trackCell firstCell'>
            <img className='searchTableTrackImage' src={cont.trackImage} alt='' />
            <div className='searchTableTrackPlayIcon'
                 style={(rightClick.id === cont.id)? {visibility: 'visible'} : {}}
                 onClick={() => playTrack(accessToken, {uris: [cont.uri]})}
            ></div>
          </td>
          <td className='trackCell'>
            <p className='trackName'>{cont.name}</p>
            {cont.artists.map((artist, index, artists) => 
              <span key={artist.id}>                 
                <span className='trackLink'
                      style={(rightClick.id === cont.id)? {color: 'white', textDecoration: 'underline'} : {}}
                      onMouseEnter={() => setPreventProp(true)}
                      onMouseLeave={() => setPreventProp(false)}
                      onContextMenu={() => setRightClick({id: cont.id, type: 'artist'})}>{artist.name}</span>
                {(index < artists.length - 1)?
                <span>, </span>
                :
                <></>
                }
              </span>
          )}
          </td>
          <td className='trackCell'>
            <span className='trackLink'
                  style={(rightClick.id === cont.id)? {color: 'white', textDecoration: 'underline'} : {}}
                  onMouseEnter={() => setPreventProp(true)}
                  onMouseLeave={() => setPreventProp(false)}
                  onContextMenu={() => setRightClick({id: cont.id, type: 'album'})}
            >{cont.albumName}</span>
          </td>
          <td className='trackCell lastCell'>
            <div className='addTrack' onClick={() => addTrack({uris: [cont.uri]}, cont)}>
              <span>ADD</span>
            </div>
          </td>
          <td className='emptyCell'></td>
        </tr>
        )}
        </tbody>
      </table>
      </div>
      )
    }

    
    else if (page === 'search') {
      return (
       <div>
        <div id='tableHeader'></div>
        <table className='searchTable' cellSpacing='0' cellPadding='0'>
          <tbody>
          {content.map(cont =>
          <tr className='trackRow' key={cont.id}
              onContextMenu={() => {
                if (!preventProp) {
                  setRightClick({id: cont.id, type: 'track'})
                }}}
              style={(rightClick.id === cont.id)? {background: 'grey'} : {}}>
            <td className='trackCell firstCell'>
              <img className='searchTableTrackImage' src={cont.trackImage} alt='' />
              <div className='searchTableTrackPlayIcon'
                   style={(rightClick.id === cont.id)? {visibility: 'visible'} : {}}
                   onClick={() => playTrack(accessToken, {uris: [cont.uri]})}
              ></div>
            </td>
            <td className='trackCell'>
            <p className='trackName'>{cont.name}</p>
            {cont.artists.map((artist, index, artists) => 
                  <span key={artist.id}>                 
                  <span className='trackLink'
                        style={(rightClick.id === cont.id)? {color: 'white', textDecoration: 'underline'} : {}}
                        onMouseEnter={() => setPreventProp(true)}
                        onMouseLeave={() => setPreventProp(false)}
                        onContextMenu={() => setRightClick({id: cont.id, type: 'artist'})}
                        onClick={(e) => {
                             e.preventDefault()
                             history.push({
                               pathname: `/artist/${artist.id}`,
                               search: '', 
                               state: artist.id
                             })
                        }}
                  >{artist.name}</span>
                  {(index < artists.length - 1)?
                  <span>, </span>
                  :
                  <span></span>
                  }
                  </span>
            )}
            </td>
            <td className='trackCell lastCell'>
              <div className='trackOptionsFlex'>
                <span onClick={() => handleLike(cont.id)}> 
                  {likedTracks.includes(cont.id)? <TableHeartFilledIcon /> : <TableHeartOutlineIcon />}
                </span> 
                <span>{cont.duration}</span>
                <EllipsisIcon />
              </div>  
            </td>
          </tr>
          )}
          </tbody>
        </table>

        </div>
      )
    }
}
