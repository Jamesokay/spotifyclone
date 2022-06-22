import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { TrackContext, RightClickContext } from '../contexts'
import { useSelector } from 'react-redux'
import playTrack from '../utils/playTrack'
import pauseTrack from '../utils/pauseTrack'
import { Link } from 'react-router-dom'

export default function Card({ item, cardWidth }) {
  const accessToken = useSelector(state => state.user.token)
  const history = useHistory()
  const { rightClick, setRightClick } = useContext(RightClickContext)
  const { nowPlaying } = useContext(TrackContext)

  const handlePlay = (e, uri) => {
    e.preventDefault()
    if (uri === nowPlaying.contextUri && !nowPlaying.isPaused) { pauseTrack(accessToken) }
    else if (uri === nowPlaying.contextUri && nowPlaying.isPaused) { playTrack(accessToken) }
    else { playTrack(accessToken, {context_uri: uri}) }
  }

  const handleArtistClick = (e, artistId) => {
    e.preventDefault()
    history.push({ pathname: `/artist/${artistId}`, search: '', state: artistId })
  }
  
  return (
  <Link className='cardLink' style={{width: cardWidth}} to={{pathname: `/${item.type}/${item.id}`, state: item.id }} onContextMenu={() => setRightClick({type: item.type, id: item.id})}>
    <div className='cardBody' style={(rightClick.id === item.id)? {background: 'rgb(40, 40, 40)'} : {}}>
      {item.type === 'artist'?
        <img className='cardArtist' src={item.imgUrl} alt='' />
      :
        <div className='cardImageBox'>
          <img className='cardImage' src={item.imgUrl} alt='' />
          <div className ='cardPlayButton' style={(item.uri === nowPlaying.contextUri)? {opacity: '1', bottom: '27px'} : {}} onClick={(e) => handlePlay(e, item.uri)}>
            <div className={(!nowPlaying.isPaused && item.uri === nowPlaying.contextUri)? 'cardPauseIcon' : 'cardPlayIcon'} />
          </div>
        </div>
      }
      <div className='cardText'>
        <span className='cardTitle' style={(rightClick.id === item.id)? {textDecoration: 'underline'} : {}}>{item.name}</span>
        <span className='cardSub'>        
        {(item.type === 'album' && !item.onAlbumPage && !item.onArtistPage)?
          item.artists.map((artist, index, artists) =>
          <span key={artist.id} style={(rightClick.id === item.id)? {textDecoration: 'underline'} : {}}>
            <span className='cardSubLink' onClick={(e) => handleArtistClick(e, artist.id)}>{artist.name}</span>
            {(index < artists.length - 1) && ( <span className='cardPunc'>, </span> )}
          </span>)
          :
          <span className='cardSub'>{item.subtitle}</span>
        }
        </span>  
      </div>
    </div>
  </Link>
  )
}
