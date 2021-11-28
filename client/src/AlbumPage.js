import React, { useState, useEffect, useContext } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import toMinsSecs from './toMinsSecs'
import TracksTable from './TracksTable'
import { AuthContext } from './AuthContext'
import { TrackContext } from './TrackContext'
import Panel from './Panel'
import HeaderPanel from './HeaderPanel'
import getTotalDuration from './getTotalDuration'
import playTrack from './playTrack'
import pauseTrack from './pauseTrack' 
import like from './like'
import unlike from './unlike'
import axios from 'axios'
import flagSavedTracks from './flagSavedTracks'
import Menu from './Menu'



const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function AlbumPage({ location }) {
    const id = location.state
    const accessToken = useContext(AuthContext)
    const [album, setAlbum] = useState({})
    const [albumName, setAlbumName] = useState('')
    const [tracks, setTracks] = useState([])
    const [tracksFinal, setTracksFinal] = useState([])
    const [savedArray, setSavedArray] = useState([])
    const [artistId, setArtistId] = useState('')
    const [artistName, setArtistName] = useState('')
    const [creatorObject, setCreatorObject] = useState([])
    const [moreByArtist, setMoreByArtist] = useState([])
    const { nowPlaying } = useContext(TrackContext)
    const [liked, setLiked] = useState(false)
    const [notification, setNotification] = useState('')
    const [showNotification, setShowNotification] = useState(false)


    function getAlbumObject(id) {

        spotifyApi.getAlbum(id)
        .then(data => {
              let obj = {
                    onAlbumPage: true,
                    key: data.body.id,
                    id: data.body.id,
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

        const options = {
            url: `https://api.spotify.com/v1/me/albums/contains?ids=${id}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        }

        axios(options)
        .then(response => {
          setLiked(response.data[0])
        })
        .catch(error => {
          console.log(error)
        })

        return function cleanUp() {
            setLiked(false)
        }

    }, [id, accessToken])

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

        return function cleanUp() {
            setTracksFinal([])
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

        return setMoreByArtist([])


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
        <HeaderPanel content={album} creators={creatorObject} />
        <Menu/>
        <div className='likedNotification' style={(showNotification)? {opacity: '1'} : {opacity: '0'}}>{notification}</div>
        <div className='pageContainer'>
        <div id='headerControls'>
          <div className='headerPlayButton'
               onClick={(e) => {
                e.preventDefault()
                 if (album.uri === nowPlaying.contextUri && !nowPlaying.isPaused) {
                     pauseTrack(accessToken)
                 }
                 else if (album.uri === nowPlaying.contextUri && nowPlaying.isPaused) {
                     playTrack(accessToken)
                 }
                 else {
                 playTrack(accessToken, {context_uri: album.uri})} 
                }
               }>

            <div className={(!nowPlaying.isPaused && album.uri === nowPlaying.contextUri)? 'headerPauseIcon': 'headerPlayIcon'}></div>
          </div>
        
          <svg className={(liked)?'headerLiked':'headerLike'} viewBox="0 0 32 32" stroke="white" 
               onClick={() => {
                   if (liked) {
                       unlike(accessToken, `https://api.spotify.com/v1/me/albums?ids=${id}`)
                       setLiked(false)
                       setNotification('Removed from Your Library')
                       setShowNotification(true)
                       setTimeout(function() { setShowNotification(false) }, 3000)
                   }
                   else {
                       like(accessToken, `https://api.spotify.com/v1/me/albums?ids=${id}`)
                       setLiked(true)
                       setNotification('Added to Your Library')
                       setShowNotification(true)
                       setTimeout(function() { setShowNotification(false) }, 3000)
                   }
                   
                }}>
            <path className='headerHeartIcon' d="M27.672 5.573a7.904 7.904 0 00-10.697-.489c-.004.003-.425.35-.975.35-.564 0-.965-.341-.979-.354a7.904 7.904 0 00-10.693.493A7.896 7.896 0 002 11.192c0 2.123.827 4.118 2.301 5.59l9.266 10.848a3.196 3.196 0 004.866 0l9.239-10.819A7.892 7.892 0 0030 11.192a7.896 7.896 0 00-2.328-5.619z"></path>
          </svg>

        </div>
        <div id='page'>
          <TracksTable content={tracksFinal} page='album' />
          <p><span className='panelTitle'>{'More by ' + artistName}</span></p>
          <Panel content={moreByArtist.slice(0, 5)} /> 
        </div>
        </div>
        </div>
    )
}