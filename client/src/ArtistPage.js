import React, { useState, useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import getDataObject from './getDataObject'
import Panel from './Panel'
import { Row, Col } from 'react-bootstrap'
import toMinsSecs from './toMinsSecs'


const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function ArtistPage({ id, dispatch }) {
    
    const accessToken = localStorage.getItem('accessToken')
    const [artistName, setArtistName] = useState('')
    const [artistImgUrl, setArtistImgUrl] = useState('')
    const [artistAlbums, setArtistAlbums] = useState([])
    const [artistTracks, setArtistTracks] = useState([])

    useEffect(() => {
      if (!accessToken) return
      spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
        if (!accessToken) return

        spotifyApi.getArtist(id)
        .then(data =>{
            setArtistName(data.body.name)
            setArtistImgUrl(data.body.images[0].url)
        })
        .catch(error => {
            console.log(error)
        })

        spotifyApi.getArtistAlbums(id)
        .then(data => {
            setArtistAlbums(data.body.items.map(getDataObject))
        })
        .catch(error => {
            console.log(error)
        })

        spotifyApi.getArtistTopTracks(id, 'AU')
        .then(data => {
            setArtistTracks(data.body.tracks)
        })
        .catch(error => {
            console.log(error)
        })


    }, [accessToken, id])

    useEffect(() => {
        if (!accessToken) return
        if (!artistName) return
        console.log(artistName)
    }, [accessToken, artistName])


    return (
        <div>
          <h2 style={{color: 'white'}}>{artistName}</h2>
          <img alt='' src={artistImgUrl} />
          {artistTracks.map(track =>
            <Row key={track.id}>
              <Col style={{color: 'white'}}>{track.name}</Col>
              <Col style={{color: 'white'}}>{toMinsSecs(track.duration_ms)}</Col>
            </Row>
          )}
          <Panel content={artistAlbums.slice(0, 5)} dispatch={dispatch} />
        </div>
    )
}
