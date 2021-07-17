import React from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import { Container } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import useAuth from './useAuth'
import Panel from './Panel'
import getDataObject from './getDataObject'
import createContextArray from './createContextArray'

const spotifyApi = new SpotifyWebApi({
    clientId: 'e39d5b5b499d4088a003eb0471c537bb'
 })

export default function Dashboard({ code }) {
    const accessToken = useAuth(code)
    const [topArtists, setTopArtists] = useState([])
    const [recent, setRecent] = useState([])
    const [moreLike, setMoreLike] = useState([])
    const [essentialArtist, setEssentialArtist] = useState([])
    const [recommend, setRecommend] = useState([])

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
      setRecent(createContextArray())

    }, [accessToken])

    useEffect(() => {
      if (!recent) return
      if (!accessToken) return
      console.log(recent)
    }, [recent, accessToken])

    useEffect(() => {
      if (!accessToken) return
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
      spotifyApi.getArtistAlbums(topArtists[2].key)
      .then(data => {
        setEssentialArtist(data.body.items.map(getDataObject))
      })
      .catch(error => {
        console.log(error)
      })
      
      // Recommended For You
      spotifyApi.getRecommendations({
        seed_artists: [topArtists[3].key, topArtists[4].key],
        min_popularity: 50
      })
      .then(data => {
        data.body.tracks.forEach(item => {
          spotifyApi.getArtist(item.artists[0].id)
          .then(data => {
            let obj = getDataObject(data)
            setRecommend(recommend => [...recommend, obj])
          })
        })
      })
      .catch(error => {
        console.log(error)
      })

    }, [accessToken, topArtists])
    
    
    return (
    <div>
    <Container>
      <Panel name='Top Artists' content={topArtists} />
      <Panel name='Recently Played' content={recent} />
      <Panel name='More Like That Artist You Like' content={moreLike.slice(0, 5)} />
      <Panel name='Essential Somebody' content={essentialArtist.slice(0, 5)} />
      <Panel name='Recommended For You' content={recommend.slice(0, 5)} />
    </Container>
    </div>
    )
}