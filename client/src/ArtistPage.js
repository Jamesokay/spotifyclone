import React, { useState, useEffect, useContext } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import getDataObject from './getDataObject'
import Panel from './Panel'
// import toMinsSecs from './toMinsSecs'
import TracksTable from './TracksTable'
import { AuthContext } from './AuthContext'


const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function ArtistPage({ id, dispatch }) {
    
    const accessToken = useContext(AuthContext)
    const [artistName, setArtistName] = useState('')
    const [artistImgUrl, setArtistImgUrl] = useState('')
    const [artistAlbums, setArtistAlbums] = useState([])
    const [artistTracks, setArtistTracks] = useState([])

    function checkPopularity(id) {      
        spotifyApi.getAlbum(id)
        .then(data => {
          if (data.body.popularity > 40) {
            let obj = getDataObject(data.body)
            setArtistAlbums(artistAlbums => [...artistAlbums, obj])
          }
        })
        .catch(error => {
            console.log(error)
        })
    }

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

        spotifyApi.getArtistAlbums(id, {limit: 50})
        .then(data => {
            console.log(data.body)
            let albumsIds = data.body.items.map(item => item.id)
            albumsIds.forEach(checkPopularity)
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

    // useEffect(() => {
    //     if (!accessToken) return
    //     if (!artistAlbums) return
    //     console.log(artistAlbums)
    // }, [accessToken, artistAlbums])


    return (
        <div>
          <h2 style={{color: 'white'}}>{artistName}</h2>
          <img alt='' src={artistImgUrl} />
          <TracksTable content={artistTracks} dispatch={dispatch} page='artist' />
          <Panel content={artistAlbums.slice(0, 5)} dispatch={dispatch} />
        </div>
    )
}
