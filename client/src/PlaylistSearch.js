import React, { useState, useEffect, useContext } from 'react'
// import getDataObject from './getDataObject'
import toMinsSecs from './toMinsSecs'
import { AuthContext } from './AuthContext'
import { PlaylistContext } from './PlaylistContext'
import TracksTable from './TracksTable'
import axios from 'axios'


export default function Search() {

    const accessToken = useContext(AuthContext)
    const [search, setSearch] = useState('')
    const [trackResults, setTrackResults] = useState([])
//    const [artistResults, setArtistResults] = useState([])
//    const [albumResults, setAlbumResults] = useState([])
    const { newTrack } = useContext(PlaylistContext)
    


    useEffect(()=> {
        if (!search) return

        let query = search.replace(/ /g, '+')

        const options = {
            url: `https://api.spotify.com/v1/search?q=${query}&type=track,artist,album`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                }
            }
        
          axios(options)
          .then(response => {
            console.log(response.data)
              setTrackResults(
                  response.data.tracks.items.map(item => {
                        return {
                            id: item.id,
                            uri: item.uri,
                            trackImage: item.album.images[0].url,
                            albumName: item.album.name,
                            name: item.name,
                            artists: item.artists,
                            duration: toMinsSecs(item.duration_ms)
                        }
              }))
          //    setArtistResults(response.data.artists.items.map(getDataObject))
          //    setAlbumResults(response.data.albums.items.map(getDataObject))
          })
          .catch(error => {
            console.log(error)
          })
    }, [search, accessToken])

    useEffect(() => {
        if (!newTrack) return
        if (!newTrack.name) return
        
        setTrackResults(trackResults => trackResults.filter(item => item.id !== newTrack.id))
        
      }, [newTrack, newTrack.name])


    if (search) { 
        return (
        <div style={{minHeight: '50vh'}}>
            <form>
              <input
              className='playlistSearchBar'
              type='search'
              placeholder='Search for songs'
              value={search}
              spellCheck='false'
              onChange={e => setSearch(e.target.value)}
              />
            </form>
            <div id='searchResults'>
            <TracksTable content={trackResults} page='playlistRecommend' />
            </div>
        </div>
        )
    } else {
        return (
            <div style={{minHeight: '50vh'}}>
            <form>
              <input
              className='playlistSearchBar'
              type='search'
              placeholder='Search for songs'
              value={search}
              onChange={e => setSearch(e.target.value)}
              />
            </form>
            </div>
        )
    }
}