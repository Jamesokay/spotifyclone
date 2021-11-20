import SpotifyWebApi from 'spotify-web-api-node'
import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from './AuthContext'
import Panel from './Panel'
import getDataObject from './getDataObject'
import createContextArray from './createContextArray'
import PanelGrid from './PanelGrid'
import Loader from './Loader'

const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function Dashboard() {
    const accessToken = useContext(AuthContext)
    const [topArtists, setTopArtists] = useState([])
//    const [topTracks, setTopTracks] = useState([])
    const [recent, setRecent] = useState([])
    const [recentSeeds, setRecentSeeds] = useState([])
    const [forToday, setForToday] = useState([])
    const [moreLike, setMoreLike] = useState([])
    const [recommend, setRecommend] = useState([])
    const [relatedArtistsSeed, setRelatedArtistsSeed] = useState('')
    const [customArtistPanel, setCustomArtistPanel] = useState([])
    const [customArtistName, setCustomArtistName] = useState([])
    const [loading, setLoading] = useState(true)

    const date = new Date()
    const time = date.toLocaleTimeString('en-GB')
    const timeMod = parseInt(time.replace(/:/g, ''))
    const greeting = greetingMessage(timeMod)
    



    function greetingMessage(time) {
      if (time < 120000) {
        return 'Good Morning'
      }
      else if (time >= 120000 && time < 175959) {
        return 'Good Afternoon'
      }
      else if (time >= 180000) {
        return 'Good Evening'
      }
    }

    
    function getUniqueById(array) {
        const clearUndefinedValues = array.filter(item => {
            return item !== undefined
          })
          const ids = clearUndefinedValues.map(item => item.id)      
          const filtered = clearUndefinedValues.filter(({id}, index) => !ids.includes(id, index + 1))
          return filtered
    }

    function getUniqueByAlbumId(array) {
      const albumIds = []
      const filtered = []
      array.forEach(item => {
        if (!albumIds.includes(item.album.id)) {
          albumIds.push(item.album.id)
          filtered.push(item.album.id)
        }
      })
      return filtered    
    }

  function spotifyContextQuery(item) {
 
    if (!item.type) {
      return
    }
    else if (item.type === 'playlist') {
      spotifyApi.getPlaylist(item.id)
      .then(data => {
        let obj = getDataObject(data.body)
        setRecent(recent => [...recent, obj])
      })
      .catch(error => {
        console.log(error)
      })
    }
    else if (item.type === 'artist') {
      spotifyApi.getArtist(item.id)
      .then(data => {
        let obj = getDataObject(data.body)
        setRecent(recent => [...recent, obj])
      })
      .catch(error => {
        console.log(error)
      })
    }
    else if (item.type === 'album') {
      spotifyApi.getAlbum(item.id)
      .then(data => {
        let obj = getDataObject(data.body)
        setRecent(recent => [...recent, obj])
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

      // spotifyApi.getMyTopTracks()
      // .then(data => {
      //   setTopTracks(data.body.items.map(item => item.id))
      // })
      // .catch(error => {
      //   console.log(error)
      // })

      spotifyApi.getMyTopArtists({limit : 20})
      .then(data => {
          setTopArtists(data.body.items.map(getDataObject))
        })
      .catch(error => {
         console.log(error)
      })
    } , [accessToken])

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

    useEffect(() => {
      if (!accessToken) return     
      if (topArtists.length < 20) return

      var artistIndex = Math.floor(Math.random() * (11 - 5) + 5)
      

      setRelatedArtistsSeed(topArtists[artistIndex].name)
 
    //   spotifyApi.getArtistRelatedArtists(topArtists[artistIndex].key)
    //   .then(data => {
    //     setMoreLike(data.body.artists.map(getDataObject))
    //   })
    //   .catch(error => {
    //     console.log(error)
    //  })

     spotifyApi.getRecommendations({
      seed_artists: [topArtists[artistIndex].key],
      min_popularity: 50
    })
    .then(data => {
      let uniqueAlbumIds = getUniqueByAlbumId(data.body.tracks)
      uniqueAlbumIds.forEach(id => {
        spotifyApi.getAlbum(id)
        .then(data => {
          if (data.body.artists[0].id === topArtists[artistIndex].key) return
          let obj = getDataObject(data.body)
          setMoreLike(moreLike => [...moreLike, obj])
        })
      })
    })
    .catch(error => {
      console.log(error)
    })
     
     spotifyApi.getRecommendations({
       seed_artists: [topArtists[1].key, topArtists[2].key, topArtists[3].key],
       min_popularity: 50
     })
     .then(data => {
       let uniqueAlbumIds = getUniqueByAlbumId(data.body.tracks)
       uniqueAlbumIds.forEach(id => {
         spotifyApi.getAlbum(id)
         .then(data => {
           if (data.body.artists[0].id === topArtists[1].key || data.body.artists[0].id === topArtists[2].key || data.body.artists[0].id === topArtists[3].key || data.body.artists[0].id === topArtists[artistIndex].key) return
           let obj = getDataObject(data.body)
           setRecommend(recommend => [...recommend, obj])
         })
       })
     })
     .catch(error => {
       console.log(error)
     })

    }, [accessToken, topArtists])

    useEffect(() => {
      if (!accessToken) return
      if (topArtists.length < 5) return
      
      var artistIndex = Math.floor(Math.random() * 4)

      setCustomArtistName(topArtists[artistIndex].name)
      
      //Artist Playlists
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

      spotifyApi.getArtistAlbums(topArtists[artistIndex].key, {album_type: 'album', limit: 5})
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
      
        {recent.length > 7?
          <PanelGrid content={recent} head={greeting}/>
          :
          <Panel content={recent.slice(0, 5)} />
        
        }



        <p><span className='panelTitle'>{'More like ' + relatedArtistsSeed}</span></p> 
        <Panel content={moreLike.slice(0, 5)} />
        <p><span className='panelTitle'>Album picks</span></p> 
        <Panel content={recommend.slice(0, 5)} />   
        <p><span className='panelTitle'>{'For fans of ' + customArtistName}</span></p> 
        <Panel content={customArtistPanel.slice(0, 5)} /> 
        <p><span className='panelTitle'>Recommended for today</span></p>
        <Panel content={forToday.slice(0, 5)} />

      </div>
    )
}        