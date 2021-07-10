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
      // creation of recentlyPlayed objects
      spotifyApi.getMyRecentlyPlayedTracks({limit : 5})
        .then(data => {
          setRecent(data.body.items.map((item) => {
            if (item.context.type === 'playlist') {
              
              let uri = item.context.uri
              let playlistId = uri.substr(17)
        
              return spotifyApi.getPlaylist(playlistId)
              .then(data => {
                  return {
                      key: data.body.id,
                      name: data.body.name,
                      imgUrl: data.body.images[0].url
                  }
              })
             .catch(error => {
                console.log(error)
              })   
        
            } 
           // else if (item.context.type === 'album') {
                
        //        return {
        //            key: item.track.album.id,
        //            name: item.track.album.name,
        //            imgUrl: item.track.album.images[0].url
        //        }
        
         //   } 
            // else if (item.context.type === 'artist') {
            //    let artistId = item.context.track.artists[0].id
     
            //    return spotifyApi.getArtist(artistId)
            //    .then(data => {
            //        return {
            //            key: artistId,
            //            name: data.body.name,
            //            imgUrl: data.body.images[0].url
            //        }
            //    })
            //    .catch(error => {
            //        console.log(error)
            //    })       
          //  }
          }))
        })
      .catch(error => {
        console.log(error)
      })

    }, [accessToken])
    



    useEffect(() => {
      if (!recent) return

      console.log(recent)
    }, [recent])
    
   
    
    return (
    <div>
    <Container>
      <Panel props={topArtists} />
    </Container>
    </div>
    )
}