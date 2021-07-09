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

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    // inclusion of the topArtists stuff triggers an infinite call
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
    }, [accessToken])
   
    
    return (
    <div>
    <Container>
      <Panel props={topArtists} />
    </Container>
    </div>
    )
}