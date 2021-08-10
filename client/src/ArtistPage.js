import React, { useState, useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import getDataObject from './getDataObject'
import Panel from './Panel'
// import toMinsSecs from './toMinsSecs'
import TracksTable from './TracksTable'


const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function ArtistPage({ id, dispatch }) {
    
    const accessToken = localStorage.getItem('accessToken')
    const [artistName, setArtistName] = useState('')
    const [artistImgUrl, setArtistImgUrl] = useState('')
    const [artistAlbums, setArtistAlbums] = useState([])
    const [artistTracks, setArtistTracks] = useState([])

    function clearDuplicateAlbums(array) {
        const names = []
        const result = []     
        array.forEach(item => {
            if (!names.includes(item.name)) {
                names.push(item.name)
                result.push(item)
            }
        })
        return result
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

        spotifyApi.getArtistAlbums(id)
        .then(data => {
            console.log(data.body)
            let albumsRaw = data.body.items
            let albumsFiltered = clearDuplicateAlbums(albumsRaw)
            setArtistAlbums(albumsFiltered.map(getDataObject))
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
