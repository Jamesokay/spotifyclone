import defaultProfile from './defaultProfile.png'

export default function getDataObject(dataObject) {
      
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  var imgSrc
  (dataObject.images[0])? imgSrc = dataObject.images[0].url : imgSrc = defaultProfile

      if (dataObject.type === 'album') {
        return {
          key: dataObject.id,
          id: dataObject.id,
          uri: dataObject.uri,
          type: dataObject.type,
          name: dataObject.name,
          imgUrl: imgSrc,
          artists: dataObject.artists
        }
      }
      else if (dataObject.type === 'playlist') {
        return {
          key: dataObject.id,
          id: dataObject.id,
          uri: dataObject.uri,
          type: dataObject.type,
          name: dataObject.name,
          imgUrl: imgSrc,
          subtitle: dataObject.description
        }
      }
      else {
        return {
          key: dataObject.id,
          id: dataObject.id,
          type: dataObject.type,
          name: dataObject.name,
          imgUrl: imgSrc,
          subtitle: capitalizeFirstLetter(dataObject.type)
        }
      }
}


