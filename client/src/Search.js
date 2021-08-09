import React, { useState, useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import { Form, Row, Col } from 'react-bootstrap'
import Panel from './Panel'
import getDataObject from './getDataObject'
import toMinsSecs from './toMinsSecs'



const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function Search({ dispatch }) {

    const accessToken = localStorage.getItem('accessToken')
    const [search, setSearch] = useState('')
    const [trackResults, setTrackResults] = useState([])
    const [artistResults, setArtistResults] = useState([])
    const [albumResults, setAlbumResults] = useState([])
    const [playlistResults, setPlaylistResults] = useState([])

    function filterByImage(array) {
        const result = array.filter(item => item.images.length > 0)
        return result
    }

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
      }, [accessToken])

    useEffect(() => {
        if (!accessToken) return
        if (!search) return

        spotifyApi.searchTracks(search, {limit: 5})
        .then(data => {
            setTrackResults(data.body.tracks.items.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    artist: item.artists[0].name,
                    duration: toMinsSecs(item.duration_ms)
                }
            }))

        })
        .catch(error => {
            console.log(error)
        })

        spotifyApi.searchArtists(search, {limit: 10})
        .then(data => {
            let artistRaw = (data.body.artists.items)
            let artistFiltered = filterByImage(artistRaw)
            setArtistResults(artistFiltered.map(getDataObject))
        })
        .catch(error => {
            console.log(error)
        })

        spotifyApi.searchAlbums(search, {limit: 10})
        .then(data => {
            let albumRaw = (data.body.albums.items)
            let albumFiltered = filterByImage(albumRaw)
            setAlbumResults(albumFiltered.map(getDataObject))
        })
        .catch(error => {
            console.log(error)
        })

        spotifyApi.searchPlaylists(search, {limit: 10})
        .then(data => {
            let playlistRaw = (data.body.playlists.items)
            let playlistFiltered = filterByImage(playlistRaw)
            setPlaylistResults(playlistFiltered.map(getDataObject))
        })
        .catch(error => {
            console.log(error)
        })

    }, [accessToken, search])

    return (
        <div>
            <h1 style={{color: 'white'}}>Search</h1>
            <Form.Control
              type='search'
              placeholder='search spotify'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <hr />
            <Row style={{color: 'white'}}>
                <Col>TRACK</Col>
                <Col>ARTIST</Col>
                <Col>TIME</Col>
            </Row>
            {trackResults.map(result => 
            <Row  style={{color: 'white'}} key={result.id}>
                <Col>{result.name}</Col>
                <Col>{result.artist}</Col>
                <Col>{result.duration}</Col>
            </Row>
            )}
            <Panel content={artistResults.slice(0, 5)} dispatch={dispatch} />
            <Panel content={albumResults.slice(0, 5)} dispatch={dispatch} />
            <Panel content={playlistResults.slice(0, 5)} dispatch={dispatch} />
        </div>
    )
}
