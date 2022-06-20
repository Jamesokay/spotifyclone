import React, { useState, useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import toMinsSecs from '../utils/toMinsSecs'
import getDataObject from '../utils/getDataObject'
import TracksTable from '../components/TracksTable'
import { useSelector } from 'react-redux'
import Panel from '../components/Panel'
import HeaderPanel from '../components/HeaderPanel'
import getTotalDuration from '../utils/getTotalDuration'
import flagSavedTracks from '../utils/flagSavedTracks'
import HeaderControls from '../components/HeaderControls'
import AlbumLoader from './AlbumLoader'



const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function AlbumPage({ location }) {
    const id = location.state
    const accessToken = useSelector(state => state.user.token)
    const [loading, setLoading] = useState(true)
    const [album, setAlbum] = useState({})
    const [tracks, setTracks] = useState([])
    const [tracksFinal, setTracksFinal] = useState([])
    const [savedArray, setSavedArray] = useState([])
    const [creatorObject, setCreatorObject] = useState([])
    const [creatorImg, setCreatorImg] = useState('')
    const [moreByArtist, setMoreByArtist] = useState([])


    async function getAlbumObjects(array) {
        for (const item of array) {
            try {
                const data = await spotifyApi.getAlbum(item)
                setMoreByArtist(moreByArtist => [...moreByArtist, {...getDataObject(data.body), onAlbumPage: true}])
            } catch (err) {
                console.error(err)
            }
        }
    }


    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
      }, [accessToken])


    useEffect(() => {
        if (!accessToken) return

        const getAlbumData = async () => {
            try {
                const data = await spotifyApi.getAlbum(id)
                setAlbum({...getDataObject(data.body), info: (data.body.tracks.items.length !== 0)? ` • ${data.body.release_date.slice(0, 4)} • ${data.body.tracks.total} songs, ${getTotalDuration(data.body.tracks.items)}` : ''})
                setCreatorObject(data.body.artists)
                setTracks(data.body.tracks.items.map(item => {
                    return {
                      id: item.id,
                      uri: item.uri,
                      albumUri: data.body.uri,
                      num: item.track_number,
                      name: item.name,
                      artists: item.artists,
                      albumId: id,
                      duration: toMinsSecs(item.duration_ms),
                      trackImage: data.body.images[0].url
                    }
                }))
            } catch (err) {
                console.error(err)
            }
        }

        getAlbumData()

        return function cleanUp() {
            setAlbum({})
            setCreatorObject([])
            setTracks([])
        }
    }, [accessToken, id])


    useEffect(() => {
        if (!accessToken) return
        if (tracks.length === 0) return

        let trax = tracks.map(item => item.id)

        const checkForSavedTracks = async () => {
            try {
                const data = await spotifyApi.containsMySavedTracks(trax)
                setSavedArray(data.body)
            } catch (err) {
                console.error(err)
            }
        }

        checkForSavedTracks()

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
        if (!album.name) return
        if (!album.artists[0].id) return

        function getUniqueByName(array) {
            const names = array.map(item => item.name)
            names.push(album.name)      
            const filtered = array.filter(({name}, index) => !names.includes(name, index + 1))
            return filtered
        }

        const getOtherAlbums = async () => {
            try {
                const data = await spotifyApi.getArtistAlbums(album.artists[0].id, {limit: 50, album_type: 'album'})
                let filteredAlbums = getUniqueByName(data.body.items)
                let albumIds = filteredAlbums.map(item => item.id)
                getAlbumObjects(albumIds)
            } catch (err) {
                console.error(err)
            }
        }

        const getArtistImage = async () => {
            try {
                const data = await spotifyApi.getArtist(album.artists[0].id)
                setCreatorImg(data.body.images[0].url)
            } catch (err) {
                console.error(err)
            }
        }

        getOtherAlbums()
        getArtistImage()

        return function cleanUp() {
            setMoreByArtist([])
            setCreatorImg('')
        }
    }, [accessToken, album.artists, album.name])


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
          <div className='pageContainer'>
            <HeaderControls URL={`https://api.spotify.com/v1/me/albums/contains?ids=${id}`} contextUri={album.uri} contextId={id} />
            {(loading)?
              <AlbumLoader/>
              :
              <TracksTable content={tracksFinal} page='album' />
            }   
            <span className='panelTitle'>{(album.artists)? 'More by ' + album.artists[0].name : ''}</span>
            <Panel content={moreByArtist} /> 
          </div>
        </div>
    )
}