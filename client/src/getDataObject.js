export default function getDataObject(dataObject) {
      
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

      if (dataObject.type === 'album') {
        return {
          key: dataObject.id,
          id: dataObject.id,
          type: dataObject.type,
          name: dataObject.name,
          imgUrl: dataObject.images[0].url,
          artists: dataObject.artists,
          firstTrack: {
               name: dataObject.tracks.items[0].name, 
               artists: dataObject.tracks.items[0].artists, 
               imgUrl: dataObject.images[0].url,
               albumId: dataObject.id
          }
        }
      }
      else if (dataObject.type === 'playlist') {
        return {
          key: dataObject.id,
          id: dataObject.id,
          type: dataObject.type,
          name: dataObject.name,
          imgUrl: dataObject.images[0].url,
          subtitle: dataObject.description,
          firstTrack: {
            name: dataObject.tracks.items[0].track.name, 
            artists: dataObject.tracks.items[0].track.artists, 
            imgUrl: dataObject.tracks.items[0].track.album.images[0].url,
            albumId: dataObject.tracks.items[0].track.album.id
          }
        }
      }
      else {
        return {
          key: dataObject.id,
          id: dataObject.id,
          type: dataObject.type,
          name: dataObject.name,
          imgUrl: dataObject.images[0].url,
          subtitle: capitalizeFirstLetter(dataObject.type)
        }
      }
}


