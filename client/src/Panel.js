import { AuthContext } from './AuthContext'
import { TrackContext } from './TrackContext'
import playTrack from './playTrack'
import pauseTrack from './pauseTrack'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { RightClickContext } from './RightClickContext'
import { useState, useEffect, useContext } from 'react'
import useViewport from './useViewPort'
import { SideBarWidthContext } from './SideBarWidthContext'

export default function Panel({ content }) {
  
    const accessToken = useContext(AuthContext)
    const { nowPlaying } = useContext(TrackContext)
    const history = useHistory()
    const { rightClick, setRightClick } = useContext(RightClickContext)
    const [index, setIndex] = useState(8)
    const [cardWidth, setCardWidth] = useState('17.8%')
    const { width } = useViewport()
    const { currentWidth } = useContext(SideBarWidthContext)
    const breakPointLarge = 1060
    const breakPointMedium = 860
    const breakPointSmall = 620
    

    useEffect(() => {
        if ((width - currentWidth) <= breakPointSmall) {
          setIndex(2)
          setCardWidth('44.5%')
        }
        else if ((width - currentWidth) > breakPointSmall && (width - currentWidth) <= breakPointMedium) {
          setIndex(3)
          setCardWidth('29.6%')
        }
        else if ((width - currentWidth) > breakPointMedium && (width - currentWidth) < breakPointLarge) {
          setIndex(4)
          setCardWidth('22.25%')
        }
        else if ((width - currentWidth) >= breakPointLarge) {
          setIndex(5)
          setCardWidth('17.8%')
        }

        return function cleanUp() {
            setIndex(8)
            setCardWidth('17.8%')
        }
    }, [width, currentWidth])



    
    return (
        <div className='panel'> 
        {content.slice(0, index).map(cont =>
          <Link className='cardLink' style={{width: cardWidth}} key={cont.key} to={{pathname: `/${cont.type}/${cont.id}`, state: cont.id }}
                onContextMenu={(e) => setRightClick({type: cont.type, yPos: e.screenY, xPos: e.screenX, id: cont.id})}>
          <div className='cardBody' style={(rightClick.id === cont.id)? {background: 'rgb(40, 40, 40)'} : {}}>
            {cont.type === 'artist'?
            <div className='cardImageBox'>
            <img className='cardArtist' src={cont.imgUrl} alt='' />
            </div>
            :
            <div className='cardImageBox'>
              <img className='cardImage' src={cont.imgUrl} alt='' />
              <div className ='cardPlayButton'
                   style={(cont.uri === nowPlaying.contextUri)? {opacity: '1', bottom: '27px'} : {opacity: '0'}}
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
               }>
                <div className={(!nowPlaying.isPaused && cont.uri === nowPlaying.contextUri)? 'cardPauseIcon' : 'cardPlayIcon'}></div>
              </div>
            </div>
            }
            <div className='cardText'>
            <span className='cardTitle' style={(rightClick.id === cont.id)? {textDecoration: 'underline'} : {}}>{cont.name}</span>
            <br /> 
            <span className='cardSub'>        
            {(cont.type === 'album' && !cont.onAlbumPage && !cont.onArtistPage)?
            cont.artists.map((artist, index, artists) =>
            <span key={artist.id} style={(rightClick.id === cont.id)? {textDecoration: 'underline'} : {}}>
              <span className='cardSubLink' onClick={(e) => {
                e.preventDefault()
                history.push({
                  pathname: `/artist/${artist.id}`,
                  search: '', 
                  state: artist.id
                })
              }}>{artist.name}</span>
              {(index < artists.length - 1)?
              <span className='cardPunc'>, </span>
              :
              <></>
              }
            </span>
            )
            :
            <span className='cardSub'>{cont.subtitle}</span>
            }
            </span>  
            </div>
          </div>
          </Link>
        )}
        </div>)
}
