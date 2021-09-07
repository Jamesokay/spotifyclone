import { useContext } from 'react'
import { TrackContext } from './TrackContext'


export default function Player({ dispatch }) {

  const trackContext = useContext(TrackContext)
  const track = trackContext.currentTrack

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

  return (
    <div className='playBar'>
      <div className='playingTrack'>
        <img className='playingTrackImg' src={track.imgUrl} alt='' />
        <div className='playingTrackInfo'>
          <span className='playingTrackName' onClick={() => pageChange('album', track.albumId)}>{track.name}</span>
          <br />
          {(track.artists)?
            track.artists.map((artist, index, artists) =>
              <span key={artist.id}> 
                <span className='playingTrackArtist' onClick={() => pageChange('artist', artist.id)}>{artist.name}</span>
                {(index < artists.length - 1)?
                  <span className='playerPunc'>, </span>
                  :
                  <span></span>
                }
              </span>
            )
          :
          <span></span>
          }
        </div>
      </div>
      <div className='playButton'>
        <div className='playIcon'></div>
      </div>
    </div>
    )
}
