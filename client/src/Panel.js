import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import playTrack from './playTrack'
import { Link } from 'react-router-dom'

export default function Panel({ content, dispatch }) {
  
const accessToken = useContext(AuthContext)
    
    return (
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>  
        {content.map(cont =>
          <Link style={{textDecoration: 'none'}} key={cont.key} to={{pathname: `/${cont.type}/${cont.id}`, state: cont.id }}>
          <div className='cardBody'>
            {cont.type === 'artist'?
            <img className='cardArtist' src={cont.imgUrl} alt='' />
            :
            <div className='cardImageBox'>
              <img className='cardImage' src={cont.imgUrl} alt='' />
              <div className ='cardPlayButton'
               onClick={(e) => {
                 e.preventDefault()
                 playTrack(accessToken, {context_uri: cont.uri})} 
               }>
                <div className='cardPlayIcon'></div>
              </div>
            </div>
            }
            <div className='cardText'>
            <span className='cardTitle'>{cont.name}</span>
            <br />           
            {cont.type === 'album'?
            cont.artists.map((artist, index, artists) =>
            <span key={artist.id}>
              <span className='cardSubLink'>{artist.name}</span>
              {(index < artists.length - 1)?
              <span className='cardPunc'>, </span>
              :
              <span></span>
              }
            </span>
            )
            :
            <span className='cardSub'>{cont.subtitle}</span>
            }
            </div>
          </div>
          </Link>
        )}
        </div>)
}
