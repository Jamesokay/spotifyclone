import { useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import playTrack from './playTrack'

export default function TracksTable({content, page}) {

    const accessToken = useContext(AuthContext)
    const tableTop = document.getElementById('tableTop')
//    const tableTopEdges = document.getElementsByClassName('empty')
    const [scrolling, setScrolling] = useState(false)



      useEffect(() => {
        if (!tableTop) return
 //       if (!tableTopEdges) return

        let options = {
          root: null,
          rootMargin: '-8.1% 0% 0% 0%',
          threshold: [0, 1]
        }
    
        function navTableHead(entries) {
          if (entries[0].isIntersecting) {
            tableTop.style.backgroundColor = 'transparent'
            setScrolling(false)
            // for (let i = 0; i < 2; i++) {
            //   tableTopEdges[i].style.borderBottom = 'none'
            // }
          }
          else {
            tableTop.style.backgroundColor = '#212121'
            setScrolling(true)
            // for (let i = 0; i < 2; i++) {
            //   tableTopEdges[i].style.borderBottom = '1px solid rgb(105, 105, 105, 0.3)'
            // }
          }
        }
     
          let observer = new IntersectionObserver(navTableHead, options)
          let target = document.getElementById('tableHeader')
          

        observer.observe(target)
      }, [tableTop])




    if (page === 'artist') {
        return (
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
        )
    }
    else if (page === 'album') {
        return (
            <table className='trackTable' cellSpacing='0' cellPadding='0'>
            <thead>
              <tr>
                <th style={{textAlign: 'center'}}>#</th>
                <th>TITLE</th>
                <th>TIME</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td></td>
              </tr>
              {content.map(cont =>
                <tr className='trackTableRow' key={cont.id}>
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
                </tr>
               )}
               </tbody>
            </table>
        )
    }
    else if (page === 'playlist') {
        return (
          <div>
            <div id='tableHeader'></div>
            <table className='trackTable' cellSpacing='0' cellPadding='0'>
              <thead>
                <tr id='tableTop'>
                <th className='empty' style={(scrolling)? {borderBottom: '1px solid rgb(105, 105, 105, 0.3)'} : {borderBottom: 'none'}}></th>
                <th style={{textAlign: 'center'}}>#</th>
                <th>TITLE</th>
                <th></th>
                <th>ALBUM</th>
                <th>TIME</th>
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
      )
    }
}
