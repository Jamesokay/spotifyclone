import React, { useState, useEffect, useContext } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import Panel from './Panel'
import HeaderPanel from './HeaderPanel'
import HeaderControls from './HeaderControls'
import getDataObject from './getDataObject'
import TracksTable from './TracksTable'
import { AuthContext } from './AuthContext'
import Menu from './Menu'
import { ThemeContext } from './ThemeContext'
import toMinsSecs from './toMinsSecs'
import flagSavedTracks from './flagSavedTracks'
import ArtistLoader from './ArtistLoader'


const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function ArtistPage({ location }) {
    const id = location.state
    const accessToken = useContext(AuthContext)
    const [artist, setArtist] = useState({})
    const [artistAlbumsRaw, setArtistAlbumsRaw] = useState([])
    const [popularReleases, setPopularReleases] = useState([])
    const [singles, setSingles] = useState([])
    const [artistTracks, setArtistTracks] = useState([])
    const [tracksFinal, setTracksFinal] = useState([])
    const [savedArray, setSavedArray] = useState([])
    const [alsoLike, setAlsoLike] = useState([])
    const { currentTheme } = useContext(ThemeContext)
    const [adjustedColour, setAdjustedColour] = useState({red: 0, green: 0, blue: 0})
    const [loading, setLoading] = useState(true)
    const [showMoreTracks, setShowMoreTracks] = useState(false)
    
    
    function calculateChange(startNum) {
        var distance = 18 - startNum
        var change = Math.floor(distance * 0.7)
        return startNum + change
      }


    function getAlbumObject(id, type) {
        spotifyApi.getAlbum(id)
        .then(data => {
            let obj = {
                    onArtistPage: true,
                    key: data.body.id,
                    id: data.body.id,
                    uri: data.body.uri,
                    type: 'album',
                    name: data.body.name,
                    popularity: data.body.popularity,
                    imgUrl: data.body.images[0].url,
                    year: parseInt(data.body.release_date.slice(0, 4)),
                    subtitle: data.body.release_date.slice(0, 4) + ' • ' + data.body.album_type.charAt(0).toUpperCase() + data.body.album_type.slice(1)
            }
            if (type === 'albums') {
              setArtistAlbumsRaw(artistAlbumsRaw => [...artistAlbumsRaw, obj])
            }
            else if (type === 'popular') {
              setPopularReleases(popularReleases => [...popularReleases, obj])
            }
            else if (type === 'singles') {
              setSingles(singles => [...singles, obj])
            }
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
            setArtist({title: data.body.name, 
                followers: data.body.followers.total.toLocaleString('en-US'), 
                uri: data.body.uri, 
                type: 'ARTIST', 
                imgUrl: data.body.images[0].url})
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
                    albUri: track.album.uri,
                    duration: toMinsSecs(track.duration_ms),
                    artists: track.artists
                }
            }))
        })
        .catch(error => {
            console.log(error)
        })

        spotifyApi.getArtistAlbums(id, {limit: 50, album_type: 'single,album'})
        .then(data => {
            let albumsFiltered = getUniqueByName(data.body.items)
            let albumsIds = albumsFiltered.map(item => item.id)
            albumsIds.forEach(item => getAlbumObject(item, 'popular'))
        })
        .catch(error => {
            console.log(error)
        })


        spotifyApi.getArtistAlbums(id, {limit: 50, album_type: 'album'})
        .then(data => {
            let albumsFiltered = getUniqueByName(data.body.items)
            let albumsIds = albumsFiltered.map(item => item.id)
            albumsIds.forEach(item => getAlbumObject(item, 'albums'))
        })
        .catch(error => {
            console.log(error)
        })

        spotifyApi.getArtistAlbums(id, {limit: 50, album_type: 'single'})
        .then(data => {
            let albumsFiltered = getUniqueByName(data.body.items)
            let albumsIds = albumsFiltered.map(item => item.id)
            albumsIds.forEach(item => getAlbumObject(item, 'singles'))
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

        return function cleanUp() {
            setArtist({})
            setPopularReleases([])
            setSingles([])
            setArtistAlbumsRaw([])
            setArtistTracks([])
            setAlsoLike([])
        }
      

    }, [accessToken, id])

    useEffect(() => {
        if (!accessToken) return
        if (artistTracks.length === 0) return

        let trax = artistTracks.map(item => item.id)

        spotifyApi.containsMySavedTracks(trax.slice(0, 10))
        .then(data => {
          setSavedArray(data.body)
        })
        .catch(error => {
            console.log(error)
        })

        return function cleanUp() {
            setSavedArray([])
        }
        
    }, [artistTracks, accessToken])

    useEffect(() => {
        if (artistTracks.length === 0) return
        if (savedArray.length === 0) return

        setTracksFinal(flagSavedTracks(artistTracks, savedArray))
        setLoading(false)

        return function cleanUp() {
            setTracksFinal([])
            setLoading(true)
        }
    }, [artistTracks, savedArray])

    useEffect(() => {
        if (!accessToken) return
        if (!popularReleases) return
        if (!artistAlbumsRaw) return

        popularReleases.sort(function(a, b) {
            return b.popularity - a.popularity
          })
  
        // popularReleases.sort(function(a, b) {
        //       return b.year - a.year
        // })
            
        // artistAlbumsRaw.sort(function(a, b) {
        //   return b.popularity - a.popularity
        // })

        artistAlbumsRaw.sort(function(a, b) {
            return b.year - a.year
        })

        singles.sort(function(a, b) {
            return b.year - a.year
        })

    }, [accessToken, id, popularReleases, artistAlbumsRaw, singles])

    useEffect(() => {
        if (!currentTheme) return
        setAdjustedColour({red: calculateChange(currentTheme.red), 
                           green: calculateChange(currentTheme.green), 
                           blue: calculateChange(currentTheme.blue)})
  
        return function cleanUp() {
          setAdjustedColour({red: 0, green: 0, blue: 0})
        }
      }, [currentTheme, currentTheme.red, currentTheme.green, currentTheme.blue])





    return (
       <div>
        <HeaderPanel content={artist} type='ARTIST'/>
        <Menu/>
    
        <div className='pageContainerArtist' style={{backgroundImage: 'linear-gradient(rgb(' + adjustedColour.red + ',' + adjustedColour.green + ',' + adjustedColour.blue + '), rgb(18, 18, 18) 15%)'}}>       
        <HeaderControls URL={`https://api.spotify.com/v1/me/following/contains?type=artist&ids=${id}`} contextUri={artist.uri} contextId={id} type='ARTIST'/>
        {(loading)?
        <ArtistLoader/>
        :
        <div>
          <p id='artistTableTitle'>Popular</p>
          <TracksTable content={tracksFinal} page='artist' trackDepth={(showMoreTracks)? 10 : 5}/>
          <span className='seeMore' 
                onClick={() => {
                  if (showMoreTracks ) {
                    setShowMoreTracks(false)
                  }
                  else setShowMoreTracks(true)
                }}
          >{(!showMoreTracks)? 'SEE MORE' : 'SHOW LESS'}</span>
          <p><span className='panelTitle'>Popular releases</span></p>
          <Panel content={popularReleases.slice(0, 5)} />          
          <p><span className='panelTitle'>Albums</span></p>
          <Panel content={artistAlbumsRaw.slice(0, 5)} />
          <p><span className='panelTitle'>Singles and EPs</span></p>
          <Panel content={singles.slice(0, 5)} />
          <p><span className='panelTitle'>Fans also like</span></p>
          <Panel content={alsoLike.slice(0, 5)} /> 
        </div>
        }      
        </div>
        </div>
    )
}
