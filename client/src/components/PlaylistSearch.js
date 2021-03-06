import React, { useState, useEffect, useContext } from 'react'
import { PlaylistContext } from '../contexts'
import TracksTable from '../components/TracksTable'
import getTrackObject from '../utils/getTrackObject'
import { useSelector } from 'react-redux'


export default function Search() {
    const accessToken = useSelector(state => state.user.token)
    const [search, setSearch] = useState('')
    const [trackResults, setTrackResults] = useState([])
    const { newTrack } = useContext(PlaylistContext)
    
    useEffect(()=> {
        if (!search) return
        let query = search.replace(/ /g, '+')
        const searchQuery = async () => {
          try {
            const response = fetch(`https://api.spotify.com/v1/search?q=${query}&type=track,artist,album`, {
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' }})
            if (!response.ok) {throw new Error(`An error has occured: ${response.status}`)}
            let results = await response.json()
            setTrackResults(results.tracks.items.map((item, index) => getTrackObject(item, index, item.album.uri)))
          } catch (err) { console.error(err) }
        }
        searchQuery()
        return () => { setTrackResults([]) }
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