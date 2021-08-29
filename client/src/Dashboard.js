import SpotifyWebApi from 'spotify-web-api-node'
import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from './AuthContext'
import Panel from './Panel'
import getDataObject from './getDataObject'
import createContextArray from './createContextArray'

const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function Dashboard({ dispatch }) {
    const accessToken = useContext(AuthContext)
    const [topArtists, setTopArtists] = useState([])
    const [topGenres, setTopGenres] = useState([])
    const [recent, setRecent] = useState([])
    const [moreLike, setMoreLike] = useState([])
    const [recommend, setRecommend] = useState([])
  //  const [recommendByGenre, setRecommendByGenre] = useState([])
    const [relatedArtistsSeed, setRelatedArtistsSeed] = useState('')

    function expandPanel(title, content) {
        dispatch({
          type: 'PANEL_EXPANDED',
          header: title,
          array: content
        })
      }
    
    function getUniqueById(array) {
        const clearUndefinedValues = array.filter(item => {
            return item !== undefined
          })
          const ids = clearUndefinedValues.map(item => item.id)      
          const filtered = clearUndefinedValues.filter(({id}, index) => !ids.includes(id, index + 1))
          return filtered
    }

    function getUniqueByAlbumId(array) {
      const artistIds = []
      const filtered = []
      array.forEach(item => {
        if (!artistIds.includes(item.album.id)) {
          artistIds.push(item.album.id)
          filtered.push(item.album.id)
        }
      })
      return filtered    
    }

  function spotifyContextQuery(item) {
 
    if (!item.type) {
      return
    }
    else if (item.type === 'playlist') {
      spotifyApi.getPlaylist(item.id)
      .then(data => {
        let obj = getDataObject(data.body)
        setRecent(recent => [...recent, obj])
      })
      .catch(error => {
        console.log(error)
      })
    }
    else if (item.type === 'artist') {
      spotifyApi.getArtist(item.id)
      .then(data => {
        let obj = getDataObject(data.body)
        setRecent(recent => [...recent, obj])
      })
      .catch(error => {
        console.log(error)
      })
    }
    else if (item.type === 'album') {
      spotifyApi.getAlbum(item.id)
      .then(data => {
        let obj = getDataObject(data.body)
        setRecent(recent => [...recent, obj])
      })
      .catch(error => {
        console.log(error)
      })
    }
  }

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
      if (!accessToken) return 

      spotifyApi.getMyTopArtists({limit : 20})
      .then(data => {
          setTopArtists(data.body.items.map(getDataObject))
          setTopGenres(data.body.items.map(item => item.genres))
        })
      .catch(error => {
         console.log(error)
      })
    } , [accessToken] )

    useEffect(() => {   
      if (!accessToken) return   
 
      spotifyApi.getMyRecentlyPlayedTracks({limit : 50})
      .then(data => {
        let recentRaw = data.body.items.map(createContextArray)
        let recentFiltered = getUniqueById(recentRaw)
        recentFiltered.forEach(spotifyContextQuery)
      })
      .catch(error => {
        console.log(error)
      })

    }, [accessToken])

    useEffect(() => {
      if (!accessToken) return     
      if (topArtists[0] === undefined) return
      if (topArtists[4] === undefined) return
      // if (topGenres[0] === undefined) return

      setRelatedArtistsSeed(topArtists[4].name)
 
      spotifyApi.getArtistRelatedArtists(topArtists[4].key)
      .then(data => {
        setMoreLike(data.body.artists.map(getDataObject))
      })
      .catch(error => {
        console.log(error)
     })
      
     spotifyApi.getRecommendations({
       seed_artists: [topArtists[1].key, topArtists[2].key, topArtists[3].key],
       min_popularity: 50
     })
     .then(data => {
       let recommendRaw = data.body.tracks
       let uniqueAlbumIds = getUniqueByAlbumId(recommendRaw)
       uniqueAlbumIds.forEach(id => {
         spotifyApi.getAlbum(id)
         .then(data => {
           let obj = getDataObject(data.body)
           setRecommend(recommend => [...recommend, obj])
         })
       })
     })
     .catch(error => {
       console.log(error)
     })

    //  spotifyApi.getRecommendations({
    //   seed_genres: 'alternative',
    //   min_popularity: 50
    // })
    // .then(data => {
    //   let recommendRaw = data.body.tracks
    //   let uniqueAlbumIds = getUniqueByAlbumId(recommendRaw)
    //   uniqueAlbumIds.forEach(id => {
    //     spotifyApi.getAlbum(id)
    //     .then(data => {
    //       let obj = getDataObject(data.body)
    //       setRecommendByGenre(recommendByGenre => [...recommendByGenre, obj])
    //     })
    //   })
    // })
    // .catch(error => {
    //   console.log(error)
    // })

    }, [accessToken, topArtists, topGenres])

    useEffect(() => {
      if (!accessToken) return
      if (!topGenres) return

      console.log(topGenres)
      
      spotifyApi.getAvailableGenreSeeds()
      .then(data => {
        console.log(data.body)
      })
      .catch(error => {
        console.log(error)
      })

    }, [accessToken, topGenres])
    
    
    return (
      <div style={{margin: 'auto', maxWidth: '1200px'}}>
        <p><span className='panelTitle'
          onClick={() => expandPanel('Recent', recent)}>Recent</span></p> 
        <Panel content={recent.slice(0, 5)} dispatch={dispatch} />
        <p><span className='panelTitle' 
          onClick={() => expandPanel('More like ' + relatedArtistsSeed, moreLike)}>
          {'More like ' + relatedArtistsSeed}</span></p> 
        <Panel content={moreLike.slice(0, 5)} dispatch={dispatch} />
        <p><span className='panelTitle'
          onClick={() => expandPanel('Recommended for you', recommend)}>Recommended for you</span></p> 
        <Panel content={recommend.slice(0, 5)} dispatch={dispatch} />

        {/* <p><span className='panelTitle'
          onClick={() => expandPanel('Essential ' + topGenres[0], recommend)}>{'Essential ' + topGenres[0]}</span></p> 
        <Panel content={recommendByGenre.slice(0, 5)} dispatch={dispatch} />       */}
      </div>
    )
}        