import React, { useState, useEffect, useContext } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import toMinsSecs from './toMinsSecs'
import TracksTable from './TracksTable'
import { AuthContext } from './AuthContext'


const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function PlaylistPage({ id, dispatch }) {

    const accessToken = useContext(AuthContext)
    const [playlistname, setPlaylistName] = useState('')
    const [about, setAbout] = useState('')
    const [playlistImg, setPlaylistImg] = useState('')
    const [tracks, setTracks] = useState([])

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
      }, [accessToken])

    useEffect(() => {
        if (!accessToken) return

        spotifyApi.getPlaylist(id)
        .then(data =>{
            setPlaylistName(data.body.name)
            setAbout(data.body.description)
            setPlaylistImg(data.body.images[0].url)
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
      


    return (
        <div style={{margin: 'auto', maxWidth: '1200px'}}>
          <h2 style={{color: 'white'}}>{playlistname}</h2>
          <img alt='' src={playlistImg} />
          <p>{about}</p>
          <TracksTable content={tracks} dispatch={dispatch} page='playlist' />
          <button className='btn btn-dark btn-lg' onClick={() => dispatch({type: 'DASHBOARD'})}>Home</button> 
        </div>
    )
}
