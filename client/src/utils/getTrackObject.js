import toMinsSecs from './toMinsSecs'

export default function getTrackObject(track, index, contextUri) {
    if (track.album.images[0]) {
        return {
          num: index + 1,
          id: track.id,
          uri: track.uri,
          context: contextUri,
          name: track.name,
          trackImage: track.album.images[0].url,
          artists: track.artists,
          albumName: track.album.name,
          albumId: track.album.id,
          albumUri: track.album.uri,
          duration: toMinsSecs(track.duration_ms)
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
}
