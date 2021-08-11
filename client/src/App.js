import "bootstrap/dist/css/bootstrap.min.css"
import Login from "./Login"
import Dashboard from "./Dashboard"
import ArtistPage from "./ArtistPage"
import AlbumPage from "./AlbumPage"
import PlaylistPage from "./PlaylistPage"
import Search from "./Search"
import { useReducer } from 'react'

const code = new URLSearchParams(window.location.search).get("code")

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
    default:
      return state
    }
}

function App() {

  const [store, dispatch] = useReducer(reducer, initialState)
  localStorage.setItem('clientId', 'e39d5b5b499d4088a003eb0471c537bb')
 
  if (code) {
    if (store.pageType === 'dashboard') {
      return <Dashboard code={code} dispatch={dispatch} />
    }
    else if (store.pageType === 'artist') {
      return <ArtistPage id={store.pageId} dispatch={dispatch}/>
    }
    else if (store.pageType === 'album') {
      return <AlbumPage id={store.pageId} dispatch={dispatch}/>
    }
    else if (store.pageType === 'playlist') {
     return <PlaylistPage id={store.pageId} dispatch={dispatch}/>
    }
    else if (store.pageType === 'search') {
      return <Search dispatch={dispatch} />
    }
  }
  else return <Login />



}

export default App;
