import React from 'react'
import { Row, Col } from 'react-bootstrap'
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
            <div>
            {content.map(cont =>
              <Row key={cont.id} style={{color: 'white'}}>
                <Col>{cont.name}</Col>
                <Col>{toMinsSecs(cont.duration_ms)}</Col>
              </Row>
            )}
            </div>
        )
    }
    else if (page === 'album') {
        return (
            <div>
              <Row style={{color: 'white'}}>
                <Col>TITLE</Col>
                <Col>TIME</Col>
              </Row>
              <hr />
              {content.map(cont =>
                <Row key={cont.id}>
                  <Col>
                    <span style={{color: 'white'}}>{cont.name}</span> 
                    <br /> 
                    <span onClick={() => pageChange('artist', cont.artistId)}>{cont.artistName}</span>
                  </Col>
                  <Col>{cont.duration}</Col>
                </Row>
               )}
            </div>
        )
    }
    else if (page === 'playlist') {
        return (
            <div>
              <Row style={{color: 'white'}}>
                <Col>TITLE</Col>
                <Col>ALBUM</Col>
                <Col>TIME</Col>
              </Row>
              <hr />
              {content.map(cont =>
                <Row key={cont.id}>
                  <Col>
                    <span style={{color: 'white'}}>{cont.name}</span> 
                    <br /> 
                    <span onClick={() => pageChange('artist', cont.artistId)}>{cont.artistName}</span> 
                  </Col>
                  <Col onClick={() => pageChange('album', cont.albumId)}>{cont.albumName}</Col>
                  <Col>{cont.duration}</Col>
                </Row>
              )}
            </div>
        )
    }
}
