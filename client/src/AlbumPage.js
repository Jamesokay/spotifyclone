import React, { useState, useEffect, useContext } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import toMinsSecs from './toMinsSecs'
import TracksTable from './TracksTable'
import { AuthContext } from './AuthContext'
import Panel from './Panel'
import HeaderPanel from './HeaderPanel'
import getTotalDuration from './getTotalDuration'
import playTrack from './playTrack'
import axios from 'axios'


const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function AlbumPage({ location }) {
    const id = location.state
    const accessToken = useContext(AuthContext)
    const [album, setAlbum] = useState({})
    const [albumName, setAlbumName] = useState('')
    const [tracks, setTracks] = useState([])
    const [artistId, setArtistId] = useState('')
    const [artistName, setArtistName] = useState('')
    const [creatorObject, setCreatorObject] = useState([])
    const [moreByArtist, setMoreByArtist] = useState([])
    const [paused, setPaused] = useState(true)


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

    function pausePlay() {
        setPaused(true)
        const options = {
            url: 'https://api.spotify.com/v1/me/player/pause',
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                }
            }
        
          axios(options)
          .then(console.log('paused')
          )
          .catch(error => {
            console.log(error)
          })
    }

    function play() {
        setPaused(false)
        playTrack(accessToken, {context_uri: album.uri})

    }
      


    return (
        <div>
        <HeaderPanel content={album} creators={creatorObject} />
        <div className='pageContainer'>
        <div id='headerControls'>
          <div className='headerPlayButton'
               onClick={() => {
                   (paused)?
                   play()
                   :
                   pausePlay()
                }}>
            {(paused)?
            <div className='headerPlayIcon'></div>
            :
            <div className='headerPauseIcon'></div>
            }
          </div>
        </div>
        <div className='page'>
          <TracksTable content={tracks} page='album' />
          <p><span className='panelTitle'>{'More by ' + artistName}</span></p>
          <Panel content={moreByArtist.slice(0, 5)} /> 
        </div>
        </div>
        </div>
    )
}