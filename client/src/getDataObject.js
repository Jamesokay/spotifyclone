
export default function getDataObject(dataObject) {
    
    if (dataObject.body) {
      return {
        key: dataObject.body.id,
        name: dataObject.body.name,
        imgUrl: dataObject.body.images[0].url
      }
    }
    else {
      return {
        key: dataObject.id,
        name: dataObject.name,
        imgUrl: dataObject.images[0].url
      }
    }
}


