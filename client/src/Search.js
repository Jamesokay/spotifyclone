import React, { useState, useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import { Form, Row, Col } from 'react-bootstrap'



const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function Search({ dispatch }) {

    const accessToken = localStorage.getItem('accessToken')
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
      }, [accessToken])

    useEffect(() => {
        if (!accessToken) return
        if (!search) return

        spotifyApi.searchTracks(search)
        .then(data => {
            console.log(data.body)
            setSearchResults(data.body.tracks.items.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    artist: item.artists[0].name
                }
            }))

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
            </Row>
            {searchResults.map(result => 
            <Row  style={{color: 'white'}} key={result.id}>
                <Col>{result.name}</Col>
                <Col>{result.artist}</Col>
            </Row>
            )}
        </div>
    )
}
