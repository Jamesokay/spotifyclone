
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
                <td className='rowFirst'>{cont.num}</td>
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
              <tr style={{color: 'white', textAlign: 'left'}}>
                <th style={{textAlign: 'center'}}>#</th>
                <th>TITLE</th>
                <th>TIME</th>
              </tr>
              </thead>
              <tbody>
              {content.map(cont =>
                <tr className='trackTableRow' key={cont.id}>
                  <td className='rowFirst'>{cont.num}</td>
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
                <tr style={{color: 'grey', textAlign: 'left'}}>
                <th style={{textAlign: 'center'}}>#</th>
                <th>TITLE</th>
                <th></th>
                <th>ALBUM</th>
                <th>TIME</th>
                </tr>
              </thead>
              <tbody>
              {content.map(cont =>
                <tr className='trackTableRow' key={cont.id}>
                  <td className='rowFirst'>{cont.num}</td>
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
    else if (page === 'search') {
      return (
        <table className='trackTable' cellSpacing='0' cellPadding='0'>
          <tbody>
          {content.map(cont =>
          <tr className='trackTableRow' key={cont.id}>
            <td className='rowFirst'><img className='tableImage' src={cont.trackImage} alt='' /></td>
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
}
