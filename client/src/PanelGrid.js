import { useState, useContext } from 'react'
import { AuthContext } from './AuthContext'
import { ThemeContext } from './ThemeContext'
import playTrack from './playTrack'
import { Link } from 'react-router-dom'

export default function PanelGrid({ content, head }) {
    
    const accessToken = useContext(AuthContext)
    const [colors, setColors] = useState([])
    const [gradient, setGradient] = useState('')
    const { setCurrentTheme } = useContext(ThemeContext)
//    var element = document.getElementById('gridPanelLower')

 
    function getColor(itemId, imgUrl) {

        var canvas = document.createElement('canvas');
        var ctx    = canvas.getContext('2d');

        var myImgElement = new Image() 
        myImgElement.onload = function() {
            canvas.width = myImgElement.naturalWidth
            canvas.height = myImgElement.naturalHeight
            var x = Math.floor(canvas.width)
            var y = Math.floor(canvas.height / 4)
            ctx.drawImage( myImgElement, 0, 0 );
            var imgdata = ctx.getImageData(0, 0, x, y);
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
            obj['rgb'] = '' + avgRed + ', ' + avgGreen + ', ' + avgBlue 

            setColors(colors => [...colors, obj])
        }        
        myImgElement.src = imgUrl   
        myImgElement.crossOrigin = ''
    }

    function changeBg(itemId) {
       
        var newBg = colors.filter(color => color.id === itemId)
        if (newBg.length === 0) {
            console.log('error')
        }
        else {
           setGradient(newBg[0].bg) 
        }     
              
    }

    function updateTheme(itemId) {
        var newTheme = colors.filter(color => color.id === itemId)
        if (newTheme.length === 0) {
            console.log('error')
        }
        else {
           setCurrentTheme(newTheme[0].rgb) 
        }  

    }



    return (
        
        <div id='gridPanel' style={{background: gradient}}
         onLoad={()=> {
             updateTheme(content[0].id)
             changeBg(content[0].id)}}>
        <div id='gridPanelLower'></div>
        <div id='dashGreeting'>
        <span>{head}</span>
        </div>
        
        <div id='gridContent'>
        {content.slice(0, 8).map(cont =>
          <Link style={{textDecoration: 'none', width: '19vw'}} 
                key={cont.key} 
                to={{pathname: `/${cont.type}/${cont.id}`, state: cont.id }}
                >
          <div className='gridCard'
               onMouseOver={()=> {
                   updateTheme(cont.id)
                   changeBg(cont.id)
                }}
               onMouseLeave={()=> {
                
                   updateTheme(content[0].id)
                   changeBg(content[0].id)
                }}
          >
            <img className='gridCardImage' src={cont.imgUrl} alt=''
                 onLoad={()=> getColor(cont.id, cont.imgUrl)} />
            <div className='gridCardTitle'>
                <span>{cont.name}</span>
            </div>
            <div className='gridPlayButton'
                onClick={(e) => {
                 e.preventDefault()
                 playTrack(accessToken, {context_uri: cont.uri})} 
               }
            >
                <div className='gridPlayIcon'></div>
            </div>
          </div>   
          </Link> 
        )}
        </div>

        </div>
    )
}
