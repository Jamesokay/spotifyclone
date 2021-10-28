import React, { useState, useEffect, useContext } from 'react'
// import getDataObject from './getDataObject'
import toMinsSecs from './toMinsSecs'
import { AuthContext } from './AuthContext'
import TracksTable from './TracksTable'
import axios from 'axios'


export default function Search() {

    const accessToken = useContext(AuthContext)
    const [search, setSearch] = useState('')
    const [trackResults, setTrackResults] = useState([])
//    const [artistResults, setArtistResults] = useState([])
//    const [albumResults, setAlbumResults] = useState([])


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


    if (search) { 
        return (
        <div>
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
            <TracksTable content={trackResults.slice(0, 10)} page='playlistRecommend' />
            </div>
        </div>
        )
    } else {
        return (
            <div>
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