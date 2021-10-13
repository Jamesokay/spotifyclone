// import { useContext, useState } from 'react'
// import { AuthContext } from './AuthContext'
// import playTrack from './playTrack'
import { Link } from 'react-router-dom'

export default function PanelGrid({ content }) {

 //   const accessToken = useContext(AuthContext)

 //   const [gradient, setGradient] = useState('linear-gradient(grey, #121212)')
   
    const contentMod = content.map(item => getImgColor(item))
    
    function getImgColor(item) {
      if (!item) return
      var canvas = document.createElement('canvas');
      var ctx    = canvas.getContext('2d');
  
      var myImgElement = new Image();
      myImgElement.src = item.imgUrl
      myImgElement.crossOrigin = ''
      
      canvas.height = myImgElement.naturalHeight
      canvas.width = myImgElement.naturalWidth
      ctx.drawImage( myImgElement, 0, 0 );

      var xStart = Math.floor(canvas.width * 0.2)
      var yStart = Math.floor(canvas.height * 0.6)
  

      var imgdata = ctx.getImageData(xStart,yStart,40,40);
      var pixels = imgdata.data;

      var red = 0
      var green = 0
      var blue = 0
      var alpha = 0

      for (let i = 0; i < pixels.length; i += 4) {
        
        red += pixels[i]
        green += pixels[i + 1]
        blue += pixels[i + 2]
        alpha += pixels[i + 3]
        
      }


    let avgRed = Math.floor(red / (pixels.length / 4))
    let avgGreen = Math.floor(green / (pixels.length / 4))
    let avgBlue = Math.floor(blue / (pixels.length / 4))
    let avgAlpha = Math.floor(alpha / (pixels.length / 4))


    let bg = 'rgba(' + avgRed + ',' + avgGreen + ',' + avgBlue + ',' + avgAlpha + ')'
    
    return {
        key: item.key,
        type: item.type,
        id: item.id,
        imgUrl: item.imgUrl,
        name: item.name,
        background: bg
    }
       
  }

  function colorChange(color) {
    document.getElementById('gridPanel').style.background = 'linear-gradient(' + color + ', #121212)'
  }


    return (
        <div id='gridPanel'>
        {contentMod.map(cont =>
          <Link style={{textDecoration: 'none', width: '19vw'}} key={cont.key} to={{pathname: `/${cont.type}/${cont.id}`, state: cont.id }}>
          <div className='gridCard' onMouseEnter={() => colorChange(cont.background)}>
            <img className='gridCardImage' src={cont.imgUrl} alt='' />
            <div className='gridCardTitle'>
                <span>{cont.name}</span>
            </div>
          </div>   
          </Link> 
        )}       
        </div>
    )
}
