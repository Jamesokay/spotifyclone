import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import playTrack from './playTrack'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

export default function Panel({ content, panelVariant }) {
  
const accessToken = useContext(AuthContext)
const history = useHistory()
    
    return (
        <div style={(panelVariant)? 
          {display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap'} 
          : 
          {display: 'flex', justifyContent: 'space-evenly'}}>  
        {content.map(cont =>
          <Link style={{textDecoration: 'none'}} key={cont.key} to={{pathname: `/${cont.type}/${cont.id}`, state: cont.id }}>
          <div className='cardBody' style={(panelVariant)? {marginRight: '15px'} : {marginRight: '0'}}>
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
              <span></span>
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
