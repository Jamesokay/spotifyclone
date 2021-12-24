import { useState, useEffect, useContext } from 'react'
import CollectionNav from '../components/CollectionNav'
import SpotifyWebApi from 'spotify-web-api-node'
import { AuthContext, ThemeContext } from '../contexts'
import axios from 'axios'
import getDataObject from '../utils/getDataObject'
import Panel from '../components/Panel'
import { Link } from 'react-router-dom'


const spotifyApi = new SpotifyWebApi({
  clientId: localStorage.getItem('clientId')
})

export default function CollectionPlaylist() {
  const accessToken = useContext(AuthContext)
  const [preview, setPreview] = useState([])
  const [playlists, setPlaylists] = useState([])
  const { setCurrentTheme } = useContext(ThemeContext)


  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    setCurrentTheme({red: 0, green: 0, blue: 0})
  }, [setCurrentTheme])

  

  useEffect(() => {
    if (!accessToken) return

    spotifyApi.getMySavedTracks()
    .then(data => {
      console.log(data.body)
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
    if (!accessToken) return

    const options = {
      url: 'https://api.spotify.com/v1/me/playlists',
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          }
      }
  
    axios(options)
    .then(response => {
       setPlaylists(response.data.items.map(getDataObject))
    })
    .catch(error => {
      console.log(error)
    })
    
  }, [accessToken])

  useEffect(() => {
    console.log(playlists)
  }, [playlists])

    return (
    <div id='collectionPagePlaylist'>
     <CollectionNav />

     <div>
     <span className='collectionTitle'>Playlists</span> 
     <Link to={{pathname:'/collection/tracks'}}>
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
      </Link>
      </div>

      <Panel content={playlists} />
      
    </div>
    )
}
