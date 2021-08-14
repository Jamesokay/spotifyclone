export default function getDataObject(dataObject) {

      if (dataObject.type === 'album') {
        return {
          key: dataObject.id,
          id: dataObject.id,
          type: dataObject.type,
          name: dataObject.name,
          imgUrl: dataObject.images[0].url,
          subtitle: dataObject.artists[0].name,
          artistId: dataObject.artists[0].id,
        }
      }
      else {
        return {
          key: dataObject.id,
          id: dataObject.id,
          type: dataObject.type,
          name: dataObject.name,
          imgUrl: dataObject.images[0].url,
          subtitle: dataObject.type
        }
      }
}


