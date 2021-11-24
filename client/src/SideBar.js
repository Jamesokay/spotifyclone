import { NavLink } from 'react-router-dom'
import likedSongs from './likedSongs.png'
import { AuthContext } from './AuthContext'
import { UserContext } from './UserContext'
import { useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { SidebarContext } from './SidebarContext'
import getDataObject from './getDataObject'

export default function SideBar() {
    const history = useHistory()
    const accessToken = useContext(AuthContext)
    const user = useContext(UserContext)
    const {userPlaylists, setUserPlaylists} = useContext(SidebarContext)
    const [anchorPoint, setAnchorPoint] = useState({x: 0, y: 0})
    const [showMenu, setShowMenu] = useState(false)
    const [rightClicked, setRightClicked] = useState('')
    const [scrolled, setScrolled] = useState(0)

    // function handleContextMenu(pageX, pageY, id) {
    //     setRightClicked(id)
    //     setAnchorPoint({ x: pageX, y: pageY })
    //     setShowMenu(true)
    //   }
    
    // document.addEventListener('click', (event) => {
    //   event.preventDefault()
    //   if (showMenu) {
    //     setShowMenu(false)
    //     setRightClicked('')
    //   }
    // })

    const handleContextMenu = useCallback(
      (event) => {
        event.preventDefault();
        if (event.target.className === 'playlistLi' || event.target.className === 'sideBarPlaylist' || event.target.className === 'sideBarPlaylist sideBarPlaylistActive' || event.target.className === 'playlistTitle') {
          console.log('callback')
          setAnchorPoint({ x: event.pageX, y: event.pageY - scrolled});
          setShowMenu(true);
        }
        else return
      },
      [setAnchorPoint, scrolled]
    );
  
    const handleClick = useCallback(() => {
      if (showMenu) { 
        setRightClicked('')
        setShowMenu(false)
       }
      else {
         return
      }
    }, [showMenu]);
  
    useEffect(() => {
      document.addEventListener("click", handleClick);
      document.addEventListener("contextmenu", handleContextMenu);
      window.addEventListener('scroll', getScrollDistance)
      return () => {
        document.removeEventListener("click", handleClick);
        document.removeEventListener("contextmenu", handleContextMenu);
        window.removeEventListener('scroll', getScrollDistance)
      };
    });

    function getScrollDistance() {
      setScrolled(window.pageYOffset)
    }
      
    
    function createPlaylist() {
        let data = {
          name: 'My Playlist #' + (userPlaylists.length + 1)
        }

        const options = {
          url: `https://api.spotify.com/v1/users/${user.id}/playlists`,
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              },
          data
          }
      
        axios(options)
        .then(response => {
           setUserPlaylists(userPlaylists => [...userPlaylists, getDataObject(response.data)])
           let location = {
            pathname: '/playlist/' + response.data.id,
            state: response.data.id
          }
           history.push(location)
        })
        .catch(error => {
          console.log(error)
        })
    }

    return (
        <div className='sideBar' onContextMenu={(e) => e.preventDefault()}>
        <ul id='sideBarList'>
          <li>
          <NavLink className='sideBarLink' draggable="false" to="/" exact={true} activeClassName="sideBarActive">
          <svg className='sideBarIcon' viewBox="0 0 512 512" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M 256.274 60.84 L 84.324 166.237 L 84.324 443.063 L 193.27 443.063 L 193.27 293.73 L 320.228 293.73 L 320.228 443.063 L 428.222 443.063 L 428.222 165.476 L 256.274 60.84 Z M 256.274 35.95 L 448.452 149.145 L 448.452 464.395 L 300 464.395 L 300 315.062 L 213.499 315.062 L 213.499 464.395 L 64.095 464.395 L 64.095 150.161 L 256.274 35.95 Z" fill="currentColor"></path>
        </svg> 
          <span className='sideBarText'>Home</span>
          </NavLink>
          </li>
          <li>
          <NavLink className='sideBarLink' draggable="false" to="/search" activeClassName="sideBarActive">
          <svg className='sideBarIcon' viewBox="0 0 512 512" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M349.714 347.937l93.714 109.969-16.254 13.969-93.969-109.969q-48.508 36.825-109.207 36.825-36.826 0-70.476-14.349t-57.905-38.603-38.603-57.905-14.349-70.476 14.349-70.476 38.603-57.905 57.905-38.603 70.476-14.349 70.476 14.349 57.905 38.603 38.603 57.905 14.349 70.476q0 37.841-14.73 71.619t-40.889 58.921zM224 377.397q43.428 0 80.254-21.461t58.286-58.286 21.461-80.254-21.461-80.254-58.286-58.285-80.254-21.46-80.254 21.46-58.285 58.285-21.46 80.254 21.46 80.254 58.285 58.286 80.254 21.461z" fill="currentColor"></path>
        </svg>          
         <span className='sideBarText'>Search</span>
         </NavLink>
         </li>
         <li>
         <NavLink className='sideBarLink' draggable="false" to="/collection/playlists" activeClassName="sideBarActive">
         <svg className='sideBarIcon' viewBox="0 0 512 512" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M291.301 81.778l166.349 373.587-19.301 8.635-166.349-373.587zM64 463.746v-384h21.334v384h-21.334zM192 463.746v-384h21.334v384h-21.334z" fill="currentColor"></path>
        </svg>
           <span className='sideBarText'>Your Library</span>
          </NavLink>
         </li>
         <li>
           <div style={{height: '3vh'}}></div>
         </li>

         <li className='sideBarLink' onClick={()=> createPlaylist()}>
           {/* <div className='sideBarImg' style={{backgroundColor: 'white'}}></div> */}
           <svg className='sideBarImg' viewBox="0 0 24 24" width="24" height="24" style={{borderRadius: '2px'}} xmlns="http://www.w3.org/2000/svg">
           <rect width='24' height='24' fill='white'></rect>
            <path d="M7 12, L17 12, M12 7, L12 17 " stroke="black" fill='none' strokeWidth='2'></path>
            
           </svg>
           <span className='sideBarText'>Create Playlist</span>
         </li>

         <li>
         <NavLink className='sideBarLink' draggable="false" to="/collection/tracks" activeClassName="sideBarPlaylistActive">
           <img className='sideBarImg' src={likedSongs} alt=''/>
           <span className='sideBarText'>Liked Songs</span>
         </NavLink>
         </li>
         {(showMenu)?
          <div className='contextMenuSB' style={{top: anchorPoint.y, left: anchorPoint.x}}>
            <ul className='contextMenuOptions'>
              <li className='contextMenuOpt'>Add to queue</li>
              <li className='contextMenuOpt'>Go to playlist radio</li>
              <hr className='contextMenuDivider'/>
              <li className='contextMenuOpt'>Add to profile</li>
              <hr className='contextMenuDivider'/>
              <li className='contextMenuOpt'>Remove from your library</li>
              <li className='contextMenuOpt'>Create playlist</li>
              <li className='contextMenuOpt'>Create folder</li>
              <hr className='contextMenuDivider'/>
              <li className='contextMenuOpt'>Share</li>
            </ul>
          </div>
          :
          <></>
          }
    
         <hr style={{width: '80%', float: 'left', border: 'none', backgroundColor: '#212121', height: '0.5px', marginLeft: '15px', marginBottom: '20px'}}/>    
         {userPlaylists.map(playlist => 
         <li key={playlist.key} className='playlistLi' onContextMenu={() => setRightClicked(playlist.id)}>
          <NavLink className='sideBarPlaylist' draggable="false" to={{pathname: `/playlist/${playlist.id}`, state: playlist.id }} activeClassName="sideBarPlaylistActive" onContextMenu={() => setRightClicked(playlist.id)}>
           <span className='playlistTitle' style={(rightClicked === playlist.id)? {color: 'white'} : {}}>{playlist.name}</span>
          </NavLink>
          </li>
         )}
        </ul>
        
            
        </div>
    )
}
