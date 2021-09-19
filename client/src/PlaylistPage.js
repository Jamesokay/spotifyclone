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
    const [creator, setCreator] = useState([])


    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
      }, [accessToken])

    useEffect(() => {
        if (!accessToken) return

        spotifyApi.getPlaylist(id)
        .then(data => {
            spotifyApi.getUser(data.body.owner.id)
            .then(data => {
              let obj = {
                name: data.body.display_name,
                id: data.body.id
              }
              setCreator(creator => [...creator, obj])
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

            let playlistUri = data.body.uri
            
            setTracks(data.body.tracks.items.map((item, index ) => {
              if (item.track.album.images[0]) {
                return {
                  num: index + 1,
                  id: item.track.id,
                  uri: item.track.uri,
                  context: playlistUri,
                  name: item.track.name,
                  trackImage: item.track.album.images[0].url,
                  artists: item.track.artists,
                  albumName: item.track.album.name,
                  albumId: item.track.album.id,
                  duration: toMinsSecs(item.track.duration_ms)
                }
              } else {
                return {
                  num: index + 1,
                  id: index,
                  name: '',
                  artists: [],
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
    }, [accessToken, id])


    return (
        <div className='page'>
          <HeaderPanel content={playlist} creators={creator} />
          <TracksTable content={tracks} dispatch={dispatch} page='playlist' />
        </div>
    )
}
