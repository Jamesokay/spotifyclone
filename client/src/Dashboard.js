import React from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import { useState, useEffect } from 'react'
import useAuth from './useAuth'
import Panel from './Panel'
import getDataObject from './getDataObject'
import createContextArray from './createContextArray'

const spotifyApi = new SpotifyWebApi({
    clientId: 'e39d5b5b499d4088a003eb0471c537bb'
 })

export default function Dashboard({ code, dispatch }) {
    const accessToken = useAuth(code)
    const [topArtists, setTopArtists] = useState([])
    const [recent, setRecent] = useState([])
    const [recentRaw, setRecentRaw] = useState([])
    const [moreLike, setMoreLike] = useState([])
    

//    const [essentialArtist, setEssentialArtist] = useState([])
//    const [recommend, setRecommend] = useState([])

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
        localStorage.setItem('access', accessToken)
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
      
      // Recent Contexts 
      spotifyApi.getMyRecentlyPlayedTracks({limit : 50})
      .then(data => {
        console.log(data.body.items)
        setRecentRaw(createContextArray(data.body.items))
      })
      .catch(error => {
        console.log(error)
      })

    }, [accessToken])

    useEffect(() => {
      if (!accessToken) return
      // This seperation is important, setRecent needs to be in THIS useEffect to render correctly    
      setRecent(recentRaw)
      console.log(recentRaw)
    }, [recentRaw, accessToken])

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
        <Panel content={recent.slice(0, 5)} dispatch={dispatch}/>
        <Panel content={moreLike.slice(0, 5)} dispatch={dispatch}/>        
      </div>
    )
}        