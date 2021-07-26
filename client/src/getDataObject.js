export default function getDataObject(dataObject) {
    
    if (dataObject.body) {
      return {
        key: dataObject.body.id,
        id: dataObject.body.id,
        type: dataObject.body.type,
        name: dataObject.body.name,
        imgUrl: dataObject.body.images[0].url
      }
    }
    else {
      return {
        key: dataObject.id,
        id: dataObject.id,
        type: dataObject.type,
        name: dataObject.name,
        imgUrl: dataObject.images[0].url
      }
    }
}


