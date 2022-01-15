import React, { useState, useEffect, useContext } from 'react'
import Panel from '../components/Panel'
import getDataObject from '../utils/getDataObject'
import { AuthContext, ThemeContext, TrackContext, RightClickContext, SideBarWidthContext } from '../contexts'
import TracksTable from '../components/TracksTable'
import axios from 'axios'
import playTrack from '../utils/playTrack'
import pauseTrack from '../utils/pauseTrack'
import Menu from '../components/Menu'
import { Link } from 'react-router-dom'
import useViewport from '../hooks/useViewPort'
import getTrackObject from '../utils/getTrackObject'


export default function Search() {

    const accessToken = useContext(AuthContext)
    const [search, setSearch] = useState('')
    const [trackResults, setTrackResults] = useState([])
    const [artistResults, setArtistResults] = useState([])
    const [albumResults, setAlbumResults] = useState([])
    const [playlistResults, setPlaylistResults] = useState([])
    const [topResult, setTopResult] = useState({
        name: '',
        creator: '',
        imgUrl: '',
        type:''
    })
    const [topResultPlaying, setTopResultPlaying] = useState(false)
    const { setCurrentTheme } = useContext(ThemeContext)
    const { nowPlaying } = useContext(TrackContext)
    const { setRightClick } = useContext(RightClickContext)
    const [userArtists, setUserArtists] = useState([])
//    const [userTracks, setUserTracks] = useState([])
    const [featuringArtist, setFeaturingArtist] = useState([])
    const [loading, setLoading] = useState(true)
    const [topResultWidth, setTopResultWidth] = useState(37.5)
    const { width } = useViewport()
    const { currentWidth } = useContext(SideBarWidthContext)
    const breakPointLarge = 1055
    const breakPointSmall = 850

    // Function for generating a personalized top result by cross-referencing search results with user's top artists
    // If no match found, function will simply return the first artist in the artist results array
    function getTopResult(userArray, artists, albums, tracks) {
      for (const artist of artists) {
        if (userArray.includes(artist.id)) {
          return({
            name: artist.name,
            id: artist.id,
            creator: '',
            imgUrl: artist.images[0].url,                  
            type: 'ARTIST'
          })
        }
      }

      for (const album of albums) {
        if (userArray.includes(album.artists[0].id)) {
          return({
            name: album.name,
            id: album.id,
            creator: album.artists[0].name,
            imgUrl: album.images[0].url,                  
            type: 'ALBUM',
            data: {context_uri: album.uri},
                    uri: album.uri
          })
        }
      }

      for (const track of tracks) {
        if (userArray.includes(track.artists[0].id)) {
          return({
            name: track.name,
            id: track.id,
            creator: track.artists[0].name,
            imgUrl: track.album.images[0].url,                  
            type: 'TRACK',
            data: {context_uri: track.album.uri,
                    offset: { uri: track.uri }},  
            context: track.album.uri,
            uri: track.uri               
          })
        }
      }

      return({
        name: artists[0].name,
        id: artists[0].id,
        creator: '',
        imgUrl: artists[0].images[0].url,                  
        type: 'ARTIST'
      })
    }


    // Set NavBar to black
    useEffect(() => {
        setCurrentTheme({red: 0, green: 0, blue: 0}) 
    }, [setCurrentTheme])


    // Make top result card responsive to viewport breakpoints
    useEffect(() => {
        if ((width - currentWidth) <= breakPointSmall) {
          setTopResultWidth(61)
        }
        else if ((width - currentWidth) > breakPointSmall && (width - currentWidth) < breakPointLarge) {
          setTopResultWidth(46.4)
        }
        else if ((width - currentWidth) >= breakPointLarge) {
          setTopResultWidth(37.5)
        }

        return () => {
            setTopResultWidth(37.5)
        }
    }, [width, currentWidth])


    // API call to get user's top artists
    useEffect(() => {
        const optionsArtists = {
            url: `https://api.spotify.com/v1/me/top/artists`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                }
            }
        
        const getUserArtists = async () => {
            try {
                const response = await axios(optionsArtists)
                setUserArtists(response.data.items.map(item => item.id))
            } catch (err) {
                console.error(err)
            }
        }

        // const optionsTracks = {
        //     url: `https://api.spotify.com/v1/me/top/tracks`,
        //     method: 'GET',
        //     headers: {
        //         'Authorization': `Bearer ${accessToken}`,
        //         'Content-Type': 'application/json',
        //         }
        //     }
        
        // const getUserTracks = async () => {
        //     try {
        //         const response = await axios(optionsTracks)
        //         setUserTracks(response.data.items.map(item => item.id))
        //     } catch (err) {
        //         console.error(err)
        //     }
        // }

        getUserArtists()
     //   getUserTracks()

        return () => {
            setUserArtists([])
        }       
    }, [accessToken])


    // Search query
    useEffect(()=> {
        if (!search) return

        let query = search.replace(/ /g, '+')

        const options = {
            url: `https://api.spotify.com/v1/search?q=${query}&type=track,artist,album,playlist`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                }
            }
        
        const searchQuery = async () => {
            try {
                const response = await axios(options)
                setTrackResults(response.data.tracks.items.map((item, index) => getTrackObject(item, index, '')))
                setTopResult(getTopResult(userArtists, response.data.artists.items, response.data.albums.items, response.data.tracks.items))
                setArtistResults(response.data.artists.items.map(getDataObject))
                setAlbumResults(response.data.albums.items.map(getDataObject))
                setPlaylistResults(response.data.playlists.items.map(getDataObject))
            } catch (err) {
                console.error(err)
            }
        }
        
        searchQuery()

        return () => {
            setTrackResults([])
            setArtistResults([])
            setAlbumResults([])
            setPlaylistResults([])
            setTopResult({})
        }
    }, [search, accessToken, userArtists])

    
    // 1 second timeout while search results render
    useEffect(() => {
        if (!search) return
        setLoading(true)
        const awaitSearch = setTimeout(() => { 
            setLoading(false) }, 1000)
        return () => {
            setLoading(true)
            clearTimeout(awaitSearch)}
    }, [search])


    // Generate additional 'Featuring {Artist}' panel if top result is of type 'ARTIST'
    useEffect(() => {
        if (topResult.type !== 'ARTIST') return

        const options = {
            url: `https://api.spotify.com/v1/search?q=${topResult.name}&type=playlist`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                }
            }

        const getFeaturingArtist = async () => {
            try {
                const response = await axios(options)
                let playlists = response.data.playlists.items.filter(item => item.owner.id === 'spotify')
                setFeaturingArtist(playlists.map(getDataObject))
            } catch (err) {
                console.error(err)
            }
        }   
        
        getFeaturingArtist()

        return () => {
            setFeaturingArtist([])
        }
    }, [topResult, accessToken])


    // Play/pause button logic for top result card
    useEffect(() => {
        if (!topResult.uri) return

        if (topResult.uri === nowPlaying.trackUri || topResult.uri === nowPlaying.contextUri) {
            setTopResultPlaying(true)
        }
        else {
            setTopResultPlaying(false)
        }

        return () => {
            setTopResultPlaying(false)
        }
    }, [topResult, topResult.uri, nowPlaying.trackUri, nowPlaying.contextUri])


        return (
        <div id='page'>
        <Menu/>
            <form>
              <input
              className='searchBar'
              type='search'
              placeholder='Search albums, artists and playlists'
              value={search}
              spellCheck='false'
              onChange={e => {
                  setSearch(e.target.value)
                  }}
              />
            </form>
        {(search)?
            <div id='searchResults' style={(loading)? {visibility: 'hidden'} : {visibility: 'visible'}}>        
            <div id='searchResultsHead'>

          <Link id='topResultLink' style={{width: topResultWidth + '%'}} to={{pathname: `/${topResult.type}/${topResult.id}`, state: topResult.id }}
                onContextMenu={(e) => setRightClick({type: topResult.type, yPos: e.screenY, xPos: e.screenX, id: topResult.id})}> 
            <div id='topResultContainer'>
            <span className='resultTitle'>Top result</span>
            <div id='topResult'>
                <img id={(topResult.type === 'ARTIST')? 'topResultImageArtist' : 'topResultImage'} 
                     src={topResult.imgUrl} 
                     alt=''></img>
                <p id='topResultTitle'>{topResult.name}</p>               
                <span id='topResultSub' style={(topResult.type === 'ARTIST')? {marginLeft: '10px'} : {marginLeft: '20px'}}>{topResult.creator}</span>
                <div id='topResultsType'><span>{topResult.type}</span></div>

                {(topResult.type !== 'ARTIST')?
                <div id='topResultPlayButton'
                     style={(topResultPlaying)? {opacity: '1', bottom: '20px'} : {opacity: '0'}}                    
                    onClick={(e) => {
                    e.preventDefault()
                    if (topResult.type === 'TRACK') {
                      if (topResult.uri === nowPlaying.trackUri && !nowPlaying.isPaused) {
                        pauseTrack(accessToken)
                      }
                      else if (topResult.uri === nowPlaying.trackUri && nowPlaying.isPaused) {
                       playTrack(accessToken)
                      }
                      else {
                       playTrack(accessToken, topResult.data)
                       } 
                    }
                    else {
                        if (topResult.uri === nowPlaying.contextUri && !nowPlaying.isPaused) {
                            pauseTrack(accessToken)
                        }
                        else if (topResult.uri === nowPlaying.contextUri && nowPlaying.isPaused) {
                            playTrack(accessToken)
                        }
                        else {
                            playTrack(accessToken, topResult.data)
                        }
                    }
                }}>    
                    <div className={(!nowPlaying.isPaused && topResultPlaying)? 'topResultPauseIcon' : 'topResultPlayIcon'}></div>
                </div>
                 : 
                <div id='topResultPlayButton'>    
                    <div className={(!nowPlaying.isPaused && topResult.context === nowPlaying.contextUri)? 'topResultPauseIcon' : 'topResultPlayIcon'}></div>
                </div>
                }
            </div>
        </div>
        </Link>
            
            <div>
            <span className='resultTitle'>Songs</span>
              <TracksTable content={trackResults.slice(0, 4)} page='search' />
            </div>

            </div>
            {(featuringArtist.length > 0)?
            <div>
              <span className='panelTitle'>Featuring {topResult.name}</span>
              <Panel content={featuringArtist} panelVariant='true'/> 
            </div>
            :
            <div></div>
            }
            <span className='panelTitle'>Artists</span>
            <Panel content={artistResults} />
            <span className='panelTitle'>Albums</span>
            <Panel content={albumResults} />
            <span className='panelTitle'>Playlists</span>
            <Panel content={playlistResults} />
            </div>
            
            :

            <> </>
        } 
        </div> 
       )     
  
}
