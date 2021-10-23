import CollectionNav from './CollectionNav'

export default function CollectionPlaylist() {
    return (
        <div id='collectionPage'>
          <CollectionNav />
          <div style={{marginLeft: '2vw', marginTop: '9vh'}}>
            <p style={{color: 'white', fontSize: '22pt', fontFamily: 'Verdana'}}>Playlists</p>
            <div style={{width: '450px', height: '250px', backgroundColor: 'blue'}}></div>
          </div>
        </div>
    )
}
