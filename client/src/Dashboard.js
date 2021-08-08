import React from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import { useState, useEffect } from 'react'
import useAuth from './useAuth'
import Panel from './Panel'
import getDataObject from './getDataObject'
import createContextArray from './createContextArray'

const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function Dashboard({ code, dispatch }) {
    const accessToken = useAuth(code)
    const [topArtists, setTopArtists] = useState([])
    const [recent, setRecent] = useState([])
    const [moreLike, setMoreLike] = useState([])

    function getUniqueById(array) {

      const clearUndefinedValues = array.filter(item => {
        return item !== undefined
      })
 
      const ids = clearUndefinedValues.map(item => item.id)      
      const filtered = clearUndefinedValues.filter(({id}, index) => !ids.includes(id, index + 1))
      console.log(filtered)
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
        let obj = getDataObject(data)
        setRecent(recent => [...recent, obj])
      })
      .catch(error => {
        console.log(error)
      })
    }
    else if (item.type === 'album') {
      spotifyApi.getAlbum(item.id)
      .then(data => {
        let obj = getDataObject(data)
        setRecent(recent => [...recent, obj])
      })
      .catch(error => {
        console.log(error)
      })
    }
  }
    

//    const [essentialArtist, setEssentialArtist] = useState([])
//    const [recommend, setRecommend] = useState([])

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
        localStorage.setItem('accessToken', accessToken)
    }, [accessToken])

    useEffect(() => {
      if (!accessToken) return 

      // Top Artists
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
      // Recent Contexts 
      spotifyApi.getMyRecentlyPlayedTracks({limit : 50})
      .then(data => {
        let recentRaw = data.body.items.map(createContextArray)
        let recentFiltered = getUniqueById(recentRaw)
        recentFiltered.forEach(spotifyContextQuery)
        // recent will be the result of all the api queries based on type
      })
      .catch(error => {
        console.log(error)
      })

    }, [accessToken])

    useEffect(() => {
      if (!accessToken) return
      if (!recent) return
      console.log(recent)
    }, [recent, accessToken])

    useEffect(() => {
      if (!accessToken) return     
      if (topArtists[0] === undefined) return
      if (topArtists[4] === undefined) return
 
      // More Like Artist
      spotifyApi.getArtistRelatedArtists(topArtists[0].key)
      .then(data => {
        setMoreLike(data.body.artists.map(getDataObject))
      })
      .catch(error => {
        console.log(error)
     })
      
      // Essential Artist
//      spotifyApi.getArtistTopTracks(topArtists[3].key, 'AU')
//      .then(data => {
//        data.body.tracks.forEach(item => {
//          let obj = getDataObject(item.album)
//          setEssentialArtist(essentialArtist => [...essentialArtist, obj])
//        })
//      })
//      .catch(error => {
//        console.log(error)
//      })
      
      // Recommended For You
//      spotifyApi.getRecommendations({
//        seed_artists: [topArtists[0].key, topArtists[1].key, topArtists[4].key],
//        min_popularity: 50
//      })
//      .then(data => {
//        data.body.tracks.forEach(item => {
//          spotifyApi.getArtist(item.artists[0].id)
//          .then(data => {
//            let obj = getDataObject(data)
//            setRecommend(recommend => [...recommend, obj])
//          })
//        })
//      })
//      .catch(error => {
//        console.log(error)
//      })

    }, [accessToken, topArtists])
    
    
    return (
      <div>
        <Panel content={recent.slice(0, 5)} dispatch={dispatch} />
        <Panel content={moreLike.slice(0, 5)} dispatch={dispatch} />
        <button className='btn btn-dark btn-lg' onClick={() => dispatch({type: 'SEARCH_PAGE'})}>Search</button>      
      </div>
    )
}        