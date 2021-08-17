import React, { useState, useEffect, useContext } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import Panel from './Panel'
import getDataObject from './getDataObject'
import TracksTable from './TracksTable'
import { AuthContext } from './AuthContext'


const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function ArtistPage({ id, dispatch }) {
    
    const accessToken = useContext(AuthContext)
    const [artistName, setArtistName] = useState('')
    const [artistImgUrl, setArtistImgUrl] = useState('')
    const [artistAlbumsRaw, setArtistAlbumsRaw] = useState([])
    const [artistTracks, setArtistTracks] = useState([])
    const [alsoLike, setAlsoLike] = useState([])

    function getAlbumObject(id) {
        spotifyApi.getAlbum(id)
        .then(data => {
            let obj = {
                    key: data.body.id,
                    id: data.body.id,
                    type: 'artistAlbum',
                    name: data.body.name,
                    popularity: data.body.popularity,
                    imgUrl: data.body.images[0].url,
                    subtitle: data.body.release_date.slice(0, 4) + ' • Album'
            }
            setArtistAlbumsRaw(artistAlbumsRaw => [...artistAlbumsRaw, obj])
        })
        .catch(error => {
            console.log(error)
        })
    }

    function getUniqueByName(array) {
        const names = array.map(item => item.name)      
        const filtered = array.filter(({name}, index) => !names.includes(name, index + 1))
        return filtered
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

        spotifyApi.getArtistTopTracks(id, 'AU')
        .then(data => {
            setArtistTracks(data.body.tracks)
        })
        .catch(error => {
            console.log(error)
        })

        spotifyApi.getArtistAlbums(id, {limit: 50})
        .then(data => {
            let albumsFiltered = getUniqueByName(data.body.items)
            let albumsIds = albumsFiltered.map(item => item.id)
            albumsIds.forEach(getAlbumObject)
        })
        .catch(error => {
            console.log(error)
        })

        spotifyApi.getArtistRelatedArtists(id)
        .then(data => {
          setAlsoLike(data.body.artists.map(getDataObject))
        })
        .catch(error => {
          console.log(error)
        })
      

    }, [accessToken, id])

    useEffect(() => {
        if (!accessToken) return
        if (!artistAlbumsRaw) return
            
        artistAlbumsRaw.sort(function(a, b) {
          return b.popularity - a.popularity
          })

    }, [accessToken, id, artistAlbumsRaw])



    return (
        <div>
          <h2 style={{color: 'white'}}>{artistName}</h2>
          <img alt='' src={artistImgUrl} />
          <TracksTable content={artistTracks} dispatch={dispatch} page='artist' />
          <Panel title='Albums' content={artistAlbumsRaw.slice(0, 5)} dispatch={dispatch} />
          <Panel title={'Similar to ' + artistName} content={alsoLike.slice(0, 5)} dispatch={dispatch} />
          <button className='btn btn-dark btn-lg' onClick={() => dispatch({type: 'DASHBOARD'})}>Home</button> 
        </div>
    )
}
