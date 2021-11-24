import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import { TrackContext } from './TrackContext'
import playTrack from './playTrack'
import pauseTrack from './pauseTrack'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

export default function Panel({ content }) {
  
const accessToken = useContext(AuthContext)
const { nowPlaying } = useContext(TrackContext)
const history = useHistory()

    
    return (
        <div className='panel'>  
        {content.map(cont =>
          <Link className='cardLink' style={{textDecoration: 'none', marginRight: '1.5vw'}} key={cont.key} to={{pathname: `/${cont.type}/${cont.id}`, state: cont.id }}>
          <div className='cardBody'>
            {cont.type === 'artist'?
            <img className='cardArtist' src={cont.imgUrl} alt='' />
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
            <span className='cardTitle'>{cont.name}</span>
            <br /> 
            <span className='cardSub'>        
            {(cont.type === 'album' && !cont.onAlbumPage && !cont.onArtistPage)?
            cont.artists.map((artist, index, artists) =>
            <span key={artist.id}>
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
