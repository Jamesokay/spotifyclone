import { useState, useEffect } from 'react'
import useViewport from '../hooks/useViewPort'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function LikedSongsCard() {
    const accessToken = useSelector(state => state.user.token)
    const [preview, setPreview] = useState([])
    const [savedTracksTotal, setSavedTracksTotal] = useState(0)
    const { width } = useViewport()
    const sidebarWidth = useSelector(state => state.page.sidebarWidth)
    const viewPort = width - sidebarWidth
    const breakPointLarge = 1100
    const breakPointMedium = 900
    const breakPointSmall = 700
    const [likedSongsCardWidth, setLikedSongsCardWidth] = useState(0)

    useEffect(() => {
        if (viewPort <= breakPointSmall) { setLikedSongsCardWidth((viewPort * 0.89)) }
        else if (viewPort > breakPointSmall && viewPort <= breakPointMedium) { setLikedSongsCardWidth((viewPort * 0.592)) }
        else if (viewPort > breakPointMedium && viewPort < breakPointLarge) { setLikedSongsCardWidth((viewPort * 0.445)) }
        else if (viewPort >= breakPointLarge) { setLikedSongsCardWidth((viewPort * 0.356)) }
        return () => { setLikedSongsCardWidth((viewPort * 0.356)) }
    }, [viewPort])

    // Get user's saved tracks, the names and artists of which will be rendered on Liked Songs card
    useEffect(() => {
    if (!accessToken) return
    const getLikedSongsPreview = async () => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/me/tracks?limit=50`,
          {headers: { 'Authorization': `Bearer ${accessToken}`,'Content-Type': 'application/json'}})
        if (!response.ok) {throw new Error(`An error has occured: ${response.status}`)}
        let tracks = await response.json()
        setSavedTracksTotal(tracks.items.length)
        setPreview(tracks.items.map(item => { return {id: item.track.id, name: item.track.name + ' ', artist: item.track.artists[0].name + ' • '}}))
      } catch (err) { console.error(err) }
    }
    getLikedSongsPreview()
    return () => {
      setSavedTracksTotal(0)
      setPreview([])
    }
  }, [accessToken])

    return (
        <Link id='likedSongsContainer' to={{pathname:'/collection/tracks'}} style={{width: likedSongsCardWidth + 10}}>
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
    )
}
