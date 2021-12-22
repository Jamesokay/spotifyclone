import { useState, useEffect, useContext } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import { AuthContext, UserContext } from '../contexts'
import toMinsSecs from '../utils/toMinsSecs'
import likedSongs from '../icons/likedSongs.png'
import TracksTable from '../components/TracksTable'
import HeaderPanel from '../components/HeaderPanel'
import Menu from '../components/Menu'

const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
  })

export default function CollectionTrack() {
    const accessToken = useContext(AuthContext)
    const user = useContext(UserContext)
    const [tracks, setTracks] = useState([])
    const likedSongsObj = {
        title: 'Liked Songs',
        imgUrl: likedSongs,
        uri: '',
        about: '',
        info: '',
        type: 'PLAYLIST'
      }
    const profile = [{
        name: user.display_name,
        id: user.id
    }]


    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
      }, [accessToken])

    useEffect(() => {
        if (!accessToken) return
    
        spotifyApi.getMySavedTracks({limit: 50})
        .then(data => {
          setTracks(data.body.items.map((item, index ) => {
                if (item.track.album.images[0]) {
                  return {
                    num: index + 1,
                    id: item.track.id,
                    uri: item.track.uri,
                    context: 'liked songs',
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
    
      }, [accessToken])


    return (
        <div>
        <Menu/>
        <HeaderPanel content={likedSongsObj} creators={profile}/>
        <div className='pageContainer'>
        <div id='headerControls'>
        <div className='headerPlayButton'>
              <div className='headerPlayIcon'></div>
            </div>
          </div>   
          <div className='page'>      
            <TracksTable content={tracks} page='playlist' />
          </div>
        </div>
        </div>
    )
}
