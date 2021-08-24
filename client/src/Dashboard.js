import SpotifyWebApi from 'spotify-web-api-node'
import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from './AuthContext'
import Panel from './Panel'
import getDataObject from './getDataObject'
import createContextArray from './createContextArray'

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

    function getUniqueById(array) {
      const clearUndefinedValues = array.filter(item => {
        return item !== undefined
      })
      const ids = clearUndefinedValues.map(item => item.id)      
      const filtered = clearUndefinedValues.filter(({id}, index) => !ids.includes(id, index + 1))
      return filtered
    }

    function getUniqueByArtistId(array) {
      const artistIds = []
      const filtered = []
      array.forEach(item => {
        if (!artistIds.includes(item.artists[0].id)) {
          artistIds.push(item.artists[0].id)
          filtered.push(item.artists[0].id)
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

      spotifyApi.getMyTopArtists({limit : 5})
      .then(data => {
          setTopArtists(data.body.items.map(getDataObject))
        })
      .catch(error => {
         console.log(error)
      })
    } , [accessToken] )

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
      if (topArtists[0] === undefined) return
      if (topArtists[4] === undefined) return

      setRelatedArtistsSeed(topArtists[0].name)
 
      spotifyApi.getArtistRelatedArtists(topArtists[0].key)
      .then(data => {
        setMoreLike(data.body.artists.map(getDataObject))
      })
      .catch(error => {
        console.log(error)
     })
      
     spotifyApi.getRecommendations({
       seed_artists: [topArtists[0].key, topArtists[1].key, topArtists[2].key, topArtists[3].key, topArtists[4].key],
       min_popularity: 50
     })
     .then(data => {
       let recommendRaw = data.body.tracks
       let uniqueArtistIds = getUniqueByArtistId(recommendRaw)
       uniqueArtistIds.forEach(id => {
         spotifyApi.getArtist(id)
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
    
    
    return (
      <div style={{margin: 'auto', maxWidth: '1200px'}}>
        <Panel title='Recent' content={recent.slice(0, 5)} dispatch={dispatch} />
        <Panel title={'More like ' + relatedArtistsSeed} content={moreLike.slice(0, 5)} dispatch={dispatch} />
        <Panel title='Recommended for you' content={recommend.slice(0, 5)} dispatch={dispatch} />     
      </div>
    )
}        