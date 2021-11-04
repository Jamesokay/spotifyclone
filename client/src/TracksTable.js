import { useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import playTrack from './playTrack'

export default function TracksTable({content, page}) {

    const accessToken = useContext(AuthContext)
//    const tableTop = document.getElementById('tableTop')
//    const tableTopEdges = document.getElementsByClassName('empty')
    const [scrolling, setScrolling] = useState(false)



      useEffect(() => {
 //       if (!tableTop) return
 //       if (!tableTopEdges) return

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
      }, [])




    if (page === 'artist') {
        return (
          <div>
            <div id='tableHeader'></div>        
            <table className='trackTable' cellSpacing='0' cellPadding='0'>
            <tbody>
            {content.map(cont =>
              <tr className='trackTableRow' key={cont.id} style={{color: 'white'}}>
                <td className='rowFirst'>
                <span className='tableIndex'>{cont.num}</span>
                <div className='tablePlayIcon'
                onClick={() => playTrack(accessToken, {uris: [cont.uri]})}
                ></div>
                </td>
                <td style={{width: '60px'}}><img className='tableImage' src={cont.trackImage} alt=''/></td>
                <td>{cont.name}</td>
                <td className='rowLast'>{cont.duration}</td>
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
                <td></td>
              </tr>
              {content.map(cont =>
                <tr className='trackTableRow' key={cont.id}>
                <td className='emptyCell'></td>
                  <td className='rowFirst'>
                    <span className='tableIndex'>{cont.num}</span>
                    <div className='tablePlayIcon'
                    onClick={() => playTrack(accessToken, 
                    {context_uri: cont.albUri,
                     offset: { uri: cont.uri }})}></div>
                  </td>
                  <td>
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
                  <td className='rowLast'>{cont.duration}</td>
                  <td className='emptyCell'></td>
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
                <td></td>
              </tr>
              {content.map(cont =>
                <tr className='trackTableRow' key={cont.id}>
                <td className='emptyCell'></td>
                  <td className='rowFirst'>
                    <span className='tableIndex'>{cont.num}</span>
                    <div className='tablePlayIcon'
                    onClick={() => playTrack(accessToken, 
                    {context_uri: cont.context,
                     offset: { uri: cont.uri }})}
                    ></div>
                  </td>
                  <td style={{width: '60px'}}><img className='tableImage' src={cont.trackImage} alt='' /></td>
                  <td style={{width: '505px'}}>
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
                  <td style={{width: '505px'}}><span className='tableLink'>{cont.albumName}</span></td>
                  <td className='rowLast'>{cont.duration}</td>
                  <td className='emptyCell'></td>
                </tr>
              )}
              </tbody>
            </table>
          </div>
        )
    }
    else if (page === 'playlistRecommend') {
      return (
        <table className='trackTable' cellSpacing='0' cellPadding='0'>
        <tbody>
        {content.map(cont =>
        <tr className='trackTableRow' key={cont.id}>
          <td className='rowFirst'>
            <img className='searchTableImage' src={cont.trackImage} alt='' />
            <div className='searchTablePlayIcon'
            onClick={() => playTrack(accessToken, {uris: [cont.uri]})}
            ></div>
          </td>
          <td className='rowSecond'>
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
          <td>
            {cont.albumName}
          </td>

          <td className='rowLast'>
            <div className='addTrack'>
              <span>ADD</span>
            </div>
          </td>
        </tr>
        )}
        </tbody>
      </table>

      )
  }
    else if (page === 'search') {
      return (
       <div>
        <div id='tableHeader'></div>
        <table className='trackTable' cellSpacing='0' cellPadding='0'>
          <tbody>
          {content.map(cont =>
          <tr className='trackTableRow' key={cont.id}>
            <td className='rowFirst'>
              <img className='searchTableImage' src={cont.trackImage} alt='' />
              <div className='searchTablePlayIcon'
              onClick={() => playTrack(accessToken, {uris: [cont.uri]})}
              ></div>
            </td>
            <td className='rowSecond'>
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
            <td className='rowLast'>{cont.duration}</td>
          </tr>
          )}
          </tbody>
        </table>

        </div>
      )
    }
}
