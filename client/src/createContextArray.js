import getDataObject from './getDataObject'
import SpotifyWebApi from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi({
    clientId: 'e39d5b5b499d4088a003eb0471c537bb'
 })

spotifyApi.setAccessToken(localStorage.getItem('access'))

export default function createContextArray() {
    
    const recent = []
    const recentIds = []

    spotifyApi.getMyRecentlyPlayedTracks({limit : 50})
    .then(data => {
    
      data.body.items.forEach(item => {
       if (!item.context) {            
          return     
        }
        else if (item.context.type === "playlist" && !recentIds.includes(item.context.uri.substr(17))) {
          recentIds.push(item.context.uri.substr(17))
    
          spotifyApi.getPlaylist(item.context.uri.substr(17))
          .then(data => {             
            let obj = getDataObject(data)
            recent.push(obj)              
          })
        }
        else if (item.context.type === 'album' && !recentIds.includes(item.track.album.id)) {
          recentIds.push(item.track.album.id)   
            let obj = getDataObject(item.track.album)
            recent.push(obj)       
        }
        else if (item.context.type === 'artist' && !recentIds.includes(item.track.artists[0].id)) {
          recentIds.push(item.track.artists[0].id)
    
          spotifyApi.getArtist(item.track.artists[0].id)
          .then(data => {
            let obj = getDataObject(data)
            recent.push(obj) 
          })
        } 
      })
    })
    .catch(error => {
        console.log(error)
    })
    
    return recent
}
