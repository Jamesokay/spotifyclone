import { useState, useContext, useEffect } from 'react'
import useViewport from '../hooks/useViewPort'
import { TrackContext, RightClickContext, SideBarWidthContext } from '../contexts'
import playTrack from '../utils/playTrack'
import pauseTrack from '../utils/pauseTrack'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateTheme } from '../pageSlice'

export default function PanelGrid({ content, head }) {
    
    const accessToken = useSelector(state => state.user.token)
    const [cardsWithColours, setCardsWithColours] = useState([]) 
    const [gradient, setGradient] = useState('')
    const { nowPlaying } = useContext(TrackContext)
    const { rightClick, setRightClick } = useContext(RightClickContext)
    const [index, setIndex] = useState(8)
    const [cardWidth, setCardWidth] = useState(25)
    const { width } = useViewport()
    const { currentWidth } = useContext(SideBarWidthContext)
    const breakPointMedium = 1215
    const breakPointSmall = 920
    const dispatch = useDispatch()

    
    // Generate the array of objects to be rendered
    useEffect(() => {
        getColor(content.slice(0, 8))

        return () => {
            setCardsWithColours([])
        }
    }, [content])

    
    // Make both the width of each card and the length of the rendered array responsive to viewport resizes.
    // Index is used as a variable determing how far to slice() into cardsWithColours, cardWidth sets the % width of each card.
    useEffect(() => {
        if ((width - currentWidth) <= breakPointSmall) {
          setIndex(4)
          setCardWidth(50)
        }
        else if ((width - currentWidth) > breakPointSmall && (width - currentWidth) <= breakPointMedium) {
            setIndex(6)
            setCardWidth(33.3)
        }
        else if ((width - currentWidth) > breakPointMedium) {
            setIndex(8)
            setCardWidth(25)
        }

        return () => {
            setIndex(8)
            setCardWidth(25)
        }
    }, [width, currentWidth])

    // Function to draw the image of each card on an off-screen canvas, generating a pixel array from which the average RGB values of a
    // specified region of the image can be calculated. This average colour is then added to the existing object as a property.
    // The background and theme can thereby achieve the desired effect: background/theme colour changing to that of the card's bg/rgb
    // property when hovered over.
    const getColor = array => {

        for (const item of array) {
          let canvas = document.createElement('canvas');
          let ctx    = canvas.getContext('2d');
          let myImgElement = new Image() 

          myImgElement.onload = function() {
            canvas.width = myImgElement.naturalWidth
            canvas.height = myImgElement.naturalHeight
    
            let yStart = Math.floor(canvas.height * 0.5)
            ctx.drawImage( myImgElement, 0, 0 );
            let imgdata = ctx.getImageData(0, yStart, 50, 50);
            let pixels = imgdata.data;

            let red = 0
            let green = 0
            let blue = 0

            for (let i = 0; i < pixels.length; i += 4) {
              red += pixels[i]
              green += pixels[i + 1]
              blue += pixels[i + 2]
            }

            let avgRed = Math.floor(red / (pixels.length / 4))
            let avgGreen = Math.floor(green / (pixels.length / 4))
            let avgBlue = Math.floor(blue / (pixels.length / 4))

            let obj = {
              ...item,
              bg: 'rgb(' + avgRed + ',' + avgGreen + ',' + avgBlue + ')',
              rgb: {red: avgRed, green: avgGreen, blue: avgBlue}
            }
            setCardsWithColours(cardsWithColours => [...cardsWithColours, obj])
          }    

        myImgElement.src = item.imgUrl   
        myImgElement.crossOrigin = ''  
        }
    }


    return cardsWithColours.length === 8? (     
        <div id='gridPanel' style={{background: gradient}}
         onLoad={()=> {
            setGradient(cardsWithColours[0].bg) 
            dispatch(updateTheme({red: cardsWithColours[0].rgb.red, green: cardsWithColours[0].rgb.green, blue: cardsWithColours[0].rgb.blue }))}}>
        <div id='gridPanelLower' />
        <div id='dashGreeting'>{head}</div>     
        <div id='gridContent'>
        {cardsWithColours.slice(0, index).map(cont =>
          <Link className='gridCardLink' 
                style={{flex: `0 1 calc(${cardWidth}% - 25px)`}}
                key={cont.key} 
                to={{pathname: `/${cont.type}/${cont.id}`, state: cont.id }}
                onContextMenu={() => setRightClick({type: cont.type, id: cont.id})}
                >
          <div className='gridCard'
               style={(rightClick.id === cont.id)? {backgroundColor: 'rgba(128, 128, 128, 0.7)'} : {}}
               onMouseOver={()=> {
                setGradient(cont.bg)
                dispatch(updateTheme({red: cont.rgb.red, green: cont.rgb.green, blue: cont.rgb.blue}))
                }}
               onMouseLeave={()=> {
                setGradient(cardsWithColours[0].bg) 
                dispatch(updateTheme({red: cardsWithColours[0].rgb.red, green: cardsWithColours[0].rgb.green, blue: cardsWithColours[0].rgb.blue }))
                }}
          >
            <img className='gridCardImage' src={cont.imgUrl} alt=''/>
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
    :
    <div id='gridPanel' />
}
