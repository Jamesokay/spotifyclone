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
    
    const twoCol = {
      float: 'left', 
      width: '50%'
    }

    const threeCol = {
      float: 'left',
      width: '33.3%'
    }

    if (page === 'artist') {
        return (
            <div>
            {content.map(cont =>
              <div className='row' key={cont.id} style={{color: 'white'}}>
                <div className='column' style={twoCol}>{cont.name}</div>
                <div className='column' style={twoCol}>{toMinsSecs(cont.duration_ms)}</div>
              </div>
            )}
            </div>
        )
    }
    else if (page === 'album') {
        return (
            <div>
              <div className='row' style={{color: 'white'}}>
                <div className='column' style={twoCol}>TITLE</div>
                <div className='column' style={twoCol}>TIME</div>
              </div>
              <hr />
              {content.map(cont =>
                <div className='row' key={cont.id}>
                  <div className='column' style={twoCol}>
                    <span style={{color: 'white'}}>{cont.name}</span> 
                    <br /> 
                    <span onClick={() => pageChange('artist', cont.artistId)}>{cont.artistName}</span>
                  </div>
                  <div className='column' style={twoCol}>{cont.duration}</div>
                </div>
               )}
            </div>
        )
    }
    else if (page === 'playlist') {
        return (
            <div>
              <div className='row' style={{color: 'white'}}>
                <div className='column' style={threeCol}>TITLE</div>
                <div className='column' style={threeCol}>ALBUM</div>
                <div className='column' style={threeCol}>TIME</div>
              </div>
              <hr />
              {content.map(cont =>
                <div className='row' key={cont.id}>
                  <div className='column' style={threeCol}>
                    <span style={{color: 'white'}}>{cont.name}</span> 
                    <br /> 
                    <span onClick={() => pageChange('artist', cont.artistId)}>{cont.artistName}</span> 
                  </div>
                  <div className='column' onClick={() => pageChange('album', cont.albumId)} style={threeCol}>{cont.albumName}</div>
                  <div className='column' style={threeCol}>{cont.duration}</div>
                </div>
              )}
            </div>
        )
    }
}
