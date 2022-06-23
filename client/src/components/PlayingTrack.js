import { Link } from 'react-router-dom'

export default function PlayingTrack({ track }) {
  return (
    <div className='playingTrack'>
      <div className='playingTrackImgContainer'>
        <img className='playingTrackImg' src={track.album.images[0].url} alt='' />
      </div>  
      <div className='playingTrackText'>
        <Link style={{textDecoration: 'none'}} to={{pathname: `/album/${track.album.uri.slice(14)}`, state: track.album.uri.slice(14) }}>
          <span className={(track.name.length >= 30)? 'playingTrackNameScroll':'playingTrackName'}>{track.name}</span>
        </Link>
        <div className='trackArtists'>
        {track.artists.map((artist, index, artists) => 
          <span key={artist.uri}>
            <Link style={{textDecoration: 'none'}} to={{pathname: `/artist/${artist.uri.slice(15)}`, state: artist.uri.slice(15) }}>
              <span className='playingTrackArtist'>{artist.name}</span>
            </Link>
              {(index < artists.length - 1)? <span className='playerPunc'>, </span> : <></> }
          </span>
        )}
        </div>
      </div>           
    </div>
  )
}
