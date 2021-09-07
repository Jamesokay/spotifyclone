import './App.css'
import Login from "./Login"
import Dashboard from "./Dashboard"
import ArtistPage from "./ArtistPage"
import AlbumPage from "./AlbumPage"
import PlaylistPage from "./PlaylistPage"
import Search from "./Search"
import PanelExpanded from './PanelExpanded'
import { useReducer, useState, useEffect } from 'react'
import { AuthProvider } from './AuthContext'
import NavBar from './NavBar'
import Player from './Player'
import { TrackContextProvider } from './TrackContext'


const initialState = {
  pageType: 'dashboard',
  pageId: null
}


function reducer(state, action) {
  switch(action.type) {
    case 'ARTIST_PAGE':
      return {
        pageType: 'artist',
        pageId: action.id
      }
    case 'ALBUM_PAGE':
      return {
        pageType: 'album',
        pageId: action.id
      }
    case 'PLAYLIST_PAGE':
      return {
        pageType: 'playlist',
        pageId: action.id
      }
    case 'SEARCH_PAGE':
      return {
        pageType: 'search',
        pageId: null
      }
    case 'DASHBOARD':
      return {
        pageType: 'dashboard',
        pageId: null
      }
    case 'PANEL_EXPANDED':
      return {
        pageType: 'panelExpanded',
        pageId: null,
        title: action.header,
        array: action.array
      }
    default:
      return state
    }
}

function App() {

  const code = new URLSearchParams(window.location.search).get("code")
  const [store, dispatch] = useReducer(reducer, initialState)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  localStorage.setItem('clientId', 'e39d5b5b499d4088a003eb0471c537bb')
  
  useEffect(() => {
    if (!code) return
    setIsLoggedIn(true)
  }, [code])

  function Page() {
    if (store.pageType === 'dashboard') {
      return <Dashboard dispatch={dispatch} />
    }
    else if (store.pageType === 'artist') {
      return <ArtistPage id={store.pageId} dispatch={dispatch}/>
    }
    else if (store.pageType === 'album') {
      return <AlbumPage id={store.pageId} dispatch={dispatch}/>
    }
    else if (store.pageType === 'playlist') {
     return <PlaylistPage id={store.pageId} dispatch={dispatch} />
    }
    else if (store.pageType === 'search') {
      return <Search dispatch={dispatch} />
    }
    else if (store.pageType === 'panelExpanded') {
      return <PanelExpanded title={store.title} array={store.array} dispatch={dispatch} />
    }
  }

  if (isLoggedIn === true) {
    return (
      <AuthProvider>
       <TrackContextProvider>
        <NavBar dispatch={dispatch} />
        <Page />
        <Player dispatch={dispatch} />
        </TrackContextProvider>
      </AuthProvider>
    )
  }
  else return <Login />



}

export default App;
