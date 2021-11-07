import React, { useState, useEffect, useContext } from 'react'
import Panel from './Panel'
import getDataObject from './getDataObject'
import toMinsSecs from './toMinsSecs'
import { AuthContext } from './AuthContext'
import TracksTable from './TracksTable'
import axios from 'axios'


export default function Search() {

    const accessToken = useContext(AuthContext)
    const [search, setSearch] = useState('')
    const [trackResults, setTrackResults] = useState([])
    const [artistResults, setArtistResults] = useState([])
    const [albumResults, setAlbumResults] = useState([])


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
              setArtistResults(response.data.artists.items.map(getDataObject))
              setAlbumResults(response.data.albums.items.map(getDataObject))
          })
          .catch(error => {
            console.log(error)
          })
    }, [search, accessToken])


    if (search) { 
        return (
        <div id='searchPage'>
            <form>
              <input
              className='searchBar'
              type='search'
              placeholder='Search albums, artists and playlists'
              value={search}
              spellCheck='false'
              onChange={e => setSearch(e.target.value)}
              />
            </form>
            <div id='searchResults'>
            
            <div id='searchResultsHead'>
            <div id='topResult'>
                <div id='topResultImage'></div>
                <p id='topResultTitle'>Result Title</p>               
                <span id='topResultSub'>Result subtitle</span>
                <div id='topResultsType'><span>TYPE</span></div>
            </div>
            <TracksTable content={trackResults.slice(0, 4)} page='search' />
            </div>


            <p><span className='panelTitle'>Artists</span></p>
            <Panel content={artistResults.slice(0, 5)} />
            <p><span className='panelTitle'>Albums</span></p>
            <Panel content={albumResults.slice(0, 5)} />
            {/* <p><span className='panelTitle'>Playlists</span></p>
            <Panel content={playlistResults.slice(0, 5)} dispatch={dispatch} /> */}
            </div>
        </div>
        )
    } else {
        return (
            <div id='searchPage'>
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
