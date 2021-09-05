import { useState, useEffect, useContext } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import { AuthContext } from './AuthContext'

const spotifyApi = new SpotifyWebApi({
  clientId: localStorage.getItem('clientId')
})

export default function Player() {
  
  const accessToken = useContext(AuthContext)
  const [track, setTrack] = useState({})

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])


  useEffect(() => {
    if (!accessToken) return

    spotifyApi.getMyCurrentPlayingTrack()
    .then(data => {
      setTrack({
        name: data.body.item.name,
        artists: data.body.item.artists,
        imgUrl: data.body.item.album.images[0].url
      })
    })
    .catch(error => {
      console.log(error)
    })

  }, [accessToken])

  useEffect(() => {
    if (!accessToken) return
    if (!track) return
    console.log(track.artists)
  }, [accessToken, track])

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
