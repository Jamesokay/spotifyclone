import { useState, useEffect, useContext } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import TracksTable from '../components/TracksTable'
import { PlaylistContext } from '../contexts'
import HeaderPanel from '../components/HeaderPanel'
import getTotalDuration from '../utils/getTotalDuration'
import flagSavedTracks from '../utils/flagSavedTracks'
import PlaylistSearch from '../components/PlaylistSearch'
import getDataObject from '../utils/getDataObject'
import PlaylistLoader from '../pages/PlaylistLoader'
import HeaderControls from '../components/HeaderControls'
import getTrackObject from '../utils/getTrackObject'
import { useSelector } from 'react-redux'


const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
 })

export default function PlaylistPage({ location }) {
    const id  = location.state
    const accessToken = useSelector(state => state.user.token)
    const user = useSelector(state => state.user.profile)
    const [playlist, setPlaylist] = useState({})
    const [tracks, setTracks] = useState([])
    const [savedArray, setSavedArray] = useState([])
    const [tracksFinal, setTracksFinal] = useState([])
    const [creator, setCreator] = useState([])
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

      const getPlaylistData = async () => {
        try {
          const data = await spotifyApi.getPlaylist(id)
          setPlaylist({...getDataObject(data.body), info: (data.body.tracks.items.length !== 0)? ` • ${data.body.followers.total.toLocaleString('en-US')} likes • ${data.body.tracks.total} songs, ${getTotalDuration(data.body.tracks.items)}` : ''})
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
        } catch (err) {
          console.error(err)
        }
      }

      getPlaylistData()
       

      return function cleanUp() {
        setPlaylist({})
        setIsOwner(false)
        setTracksSample([])
        setTracks([])
        setIsEmpty(false)
      }
    }, [id, user, accessToken])


    useEffect(() => {
      if (!accessToken) return
      if (!playlist.owner) return

      const getUserInfo = async () => {
        try {
          const data = await spotifyApi.getUser(playlist.owner)
          setCreator(creator => [...creator, { name: data.body.display_name, id: data.body.id}])
        } catch (err) {
          console.error(err)
        }
      }

      getUserInfo()

      return function cleanUp() {
        setCreator([])
      }
    }, [accessToken, playlist.owner])


    useEffect(() => {
      if (!accessToken) return
      if (tracks.length === 0) return

      let trax = tracks.slice(0, 50).map(item => item.id)
      
      const checkForSavedTracks = async () => {
        try {
          const data = await spotifyApi.containsMySavedTracks(trax)
          setSavedArray(data.body)
          setLoading(false)
        } catch (err) {
          console.error(err)
        }
      }

      checkForSavedTracks()

      return function cleanUp() {
        setSavedArray([])
        setLoading(true)
      }
      
    }, [tracks, accessToken])


    useEffect(() => {  
      if (isEmpty) return
    
      setTracksFinal(flagSavedTracks(tracks.slice(0, 50), savedArray))

      return function cleanUp() {
        setTracksFinal([])
      }
    }, [isEmpty, tracks, savedArray])


    useEffect(() => {
      if (!accessToken) return
      if (!isOwner) return
      if (isEmpty) return

      const getRecommendedTracks = async () => {
        try {
          const data = await spotifyApi.getRecommendations({seed_tracks: getSeeds(tracksSample), min_popularity: 50})
          setRecommendations(data.body.tracks.map((track, index ) => getTrackObject(track, index, '')))
        } catch (err) {
          console.error(err)
        }
      }

      getRecommendedTracks()

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
        <HeaderPanel content={playlist} creators={creator} isOwner={isOwner}/>
        <div className='pageContainer'>     
          <HeaderControls URL={`https://api.spotify.com/v1/playlists/${id}/followers/contains?ids=${user.id}`} contextUri={playlist.uri} contextId={id} isOwner={isOwner} playlistObj={playlist} isEmpty={isEmpty}/>
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
        <HeaderPanel content={playlist} creators={creator} id={id} />
        <div className='pageContainer'>
        {(loading)?
          <div>
            <div id='headerControls'></div> 
             <PlaylistLoader />
          </div>
        :
        <div>
          <HeaderControls URL={`https://api.spotify.com/v1/playlists/${id}/followers/contains?ids=${user.id}`} contextUri={playlist.uri} contextId={id} isOwner={isOwner} playlistObj={playlist} isEmpty={isEmpty}/>
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
