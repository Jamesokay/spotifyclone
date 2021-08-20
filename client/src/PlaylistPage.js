import React, { useState, useEffect, useContext } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import toMinsSecs from './toMinsSecs'
import TracksTable from './TracksTable'
import { AuthContext } from './AuthContext'
import HeaderPanel from './HeaderPanel'


const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function PlaylistPage({ id, dispatch }) {

    const accessToken = useContext(AuthContext)
    const [playlist, setPlaylist] = useState({})
    const [tracks, setTracks] = useState([])

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
      }, [accessToken])

    useEffect(() => {
        if (!accessToken) return

        spotifyApi.getPlaylist(id)
        .then(data =>{
            setPlaylist({
                    title: data.body.name,
                    imgUrl: data.body.images[0].url,
                    about: data.body.description,
                    info: data.body.owner.id + ' • ' 
                        + data.body.followers.total 
                        + ' likes • ' + data.body.tracks.total 
                        + ' songs',
                    type: 'PLAYLIST'
            })
            setTracks(data.body.tracks.items.map(item => {
                return {
                  id: item.track.id,
                  name: item.track.name,
                  artistName: item.track.artists[0].name,
                  artistId: item.track.artists[0].id,
                  albumName: item.track.album.name,
                  albumId: item.track.album.id,
                  duration: toMinsSecs(item.track.duration_ms)
                }
            }))
        })
        .catch(error => {
            console.log(error)
        })
    }, [accessToken, id])

    useEffect(() => {
        if (!accessToken) return
        if (!playlist) return
        console.log(playlist)
    }, [accessToken, playlist])
      


    return (
        <div style={{margin: 'auto', maxWidth: '1200px'}}>
          <HeaderPanel content={playlist} />
          <TracksTable content={tracks} dispatch={dispatch} page='playlist' />
          <button className='btn btn-dark btn-lg' onClick={() => dispatch({type: 'DASHBOARD'})}>Home</button> 
        </div>
    )
}
