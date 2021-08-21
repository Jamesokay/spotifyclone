import React from 'react'
import toMinsSecs from './toMinsSecs'

export default function TracksTable({content, dispatch, page}) {

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
                <td>{cont.name}</td>
                <td>{toMinsSecs(cont.duration_ms)}</td>
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
              <tr style={{color: 'white', textAlign: 'left'}}>
                <th>TITLE</th>
                <th>TIME</th>
              </tr>
              </thead>
              <tbody>
              {content.map(cont =>
                <tr className='trackTableRow' key={cont.id}>
                  <td>
                    <p style={{color: 'white'}}>{cont.name}</p> 
                    <p><span className='tableLink' onClick={() => pageChange('artist', cont.artistId)}>{cont.artistName}</span></p>
                  </td>
                  <td>{cont.duration}</td>
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
                <tr style={{color: 'grey', textAlign: 'left'}}>
                <th>TITLE</th>
                <th>ALBUM</th>
                <th>TIME</th>
                </tr>
              </thead>
              <tbody>
              {content.map(cont =>
                <tr className='trackTableRow' key={cont.id}>
                  <td>
                    <p style={{ color: 'white' }}>{cont.name}</p> 
                    <p><span className='tableLink' onClick={() => pageChange('artist', cont.artistId)}>{cont.artistName}</span></p> 
                  </td>
                  <td><span className='tableLink' onClick={() => pageChange('album', cont.albumId)}>{cont.albumName}</span></td>
                  <td>{cont.duration}</td>
                </tr>
              )}
              </tbody>
            </table>
        )
    }
    else if (page === 'search') {
      return (
        <table className='trackTable' cellSpacing='0' cellPadding='0'>
         <thead>
          <tr style={{color: 'white', textAlign: 'left'}}>
            <th>TITLE</th>
            <th>ARTIST</th>
            <th>TIME</th>
          </tr>
          </thead>
          <tbody>
          {content.map(cont =>
          <tr className='trackTableRow' key={cont.id}>
            <td>{cont.name}</td>
            <td>{cont.artist}</td>
            <td>{cont.duration}</td>
          </tr>
          )}
          </tbody>
        </table>
      )
    }
}
