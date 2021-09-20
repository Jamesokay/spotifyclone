import { useContext, useEffect } from 'react'
import { TrackContext } from './TrackContext'




export default function WebPlayer() {

  const trackContext = useContext(TrackContext)
  const track = trackContext.currentTrack
  const player = trackContext.player
  const paused = trackContext.paused

  useEffect(() => {
    if (!player) return
    if (!track) return

    console.log(track)

    if (paused) {
      console.log('track paused')
    }
  }, [player, track, paused])


  
  


//  const [is_paused, setPaused] = useState(false)
//  const [isPlaying, setIsPlaying] = useState(false)
//  const [current_track, setTrack] = useState(track)


  // function pageChange(pageType, pageId) {
  //   if (pageType === 'artist') {
  //     dispatch({
  //       type: 'ARTIST_PAGE',
  //       id: pageId
  //     })
  //   }
  //   else if (pageType === 'album') {
  //     dispatch({
  //       type: 'ALBUM_PAGE',
  //       id: pageId
  //     })
  //   }
  // }

 
  return (

    <div className='playBar'>
      <div className='playingTrack'>
        <img className='playingTrackImg' src={track.album.images[0].url} alt='' />
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
      <div className='playButton' onClick={() => player.togglePlay()}>
      {(paused)?
        <div className='playIcon'></div>
        :
        <div className='pauseIcon'></div>
      }
      </div>
      <div className='playProgressBar'>
        <div className='playProgress'></div>
      </div>
      <div className='prevBox' onClick={() => player.previousTrack()}>
        <div className='prevTrackButton'></div>
      </div>
      <div className='nextBox' onClick={() => player.nextTrack()}>
        <div className='nextTrackButton'></div>
      </div>
    </div>
    )

}
