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


const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function PlaylistPage({ location }) {
    const id  = location.state
    const accessToken = useContext(AuthContext)
    const [playlist, setPlaylist] = useState({})
    const [tracks, setTracks] = useState([])
    const [creator, setCreator] = useState([])
    const [paused, setPaused] = useState(true)


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

            let playlistUri = data.body.uri
            
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
          setPlaylist({})
          setTracks([])
        }
    }, [accessToken, id])

    useEffect(() => {
      console.log(playlist)
    }, [playlist])

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

  // isOwner logic, render conditionally based on that
  // somehow discern whether new PL
    return (
      <div>
      <HeaderPanel content={playlist} creators={creator} />
      <div className='pageContainer'>
      <div className='headerControls'>
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
          <TracksTable content={tracks} page='playlist' />
        </div>
      </div>
      </div>
    )
}
