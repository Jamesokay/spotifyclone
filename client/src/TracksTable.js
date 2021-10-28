import { useContext } from 'react'
// import { TrackContext } from './TrackContext'
import { AuthContext } from './AuthContext'
import playTrack from './playTrack'

export default function TracksTable({content, dispatch, page}) {

//    const testContextFunc = useContext(TrackContext)
    const accessToken = useContext(AuthContext)

    // function trackChange(trackUri, albumUri) {
          
    //   let data = {
    //     context_uri: albumUri,
    //     offset: { uri: trackUri }
    //   }

    //       const options = {
    //           url: 'https://api.spotify.com/v1/me/player/play',
    //           method: 'PUT',
    //           headers: {
    //               'Authorization': `Bearer ${accessToken}`,
    //               'Content-Type': 'application/json',
    //           },
    //           data
    //       }

    //       console.log(options)

    //       axios(options)
    //       .then(response => {
    //         console.log(response)
    //       })
    //       .catch(error => {
    //         console.log(error)
    //       })
 
    // }

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
                        <span className='tableLink' onClick={() => pageChange('artist', artist.id)}>{artist.name}</span>
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
            <table className='trackTable' cellSpacing='0' cellPadding='0'>
              <thead>
                <tr>
                <th style={{textAlign: 'center'}}>#</th>
                <th>TITLE</th>
                <th></th>
                <th>ALBUM</th>
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
                    {context_uri: cont.context,
                     offset: { uri: cont.uri }})}
                    ></div>
                  </td>
                  <td style={{width: '60px'}}><img className='tableImage' src={cont.trackImage} alt='' /></td>
                  <td style={{width: '505px'}}>
                    <p className='tableTrackName'>{cont.name}</p> 
                    {cont.artists.map((artist, index, artists) => 
                      <span key={artist.id} >                 
                        <span className='tableLink' onClick={() => pageChange('artist', artist.id)}>{artist.name}</span>
                        {(index < artists.length - 1)?
                        <span>, </span>
                        :
                        <span></span>
                        }
                      </span>
                      )}
                  </td>
                  <td style={{width: '505px'}}><span className='tableLink' onClick={() => pageChange('album', cont.albumId)}>{cont.albumName}</span></td>
                  <td className='rowLast'>{cont.duration}</td>
                </tr>
              )}
              </tbody>
            </table>
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
                <span className='tableLink' onClick={() => pageChange('artist', artist.id)}>{artist.name}</span>
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
                  <span className='tableLink' onClick={() => pageChange('artist', artist.id)}>{artist.name}</span>
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
