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
import axios from 'axios'
import { Route } from 'react-router-dom'
import Layout from './Layout'


function App() {

  const code = new URLSearchParams(window.location.search).get("code")
  localStorage.setItem('clientId', 'e39d5b5b499d4088a003eb0471c537bb')

  const [accessToken, setAccessToken] = useState(null)

  const [currentTheme, setCurrentTheme] = useState('0, 0, 0')
  const theme = {currentTheme, setCurrentTheme}

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
  

    return (
      <AuthContext.Provider value={accessToken}>
      <ThemeContext.Provider value={theme}>
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
        </Layout>
      </ThemeContext.Provider>
      </AuthContext.Provider>
    )

}

export default App;
