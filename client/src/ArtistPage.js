import React, { useState, useEffect, useContext } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import Panel from './Panel'
import getDataObject from './getDataObject'
import TracksTable from './TracksTable'
import { AuthContext } from './AuthContext'
import toMinsSecs from './toMinsSecs'


const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function ArtistPage({ id, dispatch }) {
    
    const accessToken = useContext(AuthContext)
    const [artistName, setArtistName] = useState('')
    const [artistAlbumsRaw, setArtistAlbumsRaw] = useState([])
    const [artistTracks, setArtistTracks] = useState([])
    const [alsoLike, setAlsoLike] = useState([])

    function expandPanel(title, content) {
        dispatch({
          type: 'PANEL_EXPANDED',
          header: title,
          array: content
        })
    }

    function getAlbumObject(id) {
        spotifyApi.getAlbum(id)
        .then(data => {
            let obj = {
                    key: data.body.id,
                    id: data.body.id,
                    uri: data.body.uri,
                    type: 'artistAlbum',
                    name: data.body.name,
                    popularity: data.body.popularity,
                    imgUrl: data.body.images[0].url,
                    subtitle: data.body.release_date.slice(0, 4) + ' • Album',
                    firstTrack: {
                      name: data.body.tracks.items[0].name, 
                      artists: data.body.tracks.items[0].artists, 
                      imgUrl: data.body.images[0].url,
                      albumId: data.body.id
                  }
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
        })
        .catch(error => {
            console.log(error)
        })

        spotifyApi.getArtistTopTracks(id, 'AU')
        .then(data => {
            setArtistTracks(data.body.tracks.map((track, index ) => {
                return {
                    num: index + 1,
                    id: track.id,
                    uri: track.uri,
                    name: track.name,
                    trackImage: track.album.images[0].url,
                    albumId: track.album.id,
                    duration: toMinsSecs(track.duration_ms),
                    artists: track.artists
                }
            }))
        })
        .catch(error => {
            console.log(error)
        })

        spotifyApi.getArtistAlbums(id, {limit: 50, album_type: 'album'})
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
          <div className='page'>
          <p><span className='artistTitle'>{artistName}</span></p>
          <TracksTable content={artistTracks.slice(0, 5)} dispatch={dispatch} page='artist' />
          <p><span className='panelTitle'
            onClick={() => expandPanel('Albums by ' + artistName, artistAlbumsRaw)}>Albums</span></p>
          <Panel content={artistAlbumsRaw.slice(0, 5)} dispatch={dispatch} />
          <p><span className='panelTitle'
            onClick={() => expandPanel('Similar to ' + artistName, alsoLike)}>{'Similar to ' + artistName}</span></p>
          <Panel content={alsoLike.slice(0, 5)} dispatch={dispatch} /> 
          </div>
    )
}
