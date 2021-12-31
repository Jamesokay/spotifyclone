import SpotifyWebApi from 'spotify-web-api-node'
import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../contexts'
import Panel from '../components/Panel'
import getDataObject from '../utils/getDataObject'
import PanelGrid from '../components/PanelGrid'
import Loader from './Loader'
import Menu from '../components/Menu'

const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function Dashboard() {
    const accessToken = useContext(AuthContext)
    const [topArtists, setTopArtists] = useState([])
    const [recent, setRecent] = useState([])
    const [recentReversed, setRecentReversed] = useState([])
    const [recentSeeds, setRecentSeeds] = useState([])
    const [forToday, setForToday] = useState([])
    const [moreLike, setMoreLike] = useState([])
    const [recommend, setRecommend] = useState([])
    const [relatedArtistsSeed, setRelatedArtistsSeed] = useState('')
    const [customArtistPanel, setCustomArtistPanel] = useState([])
    const [customArtistName, setCustomArtistName] = useState('')
    const [loading, setLoading] = useState(true)

    const date = new Date()
    const time = date.toLocaleTimeString('en-GB')
    const timeMod = parseInt(time.replace(/:/g, ''))
    const greeting = greetingMessage(timeMod)

    // Set greeting message based on time of day
    function greetingMessage(time) {
      if (time < 120000) {
        return 'Good morning'
      }
      else if (time >= 120000 && time < 175959) {
        return 'Good afternoon'
      }
      else if (time >= 180000) {
        return 'Good evening'
      }
    }

    // Function for removing null and duplicate listening contexts in Recently Played
    function getUniqueById(array) {
        
        const clearUndefinedValues = array.filter(item => {
            return item.context !== null
          })

          const uris = clearUndefinedValues.map(item => item.context.uri)      
          const filtered = clearUndefinedValues.filter((item, index) => !uris.includes(item.context.uri, index + 1))
          return filtered
    }
    
    // Function to retrieve data from relevant API endpoints based on Recently Played track contexts
    async function spotifyContextQuery(array) {

     let newArray = []

     for (const item of array) {
        if (item.context.type === 'playlist') {
          try {
            const data = await spotifyApi.getPlaylist(item.context.uri.substr(17))
            newArray.push(getDataObject(data.body))
          } catch (err) {
            console.error(err)
          }
        }
        else if (item.context.type === 'artist') {
          try {
            const data = await spotifyApi.getArtist(item.context.uri.substr(15))
            newArray.push(getDataObject(data.body))
          } catch (err) {
            console.error(err)
          }
        }
        else if (item.context.type === 'album') {
          try {
          const data = await spotifyApi.getAlbum(item.context.uri.substr(14))
          newArray.push(getDataObject(data.body))
          } catch (err) {
            console.error(err)
          }
        }
      }

      return newArray
    }
    

    useEffect(() => {
      if (!accessToken) return
      spotifyApi.setAccessToken(accessToken)
    }, [accessToken])


    useEffect(() => {
      if (!accessToken) return 

      const getArtists = async () => {
        try {
          const data = await spotifyApi.getMyTopArtists({limit : 20})
          setTopArtists(data.body.items.map(getDataObject))
        } catch (err) {
          console.error(err)
        }
      }

      getArtists()

    } , [accessToken])


    
    // Store top 5 ids as seeds for generating recommendations
    // Get recently played tracks
    // These are then filtered by getUniqueById() to remove duplicate contexts
    // Filtered array is then passed through spotifyContextQuery() to generate the final array of objects to be rendered
    useEffect(() => {   
      if (!accessToken) return   

      const getRecent = async () => {
        try {
          const data = await spotifyApi.getMyRecentlyPlayedTracks({limit : 50})
          setRecentSeeds(data.body.items.slice(0, 5).map(item => item.track.id))
          let recentFiltered = getUniqueById(data.body.items)
          let recentlyPlayed = await spotifyContextQuery(recentFiltered)
          setRecent(recentlyPlayed)
          setLoading(false)
        } catch (err) {
          console.error(err)
        }
      }

      getRecent()

      return function cleanUp() {
        setRecent([])
        setRecentSeeds([])
        setRecentReversed([])
        setLoading(true)
      }
    }, [accessToken])

    
    // Generate arrays for 'More like {artist}' and 'Album picks'
    // Based on randomised index into topArtists array
    useEffect(() => {
      if (!accessToken) return     
      if (topArtists.length < 20) return

      var artistIndex = Math.floor(Math.random() * (11 - 5) + 5)
      
      setRelatedArtistsSeed(topArtists[artistIndex].name)

      const getMoreLike = async () => {
        try {
          const data = await spotifyApi.getRecommendations({seed_artists: [topArtists[artistIndex].key], min_popularity: 50})
          setMoreLike(data.body.tracks.map(track => getDataObject(track.album)))
        } catch (err) {
          console.error(err)
        }
      }

     const getRecommend = async () => {
       try {
         const data = await spotifyApi.getRecommendations({seed_artists: [topArtists[1].key, topArtists[2].key, topArtists[3].key], min_popularity: 50})
         setRecommend(data.body.tracks.map(track => getDataObject(track.album)))
       } catch (err) {
         console.error(err)
       }
     }

     getMoreLike()
     getRecommend()

    return function cleanUp() {
      setMoreLike([])
      setRecommend([])
    }

    }, [accessToken, topArtists])


    // Generate array for 'Jump back in' panel
    // Based on recent array, simply reversed so as to show different results
    useEffect(() => {
      if (recent.length === 0) return

      setRecentReversed(recent.slice().reverse())

      return function cleanUp() {
        setRecentReversed([])
      }
    }, [recent])


    // Generate custom artist panel
    // Composed of both Spotify-made playlists and artist albums
    // Based on randomised index into topArtists array, with random number produced in such a way
    // that it will always be different to the one produced above, preventing 'More like {artist}' and
    // custom artist panel from being based on the same artist
    useEffect(() => {
      if (!accessToken) return
      if (topArtists.length < 5) return
      
      var artistIndex = Math.floor(Math.random() * 4)

      setCustomArtistName(topArtists[artistIndex].name)
      
      const getCustomPanelPlaylists = async () => {
        try {
          const data = await spotifyApi.searchPlaylists(topArtists[artistIndex].name)
          let playlists = data.body.playlists.items.filter(item => item.owner.display_name === 'Spotify')
          playlists.slice(0, 2).forEach(playlist => setCustomArtistPanel(customArtistPanel => [...customArtistPanel, getDataObject(playlist)]))         
        } catch (err) {
          console.error(err)
        }
      }
          
      const getCustomPanelAlbums = async () => {
        try {
          const data = await spotifyApi.getArtistAlbums(topArtists[artistIndex].key, {album_type: 'album', limit: 5})
          data.body.items.forEach(album => setCustomArtistPanel(customArtistPanel => [...customArtistPanel, getDataObject(album)]))
        } catch (err) {
          console.error(err)
        }
      }
      
      getCustomPanelPlaylists()
      getCustomPanelAlbums()

      return function cleanUp() {
        setCustomArtistName('')
        setCustomArtistPanel([])
      }

    }, [accessToken, topArtists])


    // Generate array for 'Recommended for today' panel
    // Same pattern as used above for generating 'Album picks' and 'More like {artist}'
    // Only difference being the seeds are derived from recently played tracks rather than top artists
    useEffect(() => {
      if (recentSeeds.length === 0) return

      const getForToday = async () => {
        try {
          const data = await spotifyApi.getRecommendations({seed_tracks: recentSeeds, min_popularity: 50})
          setForToday(data.body.tracks.map(track => getDataObject(track.album)))
        } catch (err) {
          console.error(err)
        }
      }

      getForToday()

      return function cleanUp() {
        setForToday([])
      }
    }, [recentSeeds])
    
    
    return loading? <Loader /> : (
      <div id="dash">
           <Menu />
        {recent.length > 7?
          <PanelGrid content={recent} head={greeting}/>
          :
          <div>
          <span className='panelTitle'>{greeting}</span>
          <Panel content={recent.slice(0, 5)} />
          </div>
        
        }

        <span className='panelTitle'>{'More like ' + relatedArtistsSeed}</span>
        <Panel content={moreLike.slice(0, 5)} />
        <span className='panelTitle'>Album picks</span>
        <span className='panelTitleSub'>Albums for you based on what you like to listen to.</span>
        <Panel content={recommend.slice(0, 5)} />   
        <span className='panelTitle'>Jump back in</span> 
        <Panel content={recentReversed.slice(0, 5)} />  
        <span className='panelTitle'>{'For fans of ' + customArtistName}</span>
        <Panel content={customArtistPanel.slice(0, 5)} /> 
        <span className='panelTitle'>Recommended for today</span>
        <Panel content={forToday.slice(0, 5)} />

      </div>
    )
}        