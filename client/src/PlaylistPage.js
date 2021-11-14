import React, { useState, useEffect, useContext } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import toMinsSecs from './toMinsSecs'
import TracksTable from './TracksTable'
import { AuthContext } from './AuthContext'
import HeaderPanel from './HeaderPanel'
import getTotalDuration from './getTotalDuration'
import playTrack from './playTrack'
import axios from 'axios'
import defaultPlaylist from './defaultPlaylist.png'
import { UserContext } from './UserContext'

import PlaylistSearch from './PlaylistSearch'
import { PlaylistContext } from './PlaylistContext'


const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function PlaylistPage({ location }) {
    const id  = location.state
    const accessToken = useContext(AuthContext)
    const user = useContext(UserContext)

    const [playlist, setPlaylist] = useState({})
    const [tracks, setTracks] = useState([])
    const [creator, setCreator] = useState([])
    const [recommendations, setRecommendations] = useState([])
    const [isOwner, setIsOwner] = useState(false)
    const [paused, setPaused] = useState(true)
    const {newTrack} = useContext(PlaylistContext)
    const [tracksSample, setTracksSample] = useState([])



    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
      }, [accessToken])

    useEffect(() => {
        if (!accessToken) return

        spotifyApi.getPlaylist(id)
        .then(data => {
              let obj = {
                name: data.body.owner.display_name,
                id: data.body.owner.id
              }
              setCreator(creator => [...creator, obj])
        })
        .catch(error => {
          console.log(error)
        })

        return setCreator([])
        
      }, [accessToken, id])


    useEffect(() => {
       if (!accessToken) return
       spotifyApi.getPlaylist(id)
       .then(data => {
            if (data.body.images[0]) {
            setPlaylist({
                    title: data.body.name,
                    imgUrl: data.body.images[0].url,
                    uri: data.body.uri,
                    about: data.body.description,
                    info: ' • ' 
                        + data.body.followers.total.toLocaleString('en-US') 
                        + ' likes • ' + data.body.tracks.total 
                        + ' songs, '
                        + getTotalDuration(data.body.tracks.items),
                    type: 'PLAYLIST'
            })
          } else {
            setPlaylist({
              title: data.body.name,
              imgUrl: defaultPlaylist,
              uri: data.body.uri,
              type: 'PLAYLIST'
          })
        }
       })
       .catch(error => {
         console.log(error)
       })

       return function cleanUp() {
        setPlaylist({})
       }

    }, [id, accessToken])


    useEffect(() => {
      if (!accessToken) return
      spotifyApi.getPlaylist(id)
      .then(data => {
            let playlistUri = data.body.uri

            setTracksSample(data.body.tracks.items.slice(0, 5).map((item, index ) => {
              if (item.track.album.images[0]) {
                return {
                  num: index + 1,
                  id: item.track.id,
                  uri: item.track.uri,
                  context: playlistUri,
                  name: item.track.name,
                  trackImage: item.track.album.images[0].url,
                  artists: item.track.artists,
                  albumName: item.track.album.name,
                  albumId: item.track.album.id,
                  duration: toMinsSecs(item.track.duration_ms)
                }
              } else {
                return {
                  num: index + 1,
                  id: index,
                  name: '',
                  artists: [],
                  albumName: '',
                  albumId: index + 3,
                  duration: ''
                }
              }

            }))
            
            setTracks(data.body.tracks.items.map((item, index ) => {
              if (item.track.album.images[0]) {
                return {
                  num: index + 1,
                  id: item.track.id,
                  uri: item.track.uri,
                  context: playlistUri,
                  name: item.track.name,
                  trackImage: item.track.album.images[0].url,
                  artists: item.track.artists,
                  albumName: item.track.album.name,
                  albumId: item.track.album.id,
                  duration: toMinsSecs(item.track.duration_ms)
                }
              } else {
                return {
                  num: index + 1,
                  id: index,
                  name: '',
                  artists: [],
                  albumName: '',
                  albumId: index + 3,
                  duration: ''
                }
              }

            }))
        })
        .catch(error => {
            console.log(error)
        })

        return function cleanUp() {
          setTracks([])
        }
    }, [accessToken, id])

    useEffect(() => {
      if (!user) return
      if (!creator[0]) return
      if (user.id === creator[0].id) {
        setIsOwner(true)
      }
      else {
        setIsOwner(false)
      }

      return function cleanUp() {
        setIsOwner(false)
      }

    }, [user, creator])

    useEffect(() => {
      if (!accessToken) return
      if (!user) return
      if (!creator[0]) return
      if (user.id !== creator[0].id) return
      if (tracksSample.length === 0) return

      spotifyApi.getRecommendations({
        seed_tracks: getSeeds(tracksSample),
        min_popularity: 50
      })
      .then(data => {
        setRecommendations(data.body.tracks.map((track, index ) => {
          if (track.album.images[0]) {
            return {
              num: index + 1,
              id: track.id,
              uri: track.uri,
              context: '',
              name: track.name,
              trackImage: track.album.images[0].url,
              artists: track.artists,
              albumName: track.album.name,
              albumId: track.album.id,
              duration: toMinsSecs(track.duration_ms)
            }
          } else {
            return {
              num: index + 1,
              id: index,
              name: '',
              artists: [],
              albumName: '',
              albumId: index + 3,
              duration: ''
            }
          }

        }))
      })
      .catch(error => {
        console.log(error)
      })

      return function cleanUp() {
        setRecommendations([])
      }

      
    }, [accessToken, user, creator, tracksSample])

    // useEffect(() => {
    //   console.log(isOwner)
    // }, [isOwner])

    useEffect(() => {
      if (!newTrack) return
      if (!newTrack.name) return
      setTracks(tracks => [...tracks, {...newTrack, num: tracks.length + 1}])
      setRecommendations(recommendations => recommendations.filter(item => item.id !== newTrack.id))
      
    }, [newTrack, newTrack.name])

    function getSeeds(array) {
      if (array.length > 5) {
        return array.slice(0, 5).map(item => item.id)
      }
      else {
        return array.map(item => item.id)
      }

    }

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
      playTrack(accessToken, {context_uri: playlist.uri})

  }

 
    return (
      <div>
      <HeaderPanel content={playlist} creators={creator} id={id}/>
      <div className='pageContainer'>
      {(tracks.length !== 0)?
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
        :
        <div></div>              
      }
      <div id='page'>
        {(tracks.length !== 0)?    
          <TracksTable content={tracks} page='playlist' />
          :
          <div></div>
        }
        
        {(isOwner)?
          <div>
          {(tracks.length !== 0)? 
            <div>
              <div className='playlistLowerHeading'>
                <span className='playlistLowerTitle'>Recommended</span>
                <br/>
                <span className='playlistLowerSub'>Based on what's in this playlist</span>
              </div>
              <TracksTable content={recommendations} page='playlistRecommend'/>
              <div className='playlistLowerHeading'>
                <span className='playlistLowerTitle'>Let's find something for your playlist</span>
              </div>
              <PlaylistSearch />
            </div>
          :
          <div>
            <div className='playlistLowerHeading'>
              <span className='playlistLowerTitle'>Let's find something for your playlist</span>
            </div>
            <PlaylistSearch />
          </div>
          }
          </div>
          :
          <div></div>
        }

      </div>
      </div>
      </div>
    )
}
