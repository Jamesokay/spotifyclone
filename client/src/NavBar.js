import { useHistory } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import { ThemeContext } from './ThemeContext'
import { UserContext } from './UserContext'
import { PageContext } from './PageContext'
import { TrackContext } from './TrackContext'
import defaultUser from './defaultUser.png'
import { useLocation } from 'react-router-dom'
import playTrack from './playTrack'
import pauseTrack from './pauseTrack'


export default function NavBar() {
    const history = useHistory()
    const [alpha, setAlpha] = useState(0)
    const { currentTheme } = useContext(ThemeContext)
    const user = useContext(UserContext)
    const accessToken = useContext(AuthContext)
    const { currentPage } = useContext(PageContext)
    const { nowPlaying } = useContext(TrackContext)
    const [name, setName] = useState('')
    const [navPlayerShow, setNavPlayerShow] = useState(false)
    const location = useLocation()
    const [toggle, setToggle] = useState(false)

    
    useEffect(() => {
      if (location.pathname === '/' || location.pathname === '/search') {
        setNavPlayerShow(false)
      }
      else {
        setNavPlayerShow(true)
      }
    }, [location, setNavPlayerShow])

    useEffect(() => {
       if (!user) return
       setName(user.display_name)      
    }, [user])

    function test() {
        var ypos = (window.pageYOffset / 100)
        setAlpha(ypos.toFixed(2))     
    }
  
    window.addEventListener('scroll', test)



    return (
    
        <div id='navBar' style={{backgroundColor: 'rgba(' + currentTheme + ', ' + alpha + ')'}}>

        <div className='navHistory'>
        <div className='navButton' onClick={() => history.goBack()}>
        <svg className='navIconLeft' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        </div>

        <div className='navButton' onClick={() => history.goForward()}>
        <svg className='navIconRight' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6">
            </polyline>
        </svg>
        </div>
        </div>
        
        {(navPlayerShow)?
        <div id='navCurrentPage' style={(alpha >= 2.5)? {opacity: '1'}:{opacity: '0'}}>
          <div id='navPlayButton'
               onClick={(e) => {
                e.preventDefault()
                 if (currentPage.pageUri === nowPlaying.contextUri && !nowPlaying.isPaused) {
                     pauseTrack(accessToken)
                 }
                 else if (currentPage.pageUri === nowPlaying.contextUri && nowPlaying.isPaused) {
                     playTrack(accessToken)
                 }
                 else {
                 playTrack(accessToken, {context_uri: currentPage.pageUri})} 
                }
               }>
            <div className={(!nowPlaying.isPaused && currentPage.pageUri === nowPlaying.contextUri)? 'navPauseIcon' : 'navPlayIcon'}></div>
          </div>
          <span id='navCurrentTitle'>{currentPage.pageName}</span>
        </div>
        :
        <div></div>
        }

        <div id='user' style={(toggle)? {backgroundColor: '#373737'} : {backgroundColor: '#121212'}}>
            <img id='userImg' src={defaultUser} alt=''></img>
            <span id='userName'>{name}</span>
        <svg style={{marginRight: 'auto'}} xmlns="http://www.w3.org/2000/svg" 
             width="24" height="24" 
             viewBox="0 0 24 24" 
             fill="white" 
             stroke="white" 
             strokeWidth="1" 
             strokeLinecap="square" 
             strokeLinejoin="miter"
             onClick={() => {
               if (toggle) {
                 setToggle(false)
               }
               else {
                 setToggle(true)
               }
             }}>
            <polyline points="8 9, 12 14, 16 9, 8 9" />
        </svg>
        </div>
        <div id='userMenu' style={(toggle)? {visibility: 'visible'} : {visibility: 'hidden'}}>
         
          <ul id='userMenuOptions'>
            <li className='userMenuOpt'>Account</li>
            <li className='userMenuOpt'>Profile</li>
            <a id='logOut' href='https://www.spotify.com/logout/'>
            <li className='userMenuOpt'>Log Out</li>
            </a>
          </ul>
          
        </div>
        </div>
      
    )
}
