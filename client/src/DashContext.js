import {useState, useEffect, createContext } from 'react'
import { useSelector } from 'react-redux'
import getDataObject from './utils/getDataObject'
import { getWithToken } from './utils/getWithToken'

const DashContext = createContext()

// Dashboard API calls all carried out in this context rather than Dashboard itself, such that results are consistent across session
// and the relatively resource intensive work is required only on the initial load

export default function DashContextProvider({ children }) {   
    const accessToken = useSelector(state => state.user.token)
    const [topArtists, setTopArtists] = useState([])
    const [recent, setRecent] = useState([])
    const [recentGrid, setRecentGrid] = useState([])
    const [recentReversed, setRecentReversed] = useState([])
    const [recentSeeds, setRecentSeeds] = useState([])
    const [forToday, setForToday] = useState([])
    const [moreLike, setMoreLike] = useState([])
    const [recommend, setRecommend] = useState([])
    const [moreLikeSeed, setMoreLikeSeed] = useState('')
    const [loading, setLoading] = useState(true)
    
    // Function for removing null and duplicate listening contexts in Recently Played
    function getUniqueById(array) {    
        const clearUndefinedValues = array.filter(item => { return item.context !== null })
        const uris = clearUndefinedValues.map(item => item.context.uri)      
        const filtered = clearUndefinedValues.filter((item, index) => !uris.includes(item.context.uri, index + 1))
        return filtered
    }

    useEffect(() => {
      if (!accessToken) return 
      const getArtists = async () => {
        try {
          const artists = await getWithToken(`https://api.spotify.com/v1/me/top/artists`, accessToken)
          setTopArtists(artists.items.map(getDataObject))
        } catch (err) {console.error(err)} 
      }
      getArtists()
      return () => { setTopArtists([]) }
    }, [accessToken])


    // Store top 5 ids as seeds for generating recommendations
    // Get recently played tracks
    // These are then filtered by getUniqueById() to remove null and duplicate contexts
    // Filtered array is then passed through spotifyContextQuery() to generate the final array of objects to be rendered
    useEffect(() => {   
      if (!accessToken) return
      
      async function spotifyContextQuery(array) {
       let newArray = []
       for (const item of array) {
          if (item.context.type === 'playlist') {
            try {
              const data = await getWithToken(`https://api.spotify.com/v1/playlists/${item.context.uri.substr(17)}`, accessToken)
              newArray.push(getDataObject(data))
            } catch (err) { console.error(err) }
          }
          else if (item.context.type === 'artist') {
            try {
              const data = await getWithToken(`https://api.spotify.com/v1/artists/${item.context.uri.substr(15)}`, accessToken)
              newArray.push(getDataObject(data))
            } catch (err) { console.error(err) }
          }
          else if (item.context.type === 'album') {
            try {
            const data = await getWithToken(`https://api.spotify.com/v1/albums/${item.context.uri.substr(14)}`, accessToken)
            newArray.push(getDataObject(data))
            } catch (err) { console.error(err) }
          }
        }
        return newArray
      }    

      const getRecent = async () => {
        try {
          const response = await getWithToken(`https://api.spotify.com/v1/me/player/recently-played?limit=50`, accessToken)
          setRecentSeeds(response.items.slice(0, 5).map(item => item.track.id))
          let recentFiltered = getUniqueById(response.items)
          setRecent(await spotifyContextQuery(recentFiltered))
          setLoading(false)
        } catch (err) { console.error(err) }
      }
      getRecent()
      return () => {
        setRecent([])
        setRecentSeeds([])
        setLoading(true)
      }
    }, [accessToken])

    useEffect(() => {
      if (recent.length < 8) return

      const getColour = (array) => {
        for (const item of array) {
          let canvas = document.createElement('canvas')
          let ctx = canvas.getContext('2d')
          let myImgElement = new Image() 
  
          myImgElement.onload = function() {
            canvas.width = myImgElement.naturalWidth
            canvas.height = myImgElement.naturalHeight
            let yStart = Math.floor(canvas.height * 0.5)
            ctx.drawImage( myImgElement, 0, 0 )
            let imgdata = ctx.getImageData(0, yStart, 50, 50);
            let pixels = imgdata.data;
  
            let red = 0
            let green = 0
            let blue = 0
  
            for (let i = 0; i < pixels.length; i += 4) {
              red += pixels[i]
              green += pixels[i + 1]
              blue += pixels[i + 2]
            }
  
            let avgRed = Math.floor(red / (pixels.length / 4))
            let avgGreen = Math.floor(green / (pixels.length / 4))
            let avgBlue = Math.floor(blue / (pixels.length / 4))
  
            setRecentGrid(recentGrid => [...recentGrid, { ...item, bg: `rgb(${avgRed},${avgGreen},${avgBlue})`, red: avgRed, green: avgGreen, blue: avgBlue }])
          }
        myImgElement.src = item.imgUrl   
        myImgElement.crossOrigin = ''  
        }
     }
     getColour(recent.slice(0, 8))
     return () => { setRecentGrid([]) }
    }, [recent])

    
    // Generate arrays for 'More like {artist}' and 'Album picks'
    // Based on randomised index into topArtists array
    useEffect(() => {
      if (!accessToken) return     
      if (topArtists.length < 20) return
      
      let artistIndex = Math.floor(Math.random() * 20)  
      setMoreLikeSeed(topArtists[artistIndex].name)

      const getMoreLike = async () => {
        try {
          const response = await getWithToken(`https://api.spotify.com/v1/recommendations?seed_artists=${topArtists[artistIndex].key}`, accessToken)
          let filtered = response.tracks.filter(track => track.artists[0].id !== topArtists[artistIndex].key)
          setMoreLike(filtered.map(track => getDataObject(track.album)))
        } catch (err) { console.error(err) }
      }
      const getRecommend = async () => {
        try {
          const response = await getWithToken(`https://api.spotify.com/v1/recommendations?seed_artists=${topArtists[1].key},${topArtists[2].key},${topArtists[3].key}&min_popularity: 50`, accessToken)
          setRecommend(response.tracks.map(track => getDataObject(track.album)))
        } catch (err) { console.error(err) }
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
      return function cleanUp() { setRecentReversed([]) }
    }, [recent])

    // Generate array for 'Recommended for today' panel
    // Same pattern as used above for generating 'Album picks' and 'More like {artist}'
    // Only difference being the seeds are derived from recently played tracks rather than top artists
    useEffect(() => {
      if (!accessToken) return
      if (recentSeeds.length === 0) return
      const getForToday = async () => {
        try {
          const response = await getWithToken(`https://api.spotify.com/v1/recommendations?seed_tracks=${String(recentSeeds)}&min_popularity=50`, accessToken)
          setForToday(response.tracks.map(track => getDataObject(track.album)))
        } catch (err) { console.error(err) }
      }
      getForToday()
      return function cleanUp() { setForToday([]) }
    }, [accessToken, recentSeeds])

    return (
      <DashContext.Provider value={{recent, recentGrid, recentReversed, forToday, moreLike, recommend, moreLikeSeed, loading}}>
        {children}
      </DashContext.Provider>
    )
  }
  
  export { DashContext, DashContextProvider }