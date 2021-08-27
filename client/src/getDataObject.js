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
          artists: dataObject.artists
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


