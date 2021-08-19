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

  const cardBody = {    
    width: '220px', 
    height: '295px', 
    margin: '10px', 
    background: '#212121'
  }

  const cardImage = {
    height: '190px',
    width: '190px',
    margin: '15px',
    objectFit: 'cover'
  }

  const cardTitle = {
    display: 'inline-block',
    fontSize: '12pt', 
    color: 'white', 
    marginLeft: '15px', 
    overflow: 'hidden', 
    textOverflow: 'ellipsis', 
    whiteSpace: 'nowrap', 
    width: '190px',
  }

  const cardSub = {
    fontSize: '10pt', 
    color: 'white', 
    marginLeft: '15px', 
    maxWidth: '190px'
  }
     
    return (
        <div className='d-flex justify-content-between'>    
        {content.map(cont =>
          <div style={cardBody} key={cont.key}>
            <img style={cardImage} src={cont.imgUrl} alt='' />
            <span onClick={() => pageChange(cont.type, cont.id)} style={cardTitle}>{cont.name}</span>
            <br />
            {cont.type === 'album'?
            <span onClick={() => pageChange('artist', cont.artistId)} className="mb-2 text-muted" style={cardSub}>{cont.subtitle}</span>
            :
            <span className="mb-2 text-muted" style={cardSub}>{cont.subtitle}</span>
            }
          </div>
        )}
        </div>)
}
