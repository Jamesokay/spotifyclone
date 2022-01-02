import CollectionNav from '../components/CollectionNav'
import SpotifyWebApi from 'spotify-web-api-node'
import { AuthContext } from '../contexts'
import { useState, useEffect, useContext } from 'react'
import getDataObject from '../utils/getDataObject'
import Panel from '../components/Panel'

const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
  })

export default function CollectionArtist() {
    const accessToken = useContext(AuthContext)
    const [artists, setArtists] = useState([])
    
    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
      }, [accessToken])

    useEffect(() => {
        if (!accessToken) return

        const getSavedArtists = async () => {
            try {
                const data = await spotifyApi.getFollowedArtists()
                setArtists(data.body.artists.items.map(getDataObject))
            } catch (err) {
                console.error(err)
            }
        }

        getSavedArtists()

        return () => {
            setArtists([])
        }
    }, [accessToken])
    
    return (
        <div id='collectionPage'>
            <CollectionNav />
            <span className='collectionTitle'>Artists</span>
            <Panel content={artists} type='collection'/>
        </div>
    )
}
