import { NavLink } from 'react-router-dom'
import likedSongs from '../icons/likedSongs.png'
import { AuthContext, UserContext, SidebarContext, SideBarWidthContext, RightClickContext } from '../contexts'
import { Logo, SearchIcon, CollectionIcon, CreatePlaylistIcon } from '../icons/icons'
import { useContext } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import getDataObject from '../utils/getDataObject'
import { useLocation } from 'react-router-dom'

export default function SideBar() {
    const history = useHistory()
    const accessToken = useContext(AuthContext)
    const user = useContext(UserContext)
    const {userPlaylists, setUserPlaylists} = useContext(SidebarContext)
    const { rightClick, setRightClick } = useContext(RightClickContext)
    const location = useLocation()
    const { currentWidth } = useContext(SideBarWidthContext)

      
    // Function to create new playlist and then navigate to its page
    async function createPlaylist() {
        const options = {
          url: `https://api.spotify.com/v1/users/${user.id}/playlists`,
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              },
          data: {name: 'My Playlist #' + (userPlaylists.length + 1)}
          }
        
        try {
          const response = await axios(options)
          setUserPlaylists(userPlaylists => [...userPlaylists, getDataObject(response.data)])
          let location = {
            pathname: '/playlist/' + response.data.id,
            state: response.data.id
          }
          history.push(location)
        } catch (err) {
          console.error(err)
        }
    }

    return (  
        <div className='sideBar' onContextMenu={(e) => e.preventDefault()}>
          <div id='logoContainer'>
            <Logo />
          </div>
          <ul className='sideBarList'>
            <li>
              <NavLink className='sideBarLink' draggable="false" to="/" exact={true} activeClassName="sideBarActive">
                <svg className='sideBarIcon' viewBox="0 0 512 512" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <path className='homeIcon' d={(location.pathname === '/')? "M 256.274 35.95 L 448.452 149.145 L 448.452 464.395 L 300 464.395 L 300 315.062 L 213.499 315.062 L 213.499 464.395 L 64.095 464.395 L 64.095 150.161 L 256.274 35.95 Z": "M 256.274 60.84 L 84.324 166.237 L 84.324 443.063 L 193.27 443.063 L 193.27 293.73 L 320.228 293.73 L 320.228 443.063 L 428.222 443.063 L 428.222 165.476 L 256.274 60.84 Z M 256.274 35.95 L 448.452 149.145 L 448.452 464.395 L 300 464.395 L 300 315.062 L 213.499 315.062 L 213.499 464.395 L 64.095 464.395 L 64.095 150.161 L 256.274 35.95 Z"} fill="currentColor"></path>
                </svg> 
                <span className='sideBarText'>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink className='sideBarLink' draggable="false" to="/search" activeClassName="sideBarActive">
                <SearchIcon />        
                <span className='sideBarText'>Search</span>
              </NavLink>
            </li>
            <li>
              <NavLink className='sideBarLink' draggable="false" to="/collection/playlists" activeClassName="sideBarActive">
                <CollectionIcon />
                <span className='sideBarText'>Your Library</span>
              </NavLink>
            </li>
            <li className='sideBarLink'/>
            <li className='sideBarLink' onClick={()=> createPlaylist()}>
              <CreatePlaylistIcon />
              <span className='sideBarText'>Create Playlist</span>
            </li>
            <li>
             <NavLink className='sideBarLink' draggable="false" to="/collection/tracks" activeClassName="sideBarPlaylistActive">
               <img className='sideBarImg' src={likedSongs} alt=''/>
               <span className='sideBarText'>Liked Songs</span>
             </NavLink>
            </li>
          </ul>
          <hr className='sideBarDivider' style={{width: currentWidth - 50}}/>    
          <ul className='sideBarList' style={{overflowY: 'scroll'}}>
          {userPlaylists.map(playlist => 
            <li key={playlist.key} className='playlistLi' onContextMenu={(e) => setRightClick({type: playlist.type, yPos: e.screenY, xPos: e.screenX, id: playlist.id})}>
              <NavLink className='sideBarPlaylist' draggable="false" to={{pathname: `/playlist/${playlist.id}`, state: playlist.id }} activeClassName="sideBarPlaylistActive" onContextMenu={(e) => setRightClick({type: playlist.type, yPos: e.screenY, xPos: e.screenX, id: playlist.id})}>
                <span className='playlistTitle' style={(rightClick.id === playlist.id)? {color: 'white'} : {}}>{playlist.name}</span>
              </NavLink>
            </li>
          )}
        </ul>    
      </div>
    )
}
