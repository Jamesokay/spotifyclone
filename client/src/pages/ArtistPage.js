import React, { useState, useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import Panel from '../components/Panel'
import HeaderPanel from '../components/HeaderPanel'
import HeaderControls from '../components/HeaderControls'
import getDataObject from '../utils/getDataObject'
import TracksTable from '../components/TracksTable'
import flagSavedTracks from '../utils/flagSavedTracks'
import ArtistLoader from './ArtistLoader'
import getTrackObject from '../utils/getTrackObject'
import { useSelector } from 'react-redux'


const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function ArtistPage({ location }) {
    const id = location.state
    const accessToken = useSelector(state => state.user.token)
    const [artist, setArtist] = useState({})
    const [artistAlbumsRaw, setArtistAlbumsRaw] = useState([])
    const [popularReleases, setPopularReleases] = useState([])
    const [singles, setSingles] = useState([])
    const [artistTracks, setArtistTracks] = useState([])
    const [tracksFinal, setTracksFinal] = useState([])
    const [savedArray, setSavedArray] = useState([])
    const [alsoLike, setAlsoLike] = useState([])
    const theme = useSelector(state => state.page.theme)
    const [adjustedColour, setAdjustedColour] = useState({red: 0, green: 0, blue: 0})
    const [loading, setLoading] = useState(true)
    const [showMoreTracks, setShowMoreTracks] = useState(false)
    
    
    function calculateChange(startNum) {
        var distance = 18 - startNum
        var change = Math.floor(distance * 0.7)
        return startNum + change
      }


    async function getPopularAlbumObjects(array) {
        for (const item of array) {
          try {
            const data = await spotifyApi.getAlbum(item)
            setPopularReleases(popularReleases => [...popularReleases, {...getDataObject(data.body), onArtistPage: true}])
          } catch (err) {
            console.error(err)
          }
        }
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

        const getArtistData = async () => {
          try {
            const data = await spotifyApi.getArtist(id)
            setArtist({name: data.body.name, 
              followers: data.body.followers.total.toLocaleString('en-US'), 
              uri: data.body.uri, 
              type: 'ARTIST', 
              imgUrl: data.body.images[0].url})
          } catch (err) {
            console.error(err)
          }
        }

        const getTopTracks = async () => {
          try {
            const data = await spotifyApi.getArtistTopTracks(id, 'AU')
            setArtistTracks(data.body.tracks.map((track, index) => getTrackObject(track, index, '')))
          } catch (err) {
            console.error(err)
          }
        }

        const getPopularReleases = async () => {
          try {
            const data = await spotifyApi.getArtistAlbums(id, {limit: 50, album_type: 'single,album'})
            let albumsFiltered = getUniqueByName(data.body.items)
            let albumIds = albumsFiltered.map(item => item.id)
            getPopularAlbumObjects(albumIds)
          } catch (err) {
            console.error(err)
          }
        }

        const getAlbums = async () => {
          try {
            const data = await spotifyApi.getArtistAlbums(id, {limit: 50, album_type: 'album'})
            console.log(data.body.items)
            let albumsFiltered = getUniqueByName(data.body.items)
            setArtistAlbumsRaw(albumsFiltered.map(album => { return {...getDataObject(album), onArtistPage: true}}))
          } catch (err) {
            console.error(err)
          }
        }

        const getSingles = async () => {
          try {
            const data = await spotifyApi.getArtistAlbums(id, {limit: 50, album_type: 'single'})
            let albumsFiltered = getUniqueByName(data.body.items)
            setSingles(albumsFiltered.map(album => { return {...getDataObject(album), onArtistPage: true}}))
          } catch (err) {
            console.error(err)
          }
        }

        const getRelatedArtists = async () => {
          try {
            const data = await spotifyApi.getArtistRelatedArtists(id)
            setAlsoLike(data.body.artists.map(getDataObject))
          } catch (err) {
            console.error(err)
          }
        }

        getArtistData()
        getTopTracks()
        getPopularReleases()
        getAlbums()
        getSingles()
        getRelatedArtists()


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

        const checkForSavedTracks = async () => {
          try {
            const data = await spotifyApi.containsMySavedTracks(trax.slice(0, 10))
            setSavedArray(data.body)
          } catch (err) {
            console.error(err)
          }
        }

        checkForSavedTracks()

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

        artistAlbumsRaw.sort(function(a, b) {
            return b.year - a.year
        })

        singles.sort(function(a, b) {
            return b.year - a.year
        })

    }, [accessToken, id, popularReleases, artistAlbumsRaw, singles])


    useEffect(() => {
        setAdjustedColour({red: calculateChange(theme.red), 
                           green: calculateChange(theme.green), 
                           blue: calculateChange(theme.blue)})
  
        return function cleanUp() {
          setAdjustedColour({red: 0, green: 0, blue: 0})
        }
      }, [theme.red, theme.green, theme.blue])


    return (
       <div>
        <HeaderPanel content={artist} type='ARTIST'/>
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
          <span className='panelTitle'>Popular releases</span>
          <Panel content={popularReleases.slice(0, 5)} />          
          <span className='panelTitle'>Albums</span>
          <Panel content={artistAlbumsRaw.slice(0, 5)} />
          <span className='panelTitle'>Singles and EPs</span>
          <Panel content={singles.slice(0, 5)} />
          <span className='panelTitle'>Fans also like</span>
          <Panel content={alsoLike.slice(0, 5)} /> 
        </div>
        }      
        </div>
        </div>
    )
}
