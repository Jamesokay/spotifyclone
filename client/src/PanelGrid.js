import { useEffect, useState } from 'react'
// import { AuthContext } from './AuthContext'
// import playTrack from './playTrack'
import { Link } from 'react-router-dom'

export default function PanelGrid({ content }) {
    
    const [colors, setColors] = useState([])
    const [gradient, setGradient] = useState('linear-gradient(grey, #121212)')
   
 
    function getColor(itemId, imgUrl) {

        var canvas = document.createElement('canvas');
        var ctx    = canvas.getContext('2d');

        var myImgElement = new Image() 
        myImgElement.onload = function() {
            ctx.drawImage( myImgElement, 0, 0 );
            var imgdata = ctx.getImageData(0,0,20,20);
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

            let obj = {}
            obj['id'] = itemId
            obj['bg'] = 'rgba(' + avgRed + ',' + avgGreen + ',' + avgBlue + ',' + avgAlpha + ')'
             

            setColors(colors => [...colors, obj])
        }        
        myImgElement.src = imgUrl   
        myImgElement.crossOrigin = ''
    }

    function changeBg(itemId) {
        var newBg = colors.filter(color => color.id === itemId)
        console.log(newBg)
        setGradient('linear-gradient(' + newBg[0].bg + ', #121212)')
        
    }
 
   // 

    
    // canvas.height = myImgElement.naturalHeight
    // canvas.width = myImgElement.naturalWidth
   

    // var xStart = Math.floor(canvas.width * 0.2)
    // var yStart = Math.floor(canvas.height * 0.6)





    useEffect(() => {
        console.log(colors)
    }, [colors])
  

      
   useEffect(() => {
       console.log(gradient)
   }, [gradient])
    



    return (
        <div id='gridPanel' style={{background: gradient}}>
        {content.slice(0, 8).map(cont =>
          <Link style={{textDecoration: 'none', width: '19vw'}} 
                key={cont.key} 
                to={{pathname: `/${cont.type}/${cont.id}`, state: cont.id }}
                >
          <div className='gridCard'
               onMouseOver={()=> changeBg(cont.id)}
          >
            <img className='gridCardImage' src={cont.imgUrl} alt=''
                 onLoad={()=> getColor(cont.id, cont.imgUrl)} />
            <div className='gridCardTitle'>
                <span>{cont.name}</span>
            </div>
          </div>   
          </Link> 
        )}       
        </div>
    )
}
