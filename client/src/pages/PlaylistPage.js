import React, { useState, useEffect, useContext } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import TracksTable from '../components/TracksTable'
import { AuthContext, UserContext, PlaylistContext } from '../contexts'
import HeaderPanel from '../components/HeaderPanel'
import getTotalDuration from '../utils/getTotalDuration'
import defaultPlaylist from '../icons/defaultPlaylist.png'
import flagSavedTracks from '../utils/flagSavedTracks'
import PlaylistSearch from '../components/PlaylistSearch'
import getDataObject from '../utils/getDataObject'
import Menu from '../components/Menu'
import PlaylistLoader from '../pages/PlaylistLoader'
import HeaderControls from '../components/HeaderControls'
import getTrackObject from '../utils/getTrackObject'


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
    const [creatorImg, setCreatorImg] = useState('')
    const [recommendations, setRecommendations] = useState([])
    const [isOwner, setIsOwner] = useState(false)
    const {newTrack} = useContext(PlaylistContext)
    const [tracksSample, setTracksSample] = useState([])
    const [loading, setLoading] = useState(true)
    const [isEmpty, setIsEmpty] = useState(false)

    function getSeeds(array) {
      if (array.length > 5) {
        return array.slice(0, 5).map(item => item.id)
      }
      else {
        return array.map(item => item.id)
      }

    }

    useEffect(() => {
      if (!accessToken) return
      spotifyApi.setAccessToken(accessToken)
    }, [accessToken])


    useEffect(() => {
      if (!accessToken) return
       
      spotifyApi.getPlaylist(id)
      .then(data => {    
          setPlaylist({
            title: data.body.name,
            imgUrl: data.body.images[0]? data.body.images[0].url : defaultPlaylist,
            uri: data.body.uri,
            about: data.body.description,
            info: (data.body.tracks.items.length !== 0)? ` • ${data.body.followers.total.toLocaleString('en-US')} likes • ${data.body.tracks.total} songs, ${getTotalDuration(data.body.tracks.items)}` : '',
            type: 'PLAYLIST',
            owner: data.body.owner.id 
          })
          setPlaylistObj(getDataObject(data.body))

          if (user.id === data.body.owner.id) {
            setIsOwner(true)
          }
          
          if (data.body.tracks.items.length === 0) {
            setIsEmpty(true)
          }
          else {
            setTracksSample(data.body.tracks.items.slice(0, 5).map((item, index) => getTrackObject(item.track, index, data.body.uri))) 
            setTracks(data.body.tracks.items.map((item, index) => getTrackObject(item.track, index, data.body.uri)))
          }    
      })
      .catch(error => {
        console.log(error)
      })

      return function cleanUp() {
        setPlaylist({})
        setPlaylistObj({})
        setIsOwner(false)
        setTracksSample([])
        setTracks([])
        setIsEmpty(false)
      }
    }, [id, user, accessToken])


    useEffect(() => {
      if (!accessToken) return
      if (!playlist.owner) return

      spotifyApi.getUser(playlist.owner)
      .then(data => {  
        let obj = { name: data.body.display_name,
                    id: data.body.id
        }
        setCreator(creator => [...creator, obj])
        if (data.body.images[0]) {
          setCreatorImg(data.body.images[0].url)
        }
      })
      .catch(error => {
        console.log(error)
      })

      return function cleanUp() {
        setCreator([])
        setCreatorImg('')
      }
    }, [accessToken, playlist.owner])


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
    if (isEmpty) return
    
    setTracksFinal(flagSavedTracks(tracks.slice(0, 50), savedArray))
    setLoading(false)

    return function cleanUp() {
      setTracksFinal([])
      setLoading(true)
    }
  }, [isEmpty, tracks, savedArray])


    useEffect(() => {
      if (!accessToken) return
      if (!isOwner) return
      if (isEmpty) return

      spotifyApi.getRecommendations({
        seed_tracks: getSeeds(tracksSample),
        min_popularity: 50
      })
      .then(data => {
        setRecommendations(data.body.tracks.map((track, index ) => getTrackObject(track, index, '')))
      })
      .catch(error => {
        console.log(error)
      })

      return function cleanUp() {
        setRecommendations([])
      }    
    }, [accessToken, isOwner, isEmpty, tracksSample])


    useEffect(() => {
      if (!newTrack) return
      if (!newTrack.name) return
      setTracksFinal(tracksFinal => [...tracksFinal, {...newTrack, num: tracksFinal.length + 1}])
      setRecommendations(recommendations => recommendations.filter(item => item.id !== newTrack.id))
      
    }, [newTrack, newTrack.name])

 
    return (isOwner && isEmpty)? 
    (
      <div>
        <Menu />
        <HeaderPanel content={playlist} creators={creator} creatorImg={creatorImg} isOwner={isOwner}/>
        <div className='pageContainer'>     
          <HeaderControls URL={`https://api.spotify.com/v1/playlists/${id}/followers/contains?ids=${user.id}`} contextUri={playlist.uri} contextId={id} isOwner={isOwner} playlistObj={playlistObj} isEmpty={isEmpty}/>
          <hr className='emptyPlaylist'/>
        <div className='playlistLowerHeading'>
          <span className='playlistLowerTitle'>Let's find something for your playlist</span>
        </div>
        <PlaylistSearch />
      </div>
    </div>
    )
    :
    (
      <div>
        <Menu />
        <HeaderPanel content={playlist} creators={creator} id={id} creatorImg={creatorImg}/>
        <div className='pageContainer'>
        {(loading)?
          <div>
            <div id='headerControls'></div> 
             <PlaylistLoader />
          </div>
        :
        <div>
          <HeaderControls URL={`https://api.spotify.com/v1/playlists/${id}/followers/contains?ids=${user.id}`} contextUri={playlist.uri} contextId={id} isOwner={isOwner} playlistObj={playlistObj} isEmpty={isEmpty}/>
          <TracksTable content={tracksFinal} page='playlist' />        
          {(isOwner)?
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
          <></>
          }
        </div>
        }   
        </div>
      </div>

    )
}
