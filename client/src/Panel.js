import React from 'react'

export default function panel({ content, dispatch }) {
    
  function pageChange(pageType, pageId) {
    if (pageType === 'artist') {
      dispatch({
        type: 'ARTIST_PAGE',
        id: pageId
      })
    }
    else if (pageType === 'album' || pageType === 'artistAlbum') {
      dispatch({
        type: 'ALBUM_PAGE',
        id: pageId
      })
    }
    else if (pageType === 'playlist') {
      dispatch({
        type: 'PLAYLIST_PAGE',
        id: pageId
      })
    }
  }
    
    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>    
        {content.map(cont =>
          <div className='cardBody' key={cont.key}>
            {cont.type === 'artist'?
            <img className='cardArtist' src={cont.imgUrl} alt='' onClick={() => pageChange(cont.type, cont.id)} />
            :
            <img className='cardImage' src={cont.imgUrl} alt='' onClick={() => pageChange(cont.type, cont.id)} />
            }
            <span className='cardTitle' onClick={() => pageChange(cont.type, cont.id)}>{cont.name}</span>
            <br />
            {cont.type === 'album'?
            <span className='cardSubLink' onClick={() => pageChange('artist', cont.artistId)}>{cont.subtitle}</span>
            :
            <span className='cardSub'>{cont.subtitle}</span>
            }
          </div>
        )}
        </div>)
}
