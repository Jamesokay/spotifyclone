import { useState, useEffect, useContext } from 'react'
import CollectionNav from './CollectionNav'
import SpotifyWebApi from 'spotify-web-api-node'
import { AuthContext } from './AuthContext'

const spotifyApi = new SpotifyWebApi({
  clientId: localStorage.getItem('clientId')
})

export default function CollectionPlaylist() {
  const accessToken = useContext(AuthContext)
  const [preview, setPreview] = useState([])

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    if (!accessToken) return

    spotifyApi.getMySavedTracks()
    .then(data => {
      setPreview(data.body.items.map(item => {
        return {
          id: item.track.id,
          name: item.track.name + ' ',
          artist: item.track.artists[0].name + ' • '
        }
      }))
    })
    .catch(error => {
      console.log(error)
    })

  }, [accessToken])

  useEffect(() => {
    console.log(preview)
  }, [preview])

    return (
        <div id='collectionPage'>
          <CollectionNav />
          <div style={{marginLeft: '2vw', marginTop: '9vh'}}>
            <p style={{color: 'white', fontSize: '18pt', fontFamily: 'Arial'}}>Playlists</p>
            <div id='likedSongsCard'>
              <span id='lsCardPreview'>
                {preview.map(prev =>
                <span key={prev.id}>
                  <span className='prevName'>{prev.name}</span>
                  <span className='prevArtist'>{prev.artist}</span>
                </span>
                )}
              </span>
              <span id='lsCardTitle'>Liked Songs</span>
              <span id='lsCount'>200 liked songs</span>
              <div id='lsPlayButton'>
                <div id='lsPlayIcon'></div>
              </div>
            </div>
          </div>
        </div>
    )
}
