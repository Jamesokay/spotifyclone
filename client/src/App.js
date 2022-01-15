import './App.css'
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import ArtistPage from "./pages/ArtistPage"
import AlbumPage from "./pages/AlbumPage"
import PlaylistPage from "./pages/PlaylistPage"
import Search from "./pages/Search"
import CollectionPlaylist from './pages/CollectionPlaylist'
import CollectionAlbum from './pages/CollectionAlbum'
import CollectionArtist from './pages/CollectionArtist'
import { useState, useEffect } from 'react'
import { AuthContext, ThemeContext, UserContext, PageContext, PlaylistContext, TrackContext, SidebarContext, SideBarWidthContext, RightClickContext, NotificationContext } from './contexts'
import { DashContextProvider } from './DashContext'
import axios from 'axios'
import { Route } from 'react-router-dom'
import Layout from './components/Layout'
import CollectionTrack from './pages/CollectionTrack'
import getDataObject from './utils/getDataObject'


function App() {

  const code = new URLSearchParams(window.location.search).get("code")
  localStorage.setItem('clientId', 'e39d5b5b499d4088a003eb0471c537bb')

  const [accessToken, setAccessToken] = useState(null)
  const [user, setUser] = useState(null)

  const [currentTheme, setCurrentTheme] = useState({red: 0, green: 0, blue: 0})
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
  
  const [rightClick, setRightClick] = useState({type: '',
                                                yPos: 0,
                                                xPos: 0,
                                                id: ''})
  const rightClickedEl = {rightClick, setRightClick}

  const [notification, setNotification] = useState({text: '',
                                                    action: ''})
  const message = {notification, setNotification}

  const [currentWidth, setCurrentWidth] = useState(window.innerWidth * 0.15)
  const sideWidth = {currentWidth, setCurrentWidth}


  useEffect(() => {
    if (!code) return

    const logIn = async () => {
      try {
        const response = await axios.post("/login", {code})
        setAccessToken(response.data.accessToken)
        window.history.pushState({}, null, "/")
      } catch (err) {
        console.error(err)
      }
    }

    logIn()

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

    const getUser = async () => {
      try {
        const response = await axios(options)
        setUser(response.data)
      } catch (err) {
        console.error(err)
      }
    }
  
    getUser()

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
    
    const getUserPlaylists = async () => {
      try {
        const response = await axios(options)
        setUserPlaylists(response.data.items.map(getDataObject))
      } catch (err) {
        console.error(err)
      }
    }
    
    getUserPlaylists()

  }, [accessToken])

  

    return (
      <AuthContext.Provider value={accessToken}>
      <ThemeContext.Provider value={theme}>
      <UserContext.Provider value={user}>
      <PageContext.Provider value={page}>
      <PlaylistContext.Provider value={track}>
      <TrackContext.Provider value={currentTrack}>
      <SidebarContext.Provider value={sidebarPlaylists}>
      <RightClickContext.Provider value={rightClickedEl}>
      <NotificationContext.Provider value={message}>
      <SideBarWidthContext.Provider value={sideWidth}>
      <DashContextProvider>
      
        <Layout>
        <Route path='/' exact component={(accessToken)? Dashboard : Login} />
        <Route path='/search' component={Search} />
        <Route path="/playlist/:id" component={PlaylistPage} />
        <Route path="/album/:id" component={AlbumPage} />
        <Route path="/artist/:id" component={ArtistPage} />
        <Route path="/collection/playlists" component={CollectionPlaylist} />
        <Route path="/collection/artists" component={CollectionArtist} />
        <Route path="/collection/albums" component={CollectionAlbum} />
        <Route path="/collection/tracks" component={CollectionTrack} />
        </Layout>
        
      </DashContextProvider>
      </SideBarWidthContext.Provider>
      </NotificationContext.Provider>
      </RightClickContext.Provider>
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
