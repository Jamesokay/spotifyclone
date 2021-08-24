import React, { useState, useEffect, useContext } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import toMinsSecs from './toMinsSecs'
import TracksTable from './TracksTable'
import { AuthContext } from './AuthContext'
import Panel from './Panel'
import HeaderPanel from './HeaderPanel'
import getTotalDuration from './getTotalDuration'


const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function AlbumPage({ id, dispatch }) {
    const accessToken = useContext(AuthContext)
    const [album, setAlbum] = useState({})
    const [albumName, setAlbumName] = useState('')
    const [tracks, setTracks] = useState([])
    const [artistId, setArtistId] = useState('')
    const [artistName, setArtistName] = useState('')
    const [moreByArtist, setMoreByArtist] = useState([])

    function getAlbumObject(id) {

        spotifyApi.getAlbum(id)
        .then(data => {
              let obj = {
                    key: data.body.id,
                    id: data.body.id,
                    type: 'artistAlbum',
                    name: data.body.name,
                    popularity: data.body.popularity,
                    imgUrl: data.body.images[0].url,
                    subtitle: data.body.release_date.slice(0, 4)
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
                imgUrl: data.body.images[0].url,
                info: ' • ' + data.body.release_date.slice(0, 4) 
                    + ' • ' + data.body.tracks.total 
                    + ' songs, '
                    + getTotalDuration(data.body.tracks.items), 
                type: 'ALBUM'
            })
            setAlbumName(data.body.name)
            setArtistId(data.body.artists[0].id)
            setArtistName(data.body.artists[0].name)
            setTracks(data.body.tracks.items.map(item => {
                return {
                  id: item.id,
                  num: item.track_number,
                  name: item.name,
                  artistName: item.artists[0].name,
                  artistId: item.artists[0].id,
                  duration: toMinsSecs(item.duration_ms)
                }
            }))
        })
        .catch(error => {
            console.log(error)
        })
    }, [accessToken, id])

    useEffect(() => {
        if (!accessToken) return
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

    }, [accessToken, artistId, albumName])

    useEffect(() => {
        if (!accessToken) return
        if (!moreByArtist) return
        
        moreByArtist.sort(function(a, b) {
            return b.popularity - a.popularity
            })

    }, [accessToken, moreByArtist])
      


    return (
        <div style={{margin: 'auto', maxWidth: '1200px'}}>
          <HeaderPanel content={album} creator ={artistName} />
          <TracksTable content={tracks} dispatch={dispatch} page='album' />
          <p><span className='panelTitle'>{'More by ' + artistName}</span></p>
          <Panel content={moreByArtist.slice(0, 5)} dispatch={dispatch} /> 
        </div>
    )
}