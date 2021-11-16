import { useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { PlaylistContext } from './PlaylistContext'
import playTrack from './playTrack'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { PageContext } from './PageContext'
import { TrackContext } from './TrackContext'

export default function TracksTable({content, page }) {

    const accessToken = useContext(AuthContext)
    const history = useHistory()
    const [scrolling, setScrolling] = useState(false)
    const {setNewTrack} = useContext(PlaylistContext)
    const {currentPage} = useContext(PageContext)
    const { nowPlaying } = useContext(TrackContext)
  
      useEffect(() => {
        setNewTrack({})
      }, [setNewTrack])

      useEffect(() => {

        let options = {
          root: null,
          rootMargin: '-8.1% 0% 0% 0%',
          threshold: [0, 1]
        }
    
        function navTableHead(entries) {
          if (entries[0].isIntersecting) {           
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




    if (page === 'artist') {
        return (
          <div>
            <div id='tableHeader'></div>        
            <table className='trackTableArtist' cellSpacing='0' cellPadding='0'>
            <tbody>
            {content.map(cont =>
              <tr className='trackTableRow' key={cont.id} style={{color: 'white'}}>
              
                <td className='rowFirst tdReg'>
                <span className='tableIndex'>{cont.num}</span>
                <div className='tablePlayIcon'
                onClick={() => playTrack(accessToken, {uris: [cont.uri]})}
                ></div>
                </td>
                <td className='tdReg'><img className='tableImage' src={cont.trackImage} alt=''/></td>
                <td className='tdReg'>{cont.name}</td>
                <td className='rowLast tdReg'>{cont.duration}</td>
                
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
            <table className='trackTable' cellSpacing='0' cellPadding='0'>
            <thead>
              <tr id='tableTop' style={(scrolling)? {backgroundColor:'#212121'} : {backgroundColor: 'transparent'}}>
                <th className='empty' style={(scrolling)? {borderBottom: '1px solid rgb(105, 105, 105, 0.3)'} : {borderBottom: 'none'}}></th>
                <th style={{textAlign: 'center'}}>#</th>
                <th>TITLE</th>
                <th>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M7.999 3H6.999V7V8H7.999H9.999V7H7.999V3ZM7.5 0C3.358 0 0 3.358 0 7.5C0 11.642 3.358 15 7.5 15C11.642 15 15 11.642 15 7.5C15 3.358 11.642 0 7.5 0ZM7.5 14C3.916 14 1 11.084 1 7.5C1 3.916 3.916 1 7.5 1C11.084 1 14 3.916 14 7.5C14 11.084 11.084 14 7.5 14Z" fill="currentColor"></path>
                  </svg>
                </th>
                <th className='empty' style={(scrolling)? {borderBottom: '1px solid rgb(105, 105, 105, 0.3)'} : {borderBottom: 'none'}}></th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td className='tdReg'></td>
              </tr>            
              {content.map(cont =>
                <tr className='trackTableRow' key={cont.id}>
                <td className='emptyCell tdReg'></td>
                {(cont.albUri === nowPlaying.contextUri && cont.uri === nowPlaying.trackUri && !nowPlaying.isPaused)?
                  <td className='rowFirst tdReg'>
                    <div className='tablePlayingBox'>
                      <div className='tablePlayingBar1'/>
                      <div className='tablePlayingBar2'/>
                      <div className='tablePlayingBar3'/>
                      <div className='tablePlayingBar4'/>
                    </div>
                  </td>
                  :
                  <td className='rowFirst tdReg'>
                    <span className='tableIndex'>{cont.num}</span>
                    <div className='tablePlayIcon'
                    onClick={() => playTrack(accessToken, 
                    {context_uri: cont.albUri,
                     offset: { uri: cont.uri }})}></div>
                  </td>
                 } 
                  <td className='tdReg'>
                    <p className='tableTrackName' 
                       style={(cont.albUri === nowPlaying.contextUri && cont.uri === nowPlaying.trackUri)? {color: '#1ed760'} : {color: 'white'}}>{cont.name}</p>                     
                      {cont.artists.map((artist, index, artists) => 
                      <span key={artist.id} >                 
                        <span className='tableLink'
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
                  <td className='rowLast tdReg'>{cont.duration}</td>
                  <td className='emptyCell tdReg'></td>
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
            <table className='trackTable' cellSpacing='0' cellPadding='0'>
              <thead>
                <tr id='tableTop' style={(scrolling)? {backgroundColor:'#212121'} : {backgroundColor: 'transparent'}}>
                <th className='empty' style={(scrolling)? {borderBottom: '1px solid rgb(105, 105, 105, 0.3)'} : {borderBottom: 'none'}}></th>
                <th style={{textAlign: 'center'}}>#</th>
                <th>TITLE</th>
                <th></th>
                <th>ALBUM</th>
                <th>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M7.999 3H6.999V7V8H7.999H9.999V7H7.999V3ZM7.5 0C3.358 0 0 3.358 0 7.5C0 11.642 3.358 15 7.5 15C11.642 15 15 11.642 15 7.5C15 3.358 11.642 0 7.5 0ZM7.5 14C3.916 14 1 11.084 1 7.5C1 3.916 3.916 1 7.5 1C11.084 1 14 3.916 14 7.5C14 11.084 11.084 14 7.5 14Z" fill="currentColor"></path>
                </svg>
                </th>
                <th className='empty' style={(scrolling)? {borderBottom: '1px solid rgb(105, 105, 105, 0.3)'} : {borderBottom: 'none'}}></th>
                </tr>
              </thead>
              <tbody>
              <tr>
                <td className='tdReg'></td>
              </tr>
              {content.map(cont =>
                <tr className='trackTableRow' key={cont.id}>
                <td className='emptyCell tdReg'></td>
                {(cont.context === nowPlaying.contextUri && cont.name === nowPlaying.trackName && !nowPlaying.isPaused)?
                  <td className='rowFirst tdReg'>
                    <div className='tablePlayingBox'>
                      <div className='tablePlayingBar1'/>
                      <div className='tablePlayingBar2'/>
                      <div className='tablePlayingBar3'/>
                      <div className='tablePlayingBar4'/>
                    </div>
                  </td>
                  :
                  <td className='rowFirst tdReg'>
                    <span className='tableIndex'>{cont.num}</span>
                    <div className='tablePlayIcon'
                    onClick={() => 
                      playTrack(accessToken, 
                    {context_uri: cont.context,
                     offset: { uri: cont.uri }})}
                    ></div>
                  </td>
                }
                  <td className='tableImgCol tdReg'><img className='tableImage' src={cont.trackImage} alt='' /></td>
                  <td className='tdReg'>
                    <p className='tableTrackName'
                       style={(cont.context === nowPlaying.contextUri && cont.name === nowPlaying.trackName)? {color: '#1ed760'} : {color: 'white'}}>{cont.name}</p> 
                    {cont.artists.map((artist, index, artists) => 
                      <span key={artist.id} >                 
                        <span className='tableLink'
                              onClick={(e) => {
                                e.preventDefault()
                                history.push({
                                  pathname: `/artist/${artist.id}`,
                                  search: '', 
                                  state: artist.id
                                })
                              }}>{artist.name}</span>
                        {(index < artists.length - 1)?
                        <span>, </span>
                        :
                        <span></span>
                        }
                      </span>
                      )}
                  </td>
                  <td className='tdReg' style={{width: '505px'}}>
                    <span className='tableLink'
                          onClick={(e) => {
                             e.preventDefault()
                             history.push({
                               pathname: `/album/${cont.albumId}`,
                               search: '', 
                               state: cont.albumId
                             })
                          }}>{cont.albumName}</span>
                  </td>
                  <td className='rowLast tdReg'>{cont.duration}</td>
                  <td className='emptyCell tdReg'></td>
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
        <table className='trackTable' cellSpacing='0' cellPadding='0'>
        <thead>
          <tr>
            <th className='empty'></th>
            <th className='blankHead'></th>
            <th className='blankHead'></th>
            <th className='blankHead'></th>
            <th className='blankHead'></th>
            <th className='empty'></th>
          </tr>
        </thead>
        <tbody>
        {content.slice(0, 10).map(cont =>
        <tr className='trackTableRow' key={cont.id}>
        <td className='emptyCell tdReg'></td>
          <td className='rowFirst tdReg'>
            <img className='searchTableImage' src={cont.trackImage} alt='' />
            <div className='searchTablePlayIcon'
            onClick={() => playTrack(accessToken, {uris: [cont.uri]})}
            ></div>
          </td>
          <td className='rowSecond tdReg'>
          <p className='tableTrackName'>{cont.name}</p>
          {cont.artists.map((artist, index, artists) => 
                <span key={artist.id} >                 
                <span className='tableLink'>{artist.name}</span>
                {(index < artists.length - 1)?
                <span>, </span>
                :
                <span></span>
                }
                </span>
          )}
          </td>
          <td className='tdReg'>
            {cont.albumName}
          </td>

          <td className='rowLast tdReg'>
            <div className='addTrack' onClick={() => addTrack({uris: [cont.uri]}, cont)}>
              <span>ADD</span>
            </div>
          </td>
          <td className='emptyCell tdReg'></td>
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
        <table className='trackTableSearch' cellSpacing='0' cellPadding='3'>
          <tbody>
          {content.map(cont =>
          <tr className='trackTableRow' key={cont.id}>
            <td className='rowFirst tdSmall'>
              <img className='searchTableImage' src={cont.trackImage} alt='' />
              <div className='searchTablePlayIcon'
              onClick={() => playTrack(accessToken, {uris: [cont.uri]})}
              ></div>
            </td>
            <td className='rowSecondSearch tdSmall'>
            <p className='tableTrackName'>{cont.name}</p>
            {cont.artists.map((artist, index, artists) => 
                  <span key={artist.id} >                 
                  <span className='tableLink'
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
            <td className='rowLast tdSmall'>{cont.duration}</td>
          </tr>
          )}
          </tbody>
        </table>

        </div>
      )
    }
}
