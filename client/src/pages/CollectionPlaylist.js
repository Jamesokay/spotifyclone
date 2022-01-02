import { useState, useEffect, useContext } from 'react'
import CollectionNav from '../components/CollectionNav'
import SpotifyWebApi from 'spotify-web-api-node'
import { AuthContext, ThemeContext, SideBarWidthContext } from '../contexts'
import axios from 'axios'
import getDataObject from '../utils/getDataObject'
import playTrack from '../utils/playTrack'
import { Link } from 'react-router-dom'
import useViewport from '../hooks/useViewPort'


const spotifyApi = new SpotifyWebApi({
  clientId: localStorage.getItem('clientId')
})

export default function CollectionPlaylist() {
  const accessToken = useContext(AuthContext)
  const [preview, setPreview] = useState([])
  const [savedTracksTotal, setSavedTracksTotal] = useState(0)
  const [playlists, setPlaylists] = useState([])
  const { setCurrentTheme } = useContext(ThemeContext)
  const [cardWidth, setCardWidth] = useState(17.8)
  const [likedSongsCardWidth, setLikedSongsCardWidth] = useState(37.3)
  const { width } = useViewport()
  const { currentWidth } = useContext(SideBarWidthContext)
  const breakPointLarge = 1060
  const breakPointMedium = 860
  const breakPointSmall = 620

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])
  
  // Set NavBar to black
  useEffect(() => {
    setCurrentTheme({red: 0, green: 0, blue: 0})
  }, [setCurrentTheme])

  
  // Make cards responsive to viewport breakpoints
  useEffect(() => {
      if ((width - currentWidth) <= breakPointSmall) {
        setLikedSongsCardWidth(91)
        setCardWidth(44.5)
      }
      else if ((width - currentWidth) > breakPointSmall && (width - currentWidth) <= breakPointMedium) {
        setLikedSongsCardWidth(61)
        setCardWidth(29.6)
      }
      else if ((width - currentWidth) > breakPointMedium && (width - currentWidth) < breakPointLarge) {
        setLikedSongsCardWidth(46.2)
        setCardWidth(22.25)
      }
      else if ((width - currentWidth) >= breakPointLarge) {
        setLikedSongsCardWidth(37.3)
        setCardWidth(17.8)
      }

      return () => {
          setLikedSongsCardWidth(37.3)
          setCardWidth(17.8)
      }
  }, [width, currentWidth])

  
  // Get user's saved tracks, the names and artists of which will be rendered on Liked Songs card
  useEffect(() => {
    if (!accessToken) return

    const getLikedSongsPreview = async () => {
      try {
        const data = await spotifyApi.getMySavedTracks()
        setSavedTracksTotal(data.body.items.length)
        setPreview(data.body.items.map(item => {
          return {
            id: item.track.id,
            name: item.track.name + ' ',
            artist: item.track.artists[0].name + ' • '
          }
        }))
      } catch (err) {
        console.error(err)
      }
    }

    getLikedSongsPreview()

    return () => {
      setSavedTracksTotal(0)
      setPreview([])
    }
  }, [accessToken])


  // Get user's saved playlists
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
    
    const getSavedPlaylists = async () => {
      try {
        const response = await axios(options)
        setPlaylists(response.data.items.map(getDataObject))
      } catch (err) {
        console.error(err)
      }
    }
  
    getSavedPlaylists()

    return () => {
      setPlaylists([])
    }   
  }, [accessToken])


    return (
    <div id='collectionPagePlaylist'>
     <CollectionNav />
     <span className='collectionTitle'>Playlists</span> 
     <div className='panel'>
     <Link id='likedSongsContainer' to={{pathname:'/collection/tracks'}} style={{width: likedSongsCardWidth + '%'}}>
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
            <span id='lsCount'>{savedTracksTotal + ' liked songs'}</span>
            <div id='lsPlayButton'>
              <div id='lsPlayIcon'></div>
            </div>
      </div>
      </Link>
      {playlists.map(cont =>
        <Link className='cardLink' style={{width: cardWidth + '%'}} key={cont.key} to={{pathname: `/${cont.type}/${cont.id}`, state: cont.id }}>
        <div className='cardBody'>
          <div className='cardImageBox'>
            <img className='cardImage' src={cont.imgUrl} alt='' />
            <div className ='cardPlayButton'
             onClick={(e) => {
               e.preventDefault()
               playTrack(accessToken, {context_uri: cont.uri})} 
             }>
              <div className='cardPlayIcon'></div>
            </div>
          </div>
          <div className='cardText'>
          <span className='cardTitle'>{cont.name}</span>
          <br /> 
          <span className='cardSub'>{cont.subtitle}</span> 
          </div>
        </div>
        </Link>
      )}
      </div>
    </div>
    )
}
