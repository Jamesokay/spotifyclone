import React, { useState, useEffect, useContext } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import Panel from './Panel'
import getDataObject from './getDataObject'
import TracksTable from './TracksTable'
import { AuthContext } from './AuthContext'
import { PageContext } from './PageContext'
import { ThemeContext } from './ThemeContext'
import toMinsSecs from './toMinsSecs'


const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function ArtistPage({ location }) {
    const id = location.state
    const accessToken = useContext(AuthContext)
    const [artistName, setArtistName] = useState('')
//    const [artistImage, setArtistImage] = useState('')
    const [artistAlbumsRaw, setArtistAlbumsRaw] = useState([])
    const [artistTracks, setArtistTracks] = useState([])
    const [alsoLike, setAlsoLike] = useState([])
    const { setCurrentPage } = useContext(PageContext)
    const { setCurrentTheme } = useContext(ThemeContext)

    // function expandPanel(title, content) {
    //     dispatch({
    //       type: 'PANEL_EXPANDED',
    //       header: title,
    //       array: content
    //     })
    // }

    function getAlbumObject(id) {
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
                    subtitle: data.body.release_date.slice(0, 4) + ' • Album'
            }
            setArtistAlbumsRaw(artistAlbumsRaw => [...artistAlbumsRaw, obj])
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

        setCurrentTheme('0, 0, 0')

        spotifyApi.getArtist(id)
        .then(data =>{
            console.log(data.body)
            setArtistName(data.body.name)
            setCurrentPage(data.body.name)
//            setArtistImage(data.body.images[0].url)
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
                    duration: toMinsSecs(track.duration_ms),
                    artists: track.artists
                }
            }))
        })
        .catch(error => {
            console.log(error)
        })

        spotifyApi.getArtistAlbums(id, {limit: 50, album_type: 'album'})
        .then(data => {
            let albumsFiltered = getUniqueByName(data.body.items)
            let albumsIds = albumsFiltered.map(item => item.id)
            albumsIds.forEach(getAlbumObject)
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
            setArtistName('')
            setArtistAlbumsRaw([])
            setArtistTracks([])
            setAlsoLike([])
        }
      

    }, [accessToken, id, setCurrentPage, setCurrentTheme])

    useEffect(() => {
        if (!accessToken) return
        if (!artistAlbumsRaw) return
            
        artistAlbumsRaw.sort(function(a, b) {
          return b.popularity - a.popularity
          })

    }, [accessToken, id, artistAlbumsRaw])

    



    return (
          
        <div className='pageContainer'>
            {/* <span className='artistTitle'>{artistName}</span> */}
        <div style={{width: '100%', height: '436px'}}></div>
          
        <div id='headerControls'>
          <div className='headerPlayButton'>         
            <div className='headerPlayIcon'></div>
          </div>
        </div>
        <div id='page'>
          <p id='artistTableTitle'>Popular</p>
          <TracksTable content={artistTracks.slice(0, 5)} page='artist' />
          <p><span className='panelTitle'
            >Albums</span></p>
          <Panel content={artistAlbumsRaw.slice(0, 5)} />
          <p><span className='panelTitle'>{'Similar to ' + artistName}</span></p>
          <Panel content={alsoLike.slice(0, 5)} /> 
        </div>  
        
        </div>
    )
}
