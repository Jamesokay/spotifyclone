import CollectionNav from './CollectionNav'
import SpotifyWebApi from 'spotify-web-api-node'
import { AuthContext } from './AuthContext'
import { useState, useEffect, useContext } from 'react'
import getDataObject from './getDataObject'
import Panel from './Panel'

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

        spotifyApi.getFollowedArtists()
        .then(data => {
            setArtists(data.body.artists.items.map(getDataObject))
        })
        .catch(error => {
            console.log(error)
        })
    }, [accessToken])
    
    return (
        <div id='collectionPage'>
            <CollectionNav />
            <span className='collectionTitle'>Artists</span>
            <Panel panelVariant={true} content={artists} />
        </div>
    )
}