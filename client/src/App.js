import './App.css'
import Login from "./Login"
import Dashboard from "./Dashboard"
import ArtistPage from "./ArtistPage"
import AlbumPage from "./AlbumPage"
import PlaylistPage from "./PlaylistPage"
import Search from "./Search"
import PanelExpanded from './PanelExpanded'
import { useReducer, useState, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import axios from 'axios'
import NavBar from './NavBar'
import WebPlayer from './WebPlayer'


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
    case 'LOGOUT': {
      return {
        pageType: 'login',
        pageId: null
      }
    }
    default:
      return state
    }
}

function App() {

  const code = new URLSearchParams(window.location.search).get("code")
  const [store, dispatch] = useReducer(reducer, initialState)
  localStorage.setItem('clientId', 'e39d5b5b499d4088a003eb0471c537bb')

  const [accessToken, setAccessToken] = useState(null)

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
    else if (store.pageType === 'login') {
      return <div />
    }
  }

  if (accessToken) {
    return (
      <AuthContext.Provider value={accessToken}>
        <NavBar dispatch={dispatch} />
        <Page />
        <WebPlayer /> 
      </AuthContext.Provider>
    )
  }
  else return <Login />



}

export default App;
