import { useContext } from 'react'
import { TrackContext } from './TrackContext'


export default function Player() {

  const trackContext = useContext(TrackContext)
  const track = trackContext.currentTrack

  return (
    <div className='playBar'>
      <div className='playingTrack'>
        <img className='playingTrackImg' src={track.imgUrl} alt='' />
        <div className='playingTrackInfo'>
          <span className='playingTrackName'>{track.name}</span>
          <br />
          {(track.artists)?
            track.artists.map((artist, index, artists) =>
              <span key={artist.id}> 
                <span className='playingTrackArtist'>{artist.name}</span>
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
