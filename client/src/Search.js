import React, { useState, useEffect, useContext } from 'react'
import Panel from './Panel'
import getDataObject from './getDataObject'
import toMinsSecs from './toMinsSecs'
import { AuthContext } from './AuthContext'
import { ThemeContext } from './ThemeContext'
import TracksTable from './TracksTable'
import axios from 'axios'


export default function Search() {

    const accessToken = useContext(AuthContext)
    const [search, setSearch] = useState('')
    const [trackResults, setTrackResults] = useState([])
    const [artistResults, setArtistResults] = useState([])
    const [albumResults, setAlbumResults] = useState([])
    const [topResult, setTopResult] = useState({
        name: '',
        creator: '',
        imgUrl: '',
        type:''
    })
    const { setCurrentTheme } = useContext(ThemeContext)

    const [userArtists, setUserArtists] = useState([])
  //  const [userAlbums, setUserAlbums] = useState([])
  //  const [userTracks, setUserTracks] = useState([])

    useEffect(() => {
        setCurrentTheme('0,0,0')
    }, [setCurrentTheme])

    useEffect(() => {
        const options = {
            url: `https://api.spotify.com/v1/me/top/artists`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                }
            }
        
        axios(options)
        .then(response => {
            console.log(response.data)
            setUserArtists(response.data.items.map(item => item.id))
        })
        .catch(error => {
            console.log(error)
        })
    }, [accessToken])



    // useEffect(() => {
    //     const options = {
    //         url: `https://api.spotify.com/v1/me/top/tracks`,
    //         method: 'GET',
    //         headers: {
    //             'Authorization': `Bearer ${accessToken}`,
    //             'Content-Type': 'application/json',
    //             }
    //         }
        
    //     axios(options)
    //     .then(response => {
    //         console.log(response.data)
    //     })
    //     .catch(error => {
    //         console.log(error)
    //     })
    // }, [accessToken])
    


    useEffect(()=> {
        if (!search) return

        function getTopResult(artists, albums, tracks) {
        
            for (let i = 0; i < artists.length; i ++) {
                if (userArtists.includes(artists[i].id)) {
                    return({
                        name: artists[i].name,
                        creator: '',
                        imgUrl: artists[i].images[0].url,                  
                        type: 'ARTIST'
                    })
                }
            }

            for (let i = 0; i < albums.length; i ++) {
                if (userArtists.includes(albums[i].artists[0].id)) {
                    return({
                        name: albums[i].name,
                        creator: albums[i].artists[0].name,
                        imgUrl: albums[i].images[0].url,                  
                        type: 'ALBUM'
                    })
                }
            }

            for (let i = 0; i < tracks.length; i ++) {
                if (userArtists.includes(tracks[i].artists[0].id)) {
                    return({
                        name: tracks[i].name,
                        creator: tracks[i].artists[0].name,
                        imgUrl: tracks[i].album.images[0].url,                  
                        type: 'TRACK'
                    })
                }
            }

        return({
            name: artists[0].name,
            creator: '',
            imgUrl: artists[0].images[0].url,
            type: 'ARTIST'
        })
        }

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
              setTopResult(getTopResult(response.data.artists.items, response.data.albums.items, response.data.tracks.items))
              setArtistResults(response.data.artists.items.map(getDataObject))
              setAlbumResults(response.data.albums.items.map(getDataObject))
          })
          .catch(error => {
            console.log(error)
          })

        return function cleanUp() {
            setTrackResults([])
            setArtistResults([])
            setAlbumResults([])
            setTopResult({})
        }
    }, [search, accessToken, userArtists])


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
                <img id='topResultImage' src={topResult.imgUrl} alt=''></img>
                <p id='topResultTitle'>{topResult.name}</p>               
                <span id='topResultSub'>{topResult.creator}</span>
                <div id='topResultsType'><span>{topResult.type}</span></div>
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
