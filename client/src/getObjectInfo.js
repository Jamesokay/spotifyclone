import React from 'react'
import SpotifyWebApi from 'spotify-web-api-node'

export default function getObjectInfo(content, access) {

    const spotifyApi = new SpotifyWebApi ({
        clientId: 'e39d5b5b499d4088a003eb0471c537bb'
    })
    spotifyApi.setAccessToken(access)

    if (content.context.type === 'playlist') {
      let uri = content.context.uri
      let playlistId = uri.substr(17)

      spotifyApi.getPlaylist(playlistId)
      .then(data => {
          return {
              key: data.body.items.id,
              name: data.body.items.name,
              imgUrl: data.body.items.images[0].url
          }
      })
      .catch(error => {
        console.log(error)
      })

    } else if (content.context.type === 'album') {
        
        return {
            key: content.track.album.id,
            name: content.track.album.name,
            imgUrl: content.track.album.images[0].url
        }

    } else if (content.context.type === 'artist') {
        let artistId = content.context.track.artists[0].id

        spotifyApi.getArtist(artistId)
        .then(data => {
            return {
                key: artistId,
                name: data.body.items.name,
                imgUrl: data.body.items.images[0].url
            }
        })
        .catch(error => {
            console.log(error)
        })

    }
}
