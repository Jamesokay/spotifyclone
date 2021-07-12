import React from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import { Container } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import useAuth from './useAuth'
import Panel from './Panel'

const spotifyApi = new SpotifyWebApi({
    clientId: 'e39d5b5b499d4088a003eb0471c537bb'
 })

export default function Dashboard(props) {
    const code = props.code
    const accessToken = useAuth(code)
    const [topArtists, setTopArtists] = useState([])
    const [recent, setRecent] = useState([])

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
      if (!accessToken) return 

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
      
      // successfully grabs the playlistId and adds it to array
      spotifyApi.getMyRecentlyPlayedTracks({limit : 4})
      .then(data => {
         data.body.items.forEach(item => {
           if (!item.context) {
             return
           } else if (item.context.type === "playlist") {
              setRecent(recent => [...recent, item.context.uri.substr(17)])
              return
           }
         })
        })
         .catch(error => {
          console.log(error)
       })

    }, [accessToken])
    
    
   
    
    return (
    <div>
    <Container>
      <Panel props={topArtists} />
      <h3>{recent}</h3>
    </Container>
    </div>
    )
}