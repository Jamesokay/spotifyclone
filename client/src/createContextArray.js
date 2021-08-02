
export default function createContextArray(item) {
    
        if (!item.context) {            
          return     
        }
        else if (item.context.type === "playlist") {
          let obj = { 
            type: 'playlist',
            id: item.context.uri.substr(17)
          }      
          return obj
        }
        else if (item.context.type === 'artist') {
          let obj = { 
            type: 'artist',
            id: item.context.uri.substr(15)
          }      
          return obj          
        }
        else if (item.context.type === 'album') {
          let obj = { 
            type: 'album',
            id: item.context.uri.substr(14)
          }      
          return obj      
        } 
    
}
