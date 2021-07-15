import React from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import { Container } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import useAuth from './useAuth'
import Panel from './Panel'

const spotifyApi = new SpotifyWebApi({
    clientId: 'e39d5b5b499d4088a003eb0471c537bb'
 })

export default function Dashboard({ code }) {
    const accessToken = useAuth(code)
    const [topArtists, setTopArtists] = useState([])
    const [recent, setRecent] = useState([])
    const [moreLike, setMoreLike] = useState([])
    const [essentialArtist, setEssentialArtist] = useState([])

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
      if (!accessToken) return 

      // Top Artists - extract
      spotifyApi.getMyTopArtists({limit : 5})
      .then(data => {
          setTopArtists(data.body.items.map(artist => {
            return {
              key: artist.id,
              name: artist.name,
              imgUrl: artist.images[0].url
            }
          }))
        })
      .catch(error => {
         console.log(error)
      })
      
      // Recent Contexts - extract 
      spotifyApi.getMyRecentlyPlayedTracks({limit : 50})
      .then(data => {
        
        const recentIds = []
      
        data.body.items.forEach(item => {

          if (!item.context) {            
            return          
          } 
          else if (item.context.type === "playlist" && !recentIds.includes(item.context.uri.substr(17))) {
            recentIds.push(item.context.uri.substr(17))
      
            spotifyApi.getPlaylist(item.context.uri.substr(17))
            .then(data => {             
              let obj = {
                key: data.body.id,
                name: data.body.name,
                imgUrl: data.body.images[0].url
              }
              setRecent(recent => [...recent, obj])              
            })
              return
          }
          else if (item.context.type === 'album' && !recentIds.includes(item.track.album.id)) {
            recentIds.push(item.track.album.id)
           
              let obj = {
                key: item.track.album.id,
                name: item.track.album.name,
                imgUrl: item.track.album.images[0].url
              }
              setRecent(recent => [...recent, obj])
              return        
          }
          else if (item.context.type === 'artist' && !recentIds.includes(item.track.artists[0].id)) {
            recentIds.push(item.track.artists[0].id)
      
            spotifyApi.getArtist(item.track.artists[0].id)
            .then(data => {
              let obj = {
                key: data.body.id,
                name: data.body.name,
                imgUrl: data.body.images[0].url
              }
              setRecent(recent => [...recent, obj])
            })
            return
          } 
        })
      })
         .catch(error => {
          console.log(error)
       })

    }, [accessToken])

    useEffect(() => {
      if (!accessToken) return
      if (topArtists[0] === undefined) return
      if (topArtists[2] === undefined) return

      spotifyApi.getArtistRelatedArtists(topArtists[0].key)
      .then(data => {
        setMoreLike(data.body.artists.map(artist => {
          return {
            key: artist.id,
            name: artist.name,
            imgUrl: artist.images[0].url
          }
        }))
      })
      .catch(error => {
        console.log(error)
     })

      spotifyApi.getArtistAlbums(topArtists[2].key)
      .then(data => {
        setEssentialArtist(data.body.items.map(album => {
          return {
            key: album.id,
            name: album.name,
            imgUrl: album.images[0].url
          }
        }))
      })
      .catch(error => {
        console.log(error)
      })

    }, [accessToken, topArtists])
    
    
    return (
    <div>
    <Container>
      <Panel name='Top Artists' content={topArtists} />
      <Panel name='Recently Played' content={recent.slice(0, 5)} />
      <Panel name='More Like That Artist You Like' content={moreLike.slice(0, 5)} />
      <Panel name='Essential Somebody' content={essentialArtist.slice(0, 5)} />
    </Container>
    </div>
    )
}