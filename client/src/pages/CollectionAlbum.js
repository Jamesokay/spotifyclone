import CollectionNav from '../components/CollectionNav'
import SpotifyWebApi from 'spotify-web-api-node'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import getDataObject from '../utils/getDataObject'
import Panel from '../components/Panel'

const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
  })

export default function CollectionAlbum() {
    const accessToken = useSelector(state => state.user.token)
    const [albums, setAlbums] = useState([])
    
    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
      }, [accessToken])

    useEffect(() => {
        if (!accessToken) return

        const getSavedAlbums = async () => {
            try {
                const data = await spotifyApi.getMySavedAlbums()
                setAlbums(data.body.items.map(item=> getDataObject(item.album)))
            } catch (err) {
                console.error(err)
            }
        }

        getSavedAlbums()

        return () => {
            setAlbums([])
        }     
    }, [accessToken])


    return (
        <div id='collectionPage'>
            <CollectionNav />
            <span className='collectionTitle'>Albums</span>
            <Panel content={albums} type='collection'/>
        </div>
    )
}
