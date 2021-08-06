import React, { useState, useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import { Row, Col } from 'react-bootstrap'


const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function PlaylistPage({ id }) {

    const accessToken = localStorage.getItem('accessToken')
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
                  albumName: item.track.album.name,
                  duration: item.track.duration_ms
                }
            }))
        })
        .catch(error => {
            console.log(error)
        })
    }, [accessToken, id])
      


    return (
        <div>
          <h2 style={{color: 'white'}}>{playlistname}</h2>
          <img alt='' src={playlistImg} />
          <p>{about}</p>
          <Row style={{color: 'white'}}>
              <Col>TITLE</Col>
              <Col>ALBUM</Col>
              <Col>TIME</Col>
          </Row>
          <hr />
          {tracks.map(track =>
            <Row key={track.id}>
                <Col><span style={{color: 'white'}}>{track.name}</span> <br /> {track.artistName} </Col>
                <Col>{track.albumName}</Col>
                <Col>{track.duration}</Col>
            </Row>
          )}
        </div>
    )
}
