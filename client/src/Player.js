export default function Player() {
  return (
    <div className='playBar'>
      <div className='playingTrack'>
        <div className='playingTrackImg'></div>
        <div className='playingTrackInfo'>
          <span className='playingTrackName'>A Track</span>
          <br />
          <span className='playingTrackArtist'>Artist Name</span>
        </div>
      </div>
      <div className='playButton'>
        <div className='playIcon'></div>
      </div>
    </div>
    )
}
