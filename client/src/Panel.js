import { useContext } from 'react'
// import { TrackContext } from './TrackContext'
import { AuthContext } from './AuthContext'
import playTrack from './playTrack'

export default function Panel({ content, dispatch }) {
  
const accessToken = useContext(AuthContext)
//  const trackContext = useContext(TrackContext)

    
  function pageChange(pageType, pageId) {
    if (pageType === 'artist') {
      dispatch({
        type: 'ARTIST_PAGE',
        id: pageId
      })
    }
    else if (pageType === 'album' || pageType === 'artistAlbum') {
      dispatch({
        type: 'ALBUM_PAGE',
        id: pageId
      })
    }
    else if (pageType === 'playlist') {
      dispatch({
        type: 'PLAYLIST_PAGE',
        id: pageId
      })
    }
  }

  // function playTrack(trackUri) {

  //   const play = ({
  //     spotify_uri,
  //     playerInstance: {
  //       _options: {
  //         getOAuthToken
  //       }
  //     }
  //   }) => {
  //     getOAuthToken(access_token => {
  //       fetch(`https://api.spotify.com/v1/me/player/play`, {
  //         method: 'PUT',
  //         body: JSON.stringify({ uris: [spotify_uri] }),
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${accessToken}`
  //         },
  //       });
  //     });
  //   };
    
    // play({
    //   playerInstance: player,
    //   spotify_uri: trackUri,
    // });
 
 // }
    
    return (
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>  
        {content.map(cont =>
          <div className='cardBody' key={cont.key}>
            {cont.type === 'artist'?
            <img className='cardArtist' src={cont.imgUrl} alt='' onClick={() => pageChange(cont.type, cont.id)} />
            :
            <div className='cardImageBox'>
              <img className='cardImage' src={cont.imgUrl} alt='' onClick={() => pageChange(cont.type, cont.id)} />
              <div className ='cardPlayButton'
               onClick={() => playTrack(accessToken, {context_uri: cont.uri})} >
                <div className='cardPlayIcon'></div>
              </div>
            </div>
            }
            <div className='cardText'>
            <span className='cardTitle' onClick={() => pageChange(cont.type, cont.id)}>{cont.name}</span>
            <br />           
            {cont.type === 'album'?
            cont.artists.map((artist, index, artists) =>
            <span key={artist.id}>
              <span className='cardSubLink' onClick={() => pageChange('artist', artist.id)}>{artist.name}</span>
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
        )}
        </div>)
}
