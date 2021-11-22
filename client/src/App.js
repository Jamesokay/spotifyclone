import './App.css'
import Login from "./Login"
import Dashboard from "./Dashboard"
import ArtistPage from "./ArtistPage"
import AlbumPage from "./AlbumPage"
import PlaylistPage from "./PlaylistPage"
import Search from "./Search"
import CollectionPlaylist from './CollectionPlaylist'
import CollectionAlbum from './CollectionAlbum'
import CollectionArtist from './CollectionArtist'
import PanelExpanded from './PanelExpanded'
import { useState, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import { ThemeContext } from './ThemeContext'
import { UserContext } from './UserContext'
import { PageContext } from './PageContext'
import { PlaylistContext } from './PlaylistContext'
import { TrackContext } from './TrackContext'
import { SidebarContext } from './SidebarContext'
import axios from 'axios'
import { Route } from 'react-router-dom'
import Layout from './Layout'
import CollectionTrack from './CollectionTrack'
import { useLocation } from 'react-router-dom'
import getDataObject from './getDataObject'


function App() {

  const code = new URLSearchParams(window.location.search).get("code")
  localStorage.setItem('clientId', 'e39d5b5b499d4088a003eb0471c537bb')

  const [accessToken, setAccessToken] = useState(null)
  const [user, setUser] = useState(null)

  const [currentTheme, setCurrentTheme] = useState('0, 0, 0')
  const theme = {currentTheme, setCurrentTheme}

  const [currentPage, setCurrentPage] = useState({pageName: '',
                                                  pageUri: ''})
  const page = {currentPage, setCurrentPage}

  const [newTrack, setNewTrack] = useState({})
  const track = {newTrack, setNewTrack}

  const [nowPlaying, setNowPlaying] = useState({contextUri: '',
                                                trackUri: '',
                                                trackName: '',
                                                isPaused: false})
  const currentTrack = {nowPlaying, setNowPlaying}

  const [userPlaylists, setUserPlaylists] = useState([])
  const sidebarPlaylists = {userPlaylists, setUserPlaylists}
  
//  const [navPlayerShow, setNavPlayerShow] = useState(false)
//  const navPlayer = {navPlayerShow, setNavPlayerShow}
  
  const location = useLocation()


  useEffect(() => {
    if (!code) return

    axios
      .post("/login", {code})
      .then(res => {
        setAccessToken(res.data.accessToken)
        window.history.pushState({}, null, "/")
      })
      .catch(error => {
        console.log(error)
      })
  }, [code])

  useEffect(() => {
    if (!accessToken) return

    const options = {
      url: 'https://api.spotify.com/v1/me',
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          }
      }
  
    axios(options)
    .then(response => {
       console.log(response.data)
       setUser(response.data)
    })
    .catch(error => {
      console.log(error)
    })

  }, [accessToken])

  useEffect(() => {
    if (!accessToken) return

    const options = {
      url: 'https://api.spotify.com/v1/me/playlists',
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          }
      }
  
    axios(options)
    .then(response => {
       setUserPlaylists(response.data.items.map(getDataObject))
    })
    .catch(error => {
      console.log(error)
    })

  }, [accessToken])


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])
  

    return (
      <AuthContext.Provider value={accessToken}>
      <ThemeContext.Provider value={theme}>
      <UserContext.Provider value={user}>
      <PageContext.Provider value={page}>
      <PlaylistContext.Provider value={track}>
      <TrackContext.Provider value={currentTrack}>
      <SidebarContext.Provider value={sidebarPlaylists}>
      
        <Layout>
        <Route path='/' exact component={(accessToken)? Dashboard : Login} />
        <Route path='/search' component={Search} />
        <Route path="/playlist/:id" component={PlaylistPage} />
        <Route path="/album/:id" component={AlbumPage} />
        <Route path="/artist/:id" component={ArtistPage} />
        <Route path="/genre/:id" component={PanelExpanded} />
        <Route path="/collection/playlists" component={CollectionPlaylist} />
        <Route path="/collection/artists" component={CollectionArtist} />
        <Route path="/collection/albums" component={CollectionAlbum} />
        <Route path="/collection/tracks" component={CollectionTrack} />
        </Layout>

      </SidebarContext.Provider>
      </TrackContext.Provider>
      </PlaylistContext.Provider>
      </PageContext.Provider>
      </UserContext.Provider>
      </ThemeContext.Provider>
      </AuthContext.Provider>
    )

}

export default App;
