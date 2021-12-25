import CollectionNav from '../components/CollectionNav'
import SpotifyWebApi from 'spotify-web-api-node'
import { AuthContext } from '../contexts'
import { useState, useEffect, useContext } from 'react'
import getDataObject from '../utils/getDataObject'
import Panel from '../components/Panel'

const spotifyApi = new SpotifyWebApi({
    clientId: localStorage.getItem('clientId')
  })

export default function CollectionAlbum() {
    const accessToken = useContext(AuthContext)
    const [albums, setAlbums] = useState([])
    
    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
      }, [accessToken])

    useEffect(() => {
        if (!accessToken) return

        spotifyApi.getMySavedAlbums()
        .then(data => {
            setAlbums(data.body.items.map(item=> getDataObject(item.album)))
        })
        .catch(error => {
            console.log(error)
        })
    }, [accessToken])


    return (
        <div id='collectionPage'>
            <CollectionNav />
            <span className='collectionTitle'>Albums</span>
            <Panel content={albums} type='collection'/>
        </div>
    )
}
