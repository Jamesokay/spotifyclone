import React, { useState, useEffect, useContext } from 'react'
import Panel from '../components/Panel'
import getDataObject from '../utils/getDataObject'
import toMinsSecs from '../utils/toMinsSecs'
import { AuthContext, ThemeContext, TrackContext, RightClickContext, SideBarWidthContext } from '../contexts'
import TracksTable from '../components/TracksTable'
import axios from 'axios'
import playTrack from '../utils/playTrack'
import pauseTrack from '../utils/pauseTrack'
import Menu from '../components/Menu'
import { Link } from 'react-router-dom'
import useViewport from '../hooks/useViewPort'


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
    const [featuringArtist, setFeaturingArtist] = useState([])

    const [loading, setLoading] = useState(true)

    const [topResultWidth, setTopResultWidth] = useState(37.5)
    const { width } = useViewport()
    const { currentWidth } = useContext(SideBarWidthContext)
    const breakPointLarge = 1055
    const breakPointSmall = 850
    

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

        return function cleanUp() {
            setTopResultWidth(37.5)
        }
    }, [width, currentWidth])

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


    useEffect(()=> {
        if (!search) return

        function getTopResult(artists, albums, tracks) {

            for (let i = 0; i < artists.length; i ++) {
                if (userArtists.includes(artists[i].id)) {
                    return({
                        name: artists[i].name,
                        id: artists[i].id,
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
                        id: albums[i].id,
                        creator: albums[i].artists[0].name,
                        imgUrl: albums[i].images[0].url,                  
                        type: 'ALBUM',
                        data: {context_uri: albums[i].uri},
                        uri: albums[i].uri
                    })
                }
            }


            for (let i = 0; i < tracks.length; i ++) {
                if (userArtists.includes(tracks[i].artists[0].id)) {
                    return({
                        name: tracks[i].name,
                        id: tracks[i].id,
                        creator: tracks[i].artists[0].name,
                        imgUrl: tracks[i].album.images[0].url,                  
                        type: 'TRACK',
                        data: {context_uri: tracks[i].album.uri,
                               offset: { uri: tracks[i].uri }},  
                        context: tracks[i].album.uri,
                        uri: tracks[i].uri               
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

        let query = search.replace(/ /g, '+')

        const options = {
            url: `https://api.spotify.com/v1/search?q=${query}&type=track,artist,album,playlist`,
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
              setTopResult(getTopResult(response.data.artists.items, response.data.albums.items, response.data.tracks.items))
              setArtistResults(response.data.artists.items.map(getDataObject))
              setAlbumResults(response.data.albums.items.map(getDataObject))
              setPlaylistResults(response.data.playlists.items.map(getDataObject))
          })
          .catch(error => {
            console.log(error)
          })

        return function cleanUp() {
            setTrackResults([])
            setArtistResults([])
            setAlbumResults([])
            setPlaylistResults([])
            setTopResult({})
        }
    }, [search, accessToken, userArtists])

    useEffect(() => {
        if (!topResult.uri) return

        if (topResult.uri === nowPlaying.trackUri || topResult.uri === nowPlaying.contextUri) {
            setTopResultPlaying(true)
        }
        else {
            setTopResultPlaying(false)
        }

        return function cleanUp() {
            setTopResultPlaying(false)
        }
    }, [topResult, topResult.uri, nowPlaying.trackUri, nowPlaying.contextUri])

    useEffect(() => {
        if (topResult.type === 'ARTIST') {
            const options = {
                url: `https://api.spotify.com/v1/search?q=${topResult.name}&type=playlist`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    }
                }
            axios(options)
            .then(response => {
                let playlists = response.data.playlists.items.filter(item => item.owner.id === 'spotify')
                setFeaturingArtist(playlists.map(getDataObject))
            })
            .catch(error => {
                console.log(error)
            })          
        }

        return function cleanUp() {
            setFeaturingArtist([])
        }

    }, [topResult, accessToken])


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
                  setLoading(true)}}
              />
            </form>
        {(search)?
            <div id='searchResults'
                     style={(loading)? {visibility: 'hidden'} : {visibility: 'visible'}}
                     onLoad={() => setLoading(false)}>        
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
            
            <div id='trackResultsContainer'>
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
            <Panel content={artistResults.slice(0, 5)} />
            <span className='panelTitle'>Albums</span>
            <Panel content={albumResults.slice(0, 5)} />
            <span className='panelTitle'>Playlists</span>
            <Panel content={playlistResults.slice(0, 5)} />
            </div>
            
            :

            <> </>
        } 
        </div> 
       )     
  
}
