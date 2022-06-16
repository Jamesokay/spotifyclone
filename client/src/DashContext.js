import {useState, useEffect, createContext, useContext } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import { AuthContext } from './contexts'
import getDataObject from './utils/getDataObject'

const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

// Dashboard API calls all carried out in this context rather than Dashboard itself, such that results are consistent across session
// and the relatively resource intensive work is required only on the initial load

const DashContext = createContext()

const DashContextProvider = ({ children }) => {   
    const accessToken = useContext(AuthContext)
    const [topArtists, setTopArtists] = useState([])
    const [recent, setRecent] = useState([])
    const [recentReversed, setRecentReversed] = useState([])
    const [recentSeeds, setRecentSeeds] = useState([])
    const [forToday, setForToday] = useState([])
    const [moreLike, setMoreLike] = useState([])
    const [recommend, setRecommend] = useState([])
    const [relatedArtistsSeed, setRelatedArtistsSeed] = useState('')
    const [loading, setLoading] = useState(true)
    
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
          const response = await fetch(`https://api.spotify.com/v1/me/top/artists`, 
            {headers: { 
              'Authorization': `Bearer ${accessToken}`, 
              'Content-Type': 'application/json'
            }})
          if (!response.ok) {throw new Error(`An error has occured: ${response.status}`)}
          let artists = await response.json()
          setTopArtists(artists.items.map(getDataObject))
        } catch (err) {console.error(err)} 
      }
      getArtists()
    }, [accessToken])


    // Store top 5 ids as seeds for generating recommendations
    // Get recently played tracks
    // These are then filtered by getUniqueById() to remove null and duplicate contexts
    // Filtered array is then passed through spotifyContextQuery() to generate the final array of objects to be rendered
    useEffect(() => {   
      if (!accessToken) return   

      const getRecent = async () => {
        try {
          const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=50`, 
          {headers: { 
            'Authorization': `Bearer ${accessToken}`, 
            'Content-Type': 'application/json'
          }})
          if (!response.ok) {throw new Error(`An error has occured: ${response.status}`)}
          let recentlyPlayed = await response.json()
          console.log(recentlyPlayed)
          setRecentSeeds(recentlyPlayed.items.slice(0, 5).map(item => item.track.id))
          let recentFiltered = getUniqueById(recentlyPlayed.items)
          setRecent(await spotifyContextQuery(recentFiltered))
          setLoading(false)
        } catch (err) {
          console.error(err)
        }
      }

      getRecent()

      return function cleanUp() {
        setRecent([])
        setRecentSeeds([])
        setLoading(true)
      }
    }, [accessToken])

    
    // Generate arrays for 'More like {artist}' and 'Album picks'
    // Based on randomised index into topArtists array
    useEffect(() => {
      if (!accessToken) return     
      if (topArtists.length < 20) return

      var artistIndex = Math.floor(Math.random() * 20)
      
      setRelatedArtistsSeed(topArtists[artistIndex].name)

      const getMoreLike = async () => {
        try {
          const data = await spotifyApi.getRecommendations({seed_artists: [topArtists[artistIndex].key], min_popularity: 50})
          let filtered = data.body.tracks.filter(track => track.artists[0].id !== topArtists[artistIndex].key)
          setMoreLike(filtered.map(track => getDataObject(track.album)))
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

     const getRelatedArtists = async () => {
      try {
        const data = await spotifyApi.getArtistRelatedArtists([topArtists[artistIndex].key])
        console.log(data.body.artists)
      } catch (err) {
        console.error(err)
      }
    }

     getMoreLike()
     getRecommend()
     getRelatedArtists()

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
  
    
  
    return (
      <DashContext.Provider value={{recent, recentReversed, forToday, moreLike, recommend, relatedArtistsSeed, loading}}>
        {children}
      </DashContext.Provider>
    );
  };
  
  export { DashContext, DashContextProvider }