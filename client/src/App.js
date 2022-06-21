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
import { PlaylistContext, TrackContext, RightClickContext } from './contexts'
import axios from 'axios'
import { Route } from 'react-router-dom'
import Layout from './components/Layout'
import CollectionTrack from './pages/CollectionTrack'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser, updateToken } from './userSlice'
import { DashContextProvider } from './DashContext'


function App() {
  const code = new URLSearchParams(window.location.search).get("code")
  localStorage.setItem('clientId', 'e39d5b5b499d4088a003eb0471c537bb')
  const dispatch = useDispatch()
  const accessToken = useSelector(state => state.user.token)

  const [newTrack, setNewTrack] = useState({})
  const track = {newTrack, setNewTrack}

  const [nowPlaying, setNowPlaying] = useState({contextUri: '', trackUri: '', trackName: '', isPaused: false})
  const currentTrack = {nowPlaying, setNowPlaying}
  
  const [rightClick, setRightClick] = useState({type: '', yPos: 0, xPos: 0, id: ''})
  const rightClickedEl = {rightClick, setRightClick}

  useEffect(() => {
    if (!code) return
    const logIn = async () => {
      try {
        const response = await axios.post("/login", {code})
        dispatch(updateToken({token: response.data.accessToken}))
        window.history.pushState({}, null, "/")
      } catch (err) { console.error(err) }
    }
    logIn()
  }, [code, dispatch])

  useEffect(() => {
    if (!accessToken) return
    const getUser = async () => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/me`, 
        {headers: { 
          'Authorization': `Bearer ${accessToken}`, 
          'Content-Type': 'application/json'
        }})
        if (!response.ok) {throw new Error(`An error has occured: ${response.status}`)}
        let userProfile = await response.json()
        dispatch(updateUser({profile: userProfile}))
      } catch (err) { console.error(err) }
    } 
    getUser()
  }, [accessToken, dispatch])

    return (
      <PlaylistContext.Provider value={track}>
      <TrackContext.Provider value={currentTrack}>
      <RightClickContext.Provider value={rightClickedEl}>
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
      </RightClickContext.Provider>
      </TrackContext.Provider>
      </PlaylistContext.Provider>
    )

}

export default App;
