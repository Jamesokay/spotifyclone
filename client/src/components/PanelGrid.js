import { useState, useContext, useEffect } from 'react'
import useViewport from '../hooks/useViewPort'
import { TrackContext, RightClickContext } from '../contexts'
import playTrack from '../utils/playTrack'
import pauseTrack from '../utils/pauseTrack'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateTheme } from '../pageSlice'
import { DashContext } from '../DashContext'

export default function PanelGrid({ head }) {  
    const accessToken = useSelector(state => state.user.token)
    const [gradient, setGradient] = useState('')
    const { nowPlaying } = useContext(TrackContext)
    const { rightClick, setRightClick } = useContext(RightClickContext)
    const [index, setIndex] = useState(8)
    const [cardWidth, setCardWidth] = useState(25)
    const { width } = useViewport()
    const sidebarWidth = useSelector(state => state.page.sidebarWidth)
    const breakPointMedium = 1215
    const breakPointSmall = 920
    const dispatch = useDispatch()
    const { recentGrid } = useContext(DashContext)
 
    // Make both the width of each card and the length of the rendered array responsive to viewport resizes.
    // Index is used as a variable determing how far to slice() into cardsWithColours, cardWidth sets the % width of each card.
    useEffect(() => {
        if ((width - sidebarWidth) <= breakPointSmall) {
          setIndex(4)
          setCardWidth(50)
        }
        else if ((width - sidebarWidth) > breakPointSmall && (width - sidebarWidth) <= breakPointMedium) {
            setIndex(6)
            setCardWidth(33.3)
        }
        else if ((width - sidebarWidth) > breakPointMedium) {
            setIndex(8)
            setCardWidth(25)
        }
        return () => {
            setIndex(8)
            setCardWidth(25)
        }
    }, [width, sidebarWidth])

    return (     
        <div id='gridPanel' style={{background: gradient}}
         onLoad={()=> {
            setGradient(recentGrid[0].bg) 
            dispatch(updateTheme({red: recentGrid[0].red, green: recentGrid[0].green, blue: recentGrid[0].blue }))}}>
        <div id='gridPanelLower' />
        <div id='dashGreeting'>{head}</div>     
        <div id='gridContent'>
        {recentGrid.slice(0, index).map(cont =>
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
                dispatch(updateTheme({red: cont.red, green: cont.green, blue: cont.blue}))
                }}
               onMouseLeave={()=> {
                setGradient(recentGrid[0].bg) 
                dispatch(updateTheme({red: recentGrid[0].red, green: recentGrid[0].green, blue: recentGrid[0].blue }))
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
}
