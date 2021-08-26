import React, { useState, useEffect, useContext } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import toMinsSecs from './toMinsSecs'
import TracksTable from './TracksTable'
import { AuthContext } from './AuthContext'
import HeaderPanel from './HeaderPanel'
import getTotalDuration from './getTotalDuration'


const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function PlaylistPage({ id, dispatch }) {

    const accessToken = useContext(AuthContext)
    const [playlist, setPlaylist] = useState({})
    const [tracks, setTracks] = useState([])
    const [creator, setCreator] = useState('')

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
      }, [accessToken])

    useEffect(() => {
        if (!accessToken) return

        spotifyApi.getPlaylist(id)
        .then(data => {
         //   console.log(data.body)
            spotifyApi.getUser(data.body.owner.id)
            .then(data => {
              setCreator(data.body.display_name)
            })
            .catch(error => {
              console.log(error)
            })

            setPlaylist({
                    title: data.body.name,
                    imgUrl: data.body.images[0].url,
                    about: data.body.description,
                    info: ' • ' 
                        + data.body.followers.total.toLocaleString('en-US') 
                        + ' likes • ' + data.body.tracks.total 
                        + ' songs, '
                        + getTotalDuration(data.body.tracks.items),
                    type: 'PLAYLIST'
            })
            
            setTracks(data.body.tracks.items.map((item, index ) => {
              if (item.track.album.images[0]) {
                return {
                  num: index + 1,
                  id: item.track.id,
                  name: item.track.name,
                  trackImage: item.track.album.images[0].url,
                  artistName: item.track.artists[0].name,
                  artistId: item.track.artists[0].id,
                  albumName: item.track.album.name,
                  albumId: item.track.album.id,
                  duration: toMinsSecs(item.track.duration_ms)
                }
              } else {
                return {
                  num: index + 1,
                  id: index,
                  name: '',
                  artistName: '',
                  artistId: index + 2,
                  albumName: '',
                  albumId: index + 3,
                  duration: ''
                }
              }

            }))
        })
        .catch(error => {
            console.log(error)
        })
    }, [accessToken, creator, id])


    return (
        <div style={{margin: 'auto', maxWidth: '1200px'}}>
          <HeaderPanel content={playlist} creator={creator} />
          <TracksTable content={tracks} dispatch={dispatch} page='playlist' />
        </div>
    )
}
