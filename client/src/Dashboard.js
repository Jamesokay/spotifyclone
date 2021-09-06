import SpotifyWebApi from 'spotify-web-api-node'
import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from './AuthContext'
import Panel from './Panel'
import getDataObject from './getDataObject'
import createContextArray from './createContextArray'
// import { TrackContext } from './TrackContext'

const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function Dashboard({ dispatch }) {
    const accessToken = useContext(AuthContext)
    const [topArtists, setTopArtists] = useState([])
    const [recent, setRecent] = useState([])
    const [moreLike, setMoreLike] = useState([])
    const [recommend, setRecommend] = useState([])
    const [relatedArtistsSeed, setRelatedArtistsSeed] = useState('')
    const [customArtistPanel, setCustomArtistPanel] = useState([])
    const [customArtistName, setCustomArtistName] = useState([])
//    const trackContext = useContext(TrackContext)


    function expandPanel(title, content) {
        dispatch({
          type: 'PANEL_EXPANDED',
          header: title,
          array: content
        })
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

    // useEffect(() => {
    //   if (!accessToken) return

    //   function trackChange(trackName, trackArtists, trackImage) {
    //     trackContext.setCurrentTrack({
    //       name: trackName,
    //       artists: trackArtists,
    //       imgUrl: trackImage
    //     })
    //   }

    //   spotifyApi.getMyCurrentPlayingTrack()
    //   .then(data => {
    //     console.log(data.body)
    //     trackChange(data.body.item.name, data.body.artists, data.body.item.album.images[0].url)
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })
    // }, [accessToken, trackContext])


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

    useEffect(() => {   
      if (!accessToken) return   
 
      spotifyApi.getMyRecentlyPlayedTracks({limit : 50})
      .then(data => {
        let recentRaw = data.body.items.map(createContextArray)
        let recentFiltered = getUniqueById(recentRaw)
        recentFiltered.forEach(spotifyContextQuery)
      })
      .catch(error => {
        console.log(error)
      })

    }, [accessToken])

    useEffect(() => {
      if (!accessToken) return     
      if (topArtists.length < 5) return

      setRelatedArtistsSeed(topArtists[4].name)
 
      spotifyApi.getArtistRelatedArtists(topArtists[4].key)
      .then(data => {
        setMoreLike(data.body.artists.map(getDataObject))
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

      setCustomArtistName(topArtists[0].name)
      
      //Artist Playlists
      spotifyApi.searchPlaylists(topArtists[0].name)
      .then(data => {
        let playlists = data.body.playlists.items.filter(item => item.owner.display_name === 'Spotify')
        playlists.forEach(item => {
          setCustomArtistPanel(customArtistPanel => [...customArtistPanel, getDataObject(item)])
        })        
      })
      .catch(error => {
        console.log(error)
      })

      spotifyApi.getArtistAlbums(topArtists[0].key, {album_type: 'album', limit: 5})
      .then(data => {
        data.body.items.forEach(item => {
          setCustomArtistPanel(customArtistPanel => [...customArtistPanel, getDataObject(item)])
        })
        
      })
      .catch(error => {
        console.log(error)
      })

    }, [accessToken, topArtists])

    // useEffect(() => {
    //   if (!accessToken) return
    //   if (!customArtistPanel) return
    //   console.log(customArtistPanel)
    // }, [accessToken, customArtistPanel])

    
    
    return (
      <div className='page'>
        <p><span className='panelTitle'
          onClick={() => expandPanel('Recent', recent)}>Recent</span></p> 
        <Panel content={recent.slice(0, 5)} dispatch={dispatch} />
        <p><span className='panelTitle' 
          onClick={() => expandPanel('More like ' + relatedArtistsSeed, moreLike)}>
          {'More like ' + relatedArtistsSeed}</span></p> 
        <Panel content={moreLike.slice(0, 5)} dispatch={dispatch} />
        <p><span className='panelTitle'
          onClick={() => expandPanel('Recommended for you', recommend)}>Recommended for you</span></p> 
        <Panel content={recommend.slice(0, 5)} dispatch={dispatch} />   

        <p><span className='panelTitle'
          onClick={() => expandPanel('For fans of ' + topArtists[0].name, customArtistPanel)}>{'For fans of ' + customArtistName}</span></p> 
        <Panel content={customArtistPanel.slice(0, 5)} dispatch={dispatch} />  
      </div>
    )
}        