import React from 'react'
import { Container, Card } from 'react-bootstrap'

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
        <Container className='d-flex justify-content-between' style={{maxWidth: '1200px'}}>
        {content.map(cont =>
          <Card style={{minWidth: '220px', height: '295px', marginTop: '20px', background: '#212121'}} key={cont.key}>
            <Card.Img style={{height: '190px', width: '190px', margin: '15px', objectFit: 'cover'}} src={cont.imgUrl} />
            <Card.Title onClick={() => pageChange(cont.type, cont.id)} style={{fontSize: '12pt', color: 'white', marginLeft: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '190px'}}>{cont.name}</Card.Title>
            {cont.type === 'album'?
            <Card.Subtitle onClick={() => pageChange('artist', cont.artistId)} className="mb-2 text-muted" style={{fontSize: '10pt', color: 'white', marginLeft: '15px', maxWidth: '190px'}}>{cont.subtitle}</Card.Subtitle>
            :
            <Card.Subtitle className="mb-2 text-muted" style={{fontSize: '10pt', color: 'white', marginLeft: '15px', maxWidth: '190px'}}>{cont.subtitle}</Card.Subtitle>
            }
          </Card>
        )}
        </Container>)
}
