import React, { useState, useEffect, useContext } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import toMinsSecs from './toMinsSecs'
import TracksTable from './TracksTable'
import { AuthContext } from './AuthContext'
import HeaderPanel from './HeaderPanel'
import getTotalDuration from './getTotalDuration'
import playTrack from './playTrack'
import pauseTrack from './pauseTrack'
import defaultPlaylist from './defaultPlaylist.png'
import { UserContext } from './UserContext'
import { TrackContext } from './TrackContext'
import flagSavedTracks from './flagSavedTracks'
import axios from 'axios'
import PlaylistSearch from './PlaylistSearch'
import { PlaylistContext } from './PlaylistContext'
import like from './like'
import unlike from './unlike'
import { SidebarContext } from './SidebarContext'
import getDataObject from './getDataObject'


const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function PlaylistPage({ location }) {
    const id  = location.state
    const accessToken = useContext(AuthContext)
    const user = useContext(UserContext)

    const [playlist, setPlaylist] = useState({})
    const [playlistObj, setPlaylistObj] = useState({})
    const [tracks, setTracks] = useState([])
    const [savedArray, setSavedArray] = useState([])
    const [tracksFinal, setTracksFinal] = useState([])
    const [creator, setCreator] = useState([])
    const [recommendations, setRecommendations] = useState([])
    const [isOwner, setIsOwner] = useState(false)
    const {newTrack} = useContext(PlaylistContext)
    const [tracksSample, setTracksSample] = useState([])
    const { nowPlaying } = useContext(TrackContext)
    const [loading, setLoading] = useState(true)
    const [liked, setLiked] = useState(false)
    const {setUserPlaylists} = useContext(SidebarContext)



    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
      }, [accessToken])

      useEffect(() => {
        if (!accessToken) return

        const options = {
            url: `https://api.spotify.com/v1/playlists/${id}/followers/contains?ids=${user.id}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        }

        axios(options)
        .then(response => {
          console.log(response.data)
          setLiked(response.data[0])
        })
        .catch(error => {
          console.log(error)
        })

        return function cleanUp() {
            setLiked(false)
        }

    }, [id, user.id, accessToken])


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
            setPlaylistObj(getDataObject(data.body))
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
        setPlaylistObj({})
       }

    }, [id, accessToken])

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
      spotifyApi.getPlaylist(id, 'AU')
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
            setLoading(false)
        })
        .catch(error => {
            console.log(error)
        })

        return function cleanUp() {
          setTracks([])
          setLoading(true)
        }
    }, [accessToken, id])

    useEffect(() => {
      if (!accessToken) return
      if (tracks.length === 0) return

      let trax = tracks.slice(0, 50).map(item => item.id)

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

    setTracksFinal(flagSavedTracks(tracks.slice(0, 50), savedArray))

    return function cleanUp() {
      setTracksFinal([])
    }
    }, [tracks, savedArray])

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


    useEffect(() => {
      if (!newTrack) return
      if (!newTrack.name) return
      setTracksFinal(tracksFinal => [...tracksFinal, {...newTrack, num: tracksFinal.length + 1}])
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
    

 
    return loading? <div/> : (
      <div>
      <HeaderPanel content={playlist} creators={creator} id={id}/>
      <div className='pageContainer'>
      {(tracksFinal.length !== 0)?
      <div id='headerControls'> 
        <div className='headerPlayButton'
             onClick={(e) => {
                e.preventDefault()
                 if (playlist.uri === nowPlaying.contextUri && !nowPlaying.isPaused) {
                     pauseTrack(accessToken)
                 }
                 else if (playlist.uri === nowPlaying.contextUri && nowPlaying.isPaused) {
                     playTrack(accessToken)
                 }
                 else {
                 playTrack(accessToken, {context_uri: playlist.uri})} 
                }
               }>
            <div className={(!nowPlaying.isPaused && playlist.uri === nowPlaying.contextUri)?'headerPauseIcon': 'headerPlayIcon'}></div>   
        </div>
        {(isOwner)?
        <div/>
        :
        <svg id={(liked)?'headerLiked':'headerLike'} viewBox="0 0 32 32" stroke="white" 
               onClick={() => {
                   if (liked) {
                       unlike(accessToken, `https://api.spotify.com/v1/playlists/${id}/followers`) 
                       setUserPlaylists(userPlaylists => userPlaylists.filter(item => item.id !== id))                    
                       setLiked(false)
                   }
                   else {
                       like(accessToken, `https://api.spotify.com/v1/playlists/${id}/followers`)
                       setUserPlaylists(userPlaylists => [...userPlaylists, playlistObj])
                       setLiked(true)
                   }
                   
                }}>
            <path d="M27.672 5.573a7.904 7.904 0 00-10.697-.489c-.004.003-.425.35-.975.35-.564 0-.965-.341-.979-.354a7.904 7.904 0 00-10.693.493A7.896 7.896 0 002 11.192c0 2.123.827 4.118 2.301 5.59l9.266 10.848a3.196 3.196 0 004.866 0l9.239-10.819A7.892 7.892 0 0030 11.192a7.896 7.896 0 00-2.328-5.619z"></path>
          </svg> 
        }
      </div>
        :
        <div></div>              
      }
      <div id='page'>
        {(tracks.length !== 0)?    
          <TracksTable content={tracksFinal} page='playlist' />
          :
          <div></div>
        }
        
        {(isOwner)?
          <div>
          {(tracksFinal.length !== 0)? 
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
