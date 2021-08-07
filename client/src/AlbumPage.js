import React, { useState, useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import { Row, Col } from 'react-bootstrap'
import toMinsSecs from './toMinsSecs'


const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function AlbumPage({ id }) {
    const accessToken = localStorage.getItem('accessToken')
    const [albumName, setAlbumName] = useState('')
    const [albumImg, setAlbumImg] = useState('')
    const [tracks, setTracks] = useState([])

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
      }, [accessToken])

    useEffect(() => {
        if (!accessToken) return

        spotifyApi.getAlbum(id)
        .then(data =>{
            setAlbumName(data.body.name)
            setAlbumImg(data.body.images[0].url)
            setTracks(data.body.tracks.items.map(item => {
                return {
                  id: item.id,
                  name: item.name,
                  artistName: item.artists[0].name,
                  duration: toMinsSecs(item.duration_ms)
                }
            }))
        })
        .catch(error => {
            console.log(error)
        })
    }, [accessToken, id])
      


    return (
        <div>
          <h2 style={{color: 'white'}}>{albumName}</h2>
          <img alt='' src={albumImg} />
          <Row style={{color: 'white'}}>
              <Col>TITLE</Col>
              <Col>TIME</Col>
          </Row>
          <hr />
          {tracks.map(track =>
            <Row key={track.id}>
                <Col><span style={{color: 'white'}}>{track.name}</span> <br /> {track.artistName} </Col>
                <Col>{track.duration}</Col>
            </Row>
          )}
        </div>
    )
}