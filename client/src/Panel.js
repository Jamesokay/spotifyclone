import React from 'react'

export default function panel({ title, content, dispatch }) {
    
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
        <div style={{display: 'flex', justifyContent: 'between'}}>    
        {content.map(cont =>
          <div className='cardBody' key={cont.key}>
            {cont.type === 'artist'?
            <img className='cardArtist' src={cont.imgUrl} alt='' />
            :
            <img className='cardImage' src={cont.imgUrl} alt='' />
            }
            <b className='cardTitle' onClick={() => pageChange(cont.type, cont.id)}>{cont.name}</b>
            <br />
            {cont.type === 'album'?
            <span className='cardSub' onClick={() => pageChange('artist', cont.artistId)}>{cont.subtitle}</span>
            :
            <span className='cardSub'>{cont.subtitle}</span>
            }
          </div>
        )}
        </div>)
}
