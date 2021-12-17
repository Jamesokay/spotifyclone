import { useState, useContext, useEffect } from 'react'
import useViewport from './useViewPort'
import { AuthContext } from './AuthContext'
import { ThemeContext } from './ThemeContext'
import { TrackContext } from './TrackContext'
import { RightClickContext } from './RightClickContext'
import { SideBarWidthContext } from './SideBarWidthContext'
import playTrack from './playTrack'
import pauseTrack from './pauseTrack'
import { Link } from 'react-router-dom'

export default function PanelGrid({ content, head }) {
    
    const accessToken = useContext(AuthContext)
    const [colors, setColors] = useState([])
    const [gradient, setGradient] = useState('')
    const { setCurrentTheme } = useContext(ThemeContext)
    const { nowPlaying } = useContext(TrackContext)
    const { rightClick, setRightClick } = useContext(RightClickContext)
    const [index, setIndex] = useState(8)
    const [cardWidth, setCardWidth] = useState('22.25%')
    const { width } = useViewport()
    const { currentWidth } = useContext(SideBarWidthContext)
    const breakPointMedium = 1215
    const breakPointSmall = 920
    

    useEffect(() => {
        if ((width - currentWidth) <= breakPointSmall) {
          setIndex(4)
          setCardWidth('44.5%')
        }
        else if ((width - currentWidth) > breakPointSmall && (width - currentWidth) <= breakPointMedium) {
            setIndex(6)
            setCardWidth('29.6%')
        }
        else if ((width - currentWidth) > breakPointMedium) {
            setIndex(8)
            setCardWidth('22.25%')
        }

        return function cleanUp() {
            setIndex(8)
            setCardWidth('22.25%')
        }
    }, [width, currentWidth])

 
    function getColor(itemId, imgUrl) {

        var canvas = document.createElement('canvas');
        var ctx    = canvas.getContext('2d');

        var myImgElement = new Image() 
        myImgElement.onload = function() {
            canvas.width = myImgElement.naturalWidth
            canvas.height = myImgElement.naturalHeight
    
            var yStart = Math.floor(canvas.height * 0.5)
            ctx.drawImage( myImgElement, 0, 0 );
            var imgdata = ctx.getImageData(0, yStart, 50, 50);
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
            obj['rgb'] = {red: avgRed, green: avgGreen, blue: avgBlue}

            setColors(colors => [...colors, obj])
        }        
        myImgElement.src = imgUrl   
        myImgElement.crossOrigin = ''
    }

    function changeBg(itemId) {
       
        var newBg = colors.filter(color => color.id === itemId)
        if (newBg.length === 0) {
            return
        }
        else {
           setGradient(newBg[0].bg) 
        }     
              
    }

    function updateTheme(itemId) {
        var newTheme = colors.filter(color => color.id === itemId)
        if (newTheme.length === 0) {
            return
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
        {head}
        </div>
        
        <div id='gridContent'>
        {content.slice(0, index).map(cont =>
          <Link className='gridCardLink' 
                style={{width: cardWidth}}
                key={cont.key} 
                to={{pathname: `/${cont.type}/${cont.id}`, state: cont.id }}
                onContextMenu={(e) => setRightClick({type: cont.type,  yPos: e.screenY, xPos: e.screenX, id: cont.id})}
                >
          <div className='gridCard'
               style={(rightClick.id === cont.id)? {backgroundColor: 'rgba(128, 128, 128, 0.7)'} : {}}
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
            <div className='gridCardTitle' style={(rightClick.id === cont.id)? {textDecoration: 'underline'} : {}}>{cont.name}</div>
            <div className='gridPlayButton'
                style={(cont.uri === nowPlaying.contextUri)? {opacity: '1'} : {opacity: '0'}}
                onClick={(e) => {
                 e.preventDefault()
                 if (cont.uri === nowPlaying.contextUri && !nowPlaying.isPaused) {
                     pauseTrack(accessToken)
                 }
                 else if (cont.uri === nowPlaying.contextUri && nowPlaying.isPaused) {
                     playTrack(accessToken)
                 }
                 else {
                 playTrack(accessToken, {context_uri: cont.uri})} 
                }
               }
            >
                <div className={(!nowPlaying.isPaused && cont.uri === nowPlaying.contextUri)? 'cardPauseIcon' : 'cardPlayIcon'}></div>
            </div>
          </div>   
          </Link> 
        )}
        </div>

        </div>
    )
}
