import { useState, useEffect } from 'react'
import CollectionNav from '../components/CollectionNav'
import axios from 'axios'
import getDataObject from '../utils/getDataObject'
import Panel from '../components/Panel'
import { useDispatch, useSelector } from 'react-redux'
import { updateTheme } from '../pageSlice'


export default function CollectionPlaylist() {
  const accessToken = useSelector(state => state.user.token)
  const [playlists, setPlaylists] = useState([])
  const dispatch = useDispatch()
  
  // Set NavBar to black
  useEffect(() => {
    dispatch(updateTheme({red: 0, green: 0, blue: 0}))
  }, [dispatch])


  // Get user's saved playlists
  useEffect(() => {
    if (!accessToken) return

    const options = {
      url: 'https://api.spotify.com/v1/me/playlists',
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          }
      }
    
    const getSavedPlaylists = async () => {
      try {
        const response = await axios(options)
        setPlaylists(response.data.items.map(getDataObject))
      } catch (err) {
        console.error(err)
      }
    }
  
    getSavedPlaylists()

    return () => {
      setPlaylists([])
    }   
  }, [accessToken])


    return (
    <div id='collectionPagePlaylist'>
     <CollectionNav />
     <span className='collectionTitle'>Playlists</span> 
      <Panel content={playlists} type='collection' likedSongsCard='true'/>
    </div>
    )
}
