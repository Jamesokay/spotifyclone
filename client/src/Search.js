import React, { useState, useEffect, useContext } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import Panel from './Panel'
import getDataObject from './getDataObject'
import toMinsSecs from './toMinsSecs'
import { AuthContext } from './AuthContext'
import TracksTable from './TracksTable'



const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function Search({ dispatch }) {

    const accessToken = useContext(AuthContext)
    const [search, setSearch] = useState('')
    const [trackResults, setTrackResults] = useState([])
    const [artistResults, setArtistResults] = useState([])
    const [albumResults, setAlbumResults] = useState([])
//    const [playlistResults, setPlaylistResults] = useState([])

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
                    uri: item.uri,
                    trackImage: item.album.images[0].url,
                    name: item.name,
                    artists: item.artists,
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
            albumFiltered.forEach(item => {
              spotifyApi.getAlbum(item.id)
              .then(data => {
                  let obj = getDataObject(data.body)
                  setAlbumResults(albumResults => [...albumResults, obj])
              })
              .catch(error => {
                  console.log(error)
              })          
            })
        })
        .catch(error => {
            console.log(error)
        })

        // spotifyApi.searchPlaylists(search, {limit: 10})
        // .then(data => {
        //     let playlistRaw = (data.body.playlists.items)
        //     let playlistFiltered = filterByImage(playlistRaw)
        //     playlistFiltered.forEach(item => {
        //         spotifyApi.getPlaylist(item.id)
        //         .then(data => {  
        //             let obj = getDataObject(data.body)
        //             setPlaylistResults(playlistResults => [...playlistResults, obj])
        //         })
        //         .catch(console.log('inner error')
        //         )
        //     })
        // })
        // .catch(error => {
        //     console.log(error)
        // })

    }, [accessToken, search])

    if (search) { 
        return (
        <div className='page'>
            <form>
              <input
              className='searchBar'
              type='search'
              placeholder='Search albums, artists and playlists'
              value={search}
              onChange={e => setSearch(e.target.value)}
              />
            </form>
            <p><span className='panelTitle'>Songs</span></p>
            <TracksTable content={trackResults} dispatch={dispatch} page='search' />
            <p><span className='panelTitle'>Artists</span></p>
            <Panel content={artistResults.slice(0, 5)} dispatch={dispatch} />
            <p><span className='panelTitle'>Albums</span></p>
            <Panel content={albumResults.slice(0, 5)} dispatch={dispatch} />
            {/* <p><span className='panelTitle'>Playlists</span></p>
            <Panel content={playlistResults.slice(0, 5)} dispatch={dispatch} /> */}
        </div>
        )
    } else {
        return (
            <div className='page'>
            <form>
              <input
              className='searchBar'
              type='search'
              placeholder='Search albums, artists and playlists'
              value={search}
              onChange={e => setSearch(e.target.value)}
              />
            </form>
            </div>
        )
    }
}
