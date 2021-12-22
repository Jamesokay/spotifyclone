import React, { useState, useEffect, useContext } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import toMinsSecs from '../utils/toMinsSecs'
import TracksTable from '../components/TracksTable'
import { AuthContext } from '../AuthContext'
import Panel from '../components/Panel'
import HeaderPanel from '../components/HeaderPanel'
import getTotalDuration from '../utils/getTotalDuration'
import flagSavedTracks from '../utils/flagSavedTracks'
import Menu from '../components/Menu'
import HeaderControls from '../components/HeaderControls'
import AlbumLoader from './AlbumLoader'



const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function AlbumPage({ location }) {
    const id = location.state
    const accessToken = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [album, setAlbum] = useState({})
    const [albumName, setAlbumName] = useState('')
    const [tracks, setTracks] = useState([])
    const [tracksFinal, setTracksFinal] = useState([])
    const [savedArray, setSavedArray] = useState([])
    const [artistId, setArtistId] = useState('')
    const [artistName, setArtistName] = useState('')
    const [creatorObject, setCreatorObject] = useState([])
    const [creatorImg, setCreatorImg] = useState('')
    const [moreByArtist, setMoreByArtist] = useState([])


    function getAlbumObject(id) {

        spotifyApi.getAlbum(id)
        .then(data => {
              let obj = {
                    onAlbumPage: true,
                    key: data.body.id,
                    id: data.body.id,
                    uri: data.body.uri,
                    type: 'album',
                    name: data.body.name,
                    popularity: data.body.popularity,
                    imgUrl: data.body.images[0].url,
                    subtitle: data.body.release_date.slice(0, 4),
              }
              setMoreByArtist(moreByArtist => [...moreByArtist, obj])
        })
        .catch(error => {
            console.log(error)
        })
    }


    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
      }, [accessToken])


    useEffect(() => {
        if (!accessToken) return

        spotifyApi.getAlbum(id)
        .then(data =>{
            setAlbum({
                title: data.body.name,
                uri: data.body.uri,
                imgUrl: data.body.images[0].url,
                info: ' • ' + data.body.release_date.slice(0, 4) 
                    + ' • ' + data.body.tracks.total 
                    + ' songs, '
                    + getTotalDuration(data.body.tracks.items), 
                type: 'ALBUM'
            })
            let albumImg = data.body.images[0].url
            let albumUri = data.body.uri
            setCreatorObject(data.body.artists)
            setAlbumName(data.body.name)
            setArtistId(data.body.artists[0].id)
            setArtistName(data.body.artists[0].name)
            setTracks(data.body.tracks.items.map(item => {
                return {
                  id: item.id,
                  uri: item.uri,
                  albUri: albumUri,
                  num: item.track_number,
                  name: item.name,
                  artists: item.artists,
                  albumId: id,
                  duration: toMinsSecs(item.duration_ms),
                  trackImage: albumImg
                }
            }))
        })
        .catch(error => {
            console.log(error)
        })

        return function cleanUp() {
            setAlbum({})
            setCreatorObject([])
            setAlbumName('')
            setArtistId('')
            setArtistName('')
            setTracks([])
        }
    }, [accessToken, id])

    useEffect(() => {
        if (!accessToken) return
        if (tracks.length === 0) return

        let trax = tracks.map(item => item.id)

        spotifyApi.containsMySavedTracks(trax)
        .then(data => {
          setSavedArray(data.body)
        })
        .catch(error => {
            console.log(error)
        })

        return function cleanUp() {
            setSavedArray([])
        }
        
    }, [tracks, accessToken])

    useEffect(() => {
        if (tracks.length === 0) return
        if (savedArray.length === 0) return

        setTracksFinal(flagSavedTracks(tracks, savedArray))
        setLoading(false)

        return function cleanUp() {
            setTracksFinal([])
            setLoading(true)
        }
    }, [tracks, savedArray])

    useEffect(() => {
        if (!accessToken) return
        if (!albumName) return
        if (!artistId) return

        function getUniqueByName(array) {
            const names = array.map(item => item.name)
            names.push(albumName)      
            const filtered = array.filter(({name}, index) => !names.includes(name, index + 1))
            return filtered
          }

        spotifyApi.getArtistAlbums(artistId, {limit: 50})
        .then(data => {
            let filteredAlbums = getUniqueByName(data.body.items)
            let albumsIds = filteredAlbums.map(item => item.id)
            albumsIds.forEach(getAlbumObject)
        })
        .catch(error => {
            console.log(error)
        })

        spotifyApi.getArtist(artistId)
        .then(data => {
            setCreatorImg(data.body.images[0].url)
        })
        .catch(error => {
            console.log(error)
        })

        return function cleanUp() {
            setMoreByArtist([])
            setCreatorImg('')
        }

    }, [accessToken, artistId, albumName])


    useEffect(() => {
        if (!accessToken) return
        if (!moreByArtist) return
        
        moreByArtist.sort(function(a, b) {
            return b.popularity - a.popularity
            })

    }, [accessToken, moreByArtist])


      


    return (
        <div>
        <HeaderPanel content={album} creators={creatorObject} creatorImg={creatorImg}/>
        <Menu/>
        <div className='pageContainer'>
        <HeaderControls URL={`https://api.spotify.com/v1/me/albums/contains?ids=${id}`} contextUri={album.uri} contextId={id} />
        {(loading)?
          <AlbumLoader/>
          :
          <TracksTable content={tracksFinal} page='album' />
        }   
          <span className='panelTitle'>{'More by ' + artistName}</span>
          <Panel content={moreByArtist.slice(0, 5)} /> 

        </div>
        </div>
    )
}