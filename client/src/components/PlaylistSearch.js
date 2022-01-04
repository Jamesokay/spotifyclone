import React, { useState, useEffect, useContext } from 'react'
import { AuthContext, PlaylistContext } from '../contexts'
import TracksTable from '../components/TracksTable'
import axios from 'axios'
import getTrackObject from '../utils/getTrackObject'


export default function Search() {

    const accessToken = useContext(AuthContext)
    const [search, setSearch] = useState('')
    const [trackResults, setTrackResults] = useState([])
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
        
        const searchQuery = async () => {
          try {
            const response = await axios(options)
            setTrackResults(response.data.tracks.items.map((item, index) => getTrackObject(item, index, item.album.uri)))
          } catch (err) {
            console.error(err)
          }
        }

        searchQuery()

        return () => {
          setTrackResults([])
        }
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