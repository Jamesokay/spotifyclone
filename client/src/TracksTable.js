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
            <table style={{width: '1200px'}}>
            <tbody>
            {content.map(cont =>
              <tr key={cont.id} style={{color: 'white'}}>
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
            <table style={{width: '1200px'}}>
            <thead>
              <tr style={{color: 'white', textAlign: 'left'}}>
                <th>TITLE</th>
                <th>TIME</th>
              </tr>
              </thead>
              <tbody>
              {content.map(cont =>
                <tr key={cont.id}>
                  <td>
                    <p style={{color: 'white'}}>{cont.name}</p> 
                    <p onClick={() => pageChange('artist', cont.artistId)}>{cont.artistName}</p>
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
            <table style={{width: '1200px'}}>
              <thead>
                <tr style={{color: 'white', textAlign: 'left'}}>
                <th>TITLE</th>
                <th>ALBUM</th>
                <th>TIME</th>
                </tr>
              </thead>
              <tbody>
              {content.map(cont =>
                <tr key={cont.id}>
                  <td>
                    <p style={{color: 'white'}}>{cont.name}</p> 
                    <p onClick={() => pageChange('artist', cont.artistId)}>{cont.artistName}</p> 
                  </td>
                  <td onClick={() => pageChange('album', cont.albumId)}>{cont.albumName}</td>
                  <td>{cont.duration}</td>
                </tr>
              )}
              </tbody>
            </table>
        )
    }
    else if (page === 'search') {
      return (
        <table style={{width: '1200px'}}>
         <thead>
          <tr style={{color: 'white', textAlign: 'left'}}>
            <th>TITLE</th>
            <th>ARTIST</th>
            <th>TIME</th>
          </tr>
          </thead>
          <tbody>
          {content.map(cont =>
          <tr key={cont.id}>
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
