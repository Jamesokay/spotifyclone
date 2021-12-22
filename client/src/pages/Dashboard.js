import SpotifyWebApi from 'spotify-web-api-node'
import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../AuthContext'
import Panel from '../components/Panel'
import getDataObject from '../utils/getDataObject'
import createContextArray from '../utils/createContextArray'
import PanelGrid from '../components/PanelGrid'
import Loader from './Loader'
import Menu from '../components/Menu'
import axios from 'axios'

const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function Dashboard() {
    const accessToken = useContext(AuthContext)
    const [topArtists, setTopArtists] = useState([])
    const [recent, setRecent] = useState([])
    const [topYear, setTopYear] = useState([])
    const [recentReversed, setRecentReversed] = useState([])
    const [recentSeeds, setRecentSeeds] = useState([])
    const [forToday, setForToday] = useState([])
    const [moreLike, setMoreLike] = useState([])
    const [recommend, setRecommend] = useState([])
    const [relatedArtistsSeed, setRelatedArtistsSeed] = useState('')
    const [customArtistPanel, setCustomArtistPanel] = useState([])
    const [customArtistName, setCustomArtistName] = useState([])
    const [loading, setLoading] = useState(true)

    const date = new Date()
    const month = date.getMonth()
    const year = date.getFullYear()
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

    // Function for removing duplicate listening contexts in Recently Played
    function getUniqueById(array) {
        const clearUndefinedValues = array.filter(item => {
            return item !== undefined
          })
          const ids = clearUndefinedValues.map(item => item.id)      
          const filtered = clearUndefinedValues.filter(({id}, index) => !ids.includes(id, index + 1))
          return filtered
    }
    
    // Function to retrieve data from relevant API endpoints based on Recently Played track contexts
    function spotifyContextQuery(item) {
      if (!item.type) {
        return
      }
      else if (item.type === 'playlist') {
        spotifyApi.getPlaylist(item.id)
        .then(data => {
          setRecent(recent => [...recent, getDataObject(data.body)])
        })
        .catch(error => {
          console.log(error)
        })
      }
      else if (item.type === 'artist') {
        spotifyApi.getArtist(item.id)
        .then(data => {
          setRecent(recent => [...recent, getDataObject(data.body)])
        })
        .catch(error => {
          console.log(error)
        })
      }
      else if (item.type === 'album') {
        spotifyApi.getAlbum(item.id)
        .then(data => {
          setRecent(recent => [...recent, getDataObject(data.body)])
        })
        .catch(error => {
          console.log(error)
        })
      }
    }
    

    useEffect(() => {
      if (!accessToken) return
      spotifyApi.setAccessToken(accessToken)
    }, [accessToken])


    useEffect(() => {
      if (!accessToken) return 

      spotifyApi.getMyTopArtists({limit : 20})
      .then(data => {
        setTopArtists(data.body.items.map(getDataObject))
      })
      .catch(error => {
        console.log(error)
      })

    } , [accessToken])


    // Get recently played tracks
    // Store top 5 ids as seeds for generating recommendations
    // Build Recently Played array by first passing response objects to createContextArray()
    // createContextArray() returns an object for each specifying type and id
    // These are then filtered by getUniqueById() to remove duplicate contexts
    // Filtered array is then passed through spotifyContextQuery() to generate the final array of objects to be rendered
    useEffect(() => {   
      if (!accessToken) return   
 
      spotifyApi.getMyRecentlyPlayedTracks({limit : 50})
      .then(data => {
        setRecentSeeds(data.body.items.slice(0, 5).map(item => item.track.id))
        let recentRaw = data.body.items.map(createContextArray)
        let recentFiltered = getUniqueById(recentRaw)
        recentFiltered.forEach(spotifyContextQuery)
      })
      .catch(error => {
        console.log(error)
      })

      return function cleanUp() {
        setRecentSeeds([])
      }
    }, [accessToken])


    // Retrieve Year in Review playlists via the Search endpoint
    useEffect(() => {
      if (!accessToken) return

      const options1 = {
        url: `https://api.spotify.com/v1/search?q=your+top+songs+2021&type=playlist`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            }
        }
      
      axios(options1)
      .then(response => {
        setTopYear(topYear => [...topYear, getDataObject(response.data.playlists.items[1])])
      })
      .catch(error => {
        console.log(error)
      })

      const options2 = {
        url: `https://api.spotify.com/v1/search?q=your+artists+revealed&type=playlist`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            }
      }
      
      axios(options2)
      .then(response => {
        setTopYear(topYear => [...topYear, getDataObject(response.data.playlists.items[0])])
      })
      .catch(error => {
        console.log(error)
      })

      return function cleanUp() {
        setTopYear([])
      }
    }, [accessToken])

    
    // Generate arrays for 'More like {artist}' and 'Album picks'
    // Based on randomised index into topArtists array
    useEffect(() => {
      if (!accessToken) return     
      if (topArtists.length < 20) return

      var artistIndex = Math.floor(Math.random() * (11 - 5) + 5)
      
      setRelatedArtistsSeed(topArtists[artistIndex].name)

      spotifyApi.getRecommendations({
        seed_artists: [topArtists[artistIndex].key],
        min_popularity: 50
      })
      .then(data => {
        setMoreLike(data.body.tracks.map(track => getDataObject(track.album)))
      })
      .catch(error => {
        console.log(error)
      })
     
     spotifyApi.getRecommendations({
       seed_artists: [topArtists[1].key, topArtists[2].key, topArtists[3].key],
       min_popularity: 50
     })
     .then(data => {
       setRecommend(data.body.tracks.map(track => getDataObject(track.album)))
     })
     .catch(error => {
       console.log(error)
     })

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
      
      spotifyApi.searchPlaylists(topArtists[artistIndex].name)
      .then(data => {
        let playlists = data.body.playlists.items.filter(item => item.owner.display_name === 'Spotify')
        playlists.forEach(item => {
          spotifyApi.getPlaylist(item.id)
          .then(data => {
            let obj = getDataObject(data.body)
            setCustomArtistPanel(customArtistPanel => [...customArtistPanel, obj])
          })
          .catch(error => {
            console.log(error)
          })
        })        
      })
      .catch(error => {
        console.log(error)
      })

      spotifyApi.getArtistAlbums(topArtists[artistIndex].key, {album_type: 'album', limit: 4})
      .then(data => {
        data.body.items.forEach(item => {
          spotifyApi.getAlbum(item.id)
          .then(data => {
          let obj = getDataObject(data.body)
          setCustomArtistPanel(customArtistPanel => [...customArtistPanel, obj])
          })
          .catch(error => {
            console.log(error)
          })
        })
        
      })
      .catch(error => {
        console.log(error)
      })

    }, [accessToken, topArtists])


    // Generate array for 'Recommended for today' panel
    // Same pattern as used above for generating 'Album picks' and 'More like {artist}'
    // Only difference being the seeds are derived from recently played tracks rather than top artists
    useEffect(() => {
      if (recentSeeds.length === 0) return

      spotifyApi.getRecommendations({
        seed_tracks: recentSeeds,
        min_popularity: 50
      })
      .then(data => {
        setForToday(data.body.tracks.map(track => getDataObject(track.album)))
      })
      .catch(error => {
        console.log(error)
      })

      return function cleanUp() {
        setForToday([])
      }
    }, [recentSeeds])


    // Finish loading and render page once all necessary API queries have been sent and arrays constructed
    useEffect(() => {
      if (recent.length < 5) return
      if (moreLike.length < 5) return
      if (recommend.length < 5) return
      if (customArtistPanel.length < 5) return

      setLoading(false)

      return function cleanUp() {
        setLoading(true)
      }     
    }, [recent, moreLike, recommend, customArtistPanel])
    
    
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
        {(month === 11)?
        <div>
          <span className='panelTitle'>{'Your ' + year + ' in review'}</span>
          <Panel content={topYear} />
        </div>
        :
        <></>
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