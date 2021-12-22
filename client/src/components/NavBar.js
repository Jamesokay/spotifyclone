import { useHistory } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
import { AuthContext, ThemeContext, UserContext, PageContext, TrackContext } from '../contexts'
import defaultUser from '../icons/defaultUser.png'
import { useLocation } from 'react-router-dom'
import playTrack from '../utils/playTrack'
import pauseTrack from '../utils/pauseTrack'


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
    const [adjustedColour, setAdjustedColour] = useState({red: 0, green: 0, blue: 0})
    
    function calculateChange(startNum) {
      var distance = 18 - startNum
      var change = Math.floor(distance * 0.7)
      return startNum + change
    }

    useEffect(() => {
      if (!currentTheme) return
      setAdjustedColour({red: calculateChange(currentTheme.red), 
                         green: calculateChange(currentTheme.green), 
                         blue: calculateChange(currentTheme.blue)})

      return function cleanUp() {
        setAdjustedColour({red: 0, green: 0, blue: 0})
      }
    }, [currentTheme, currentTheme.red, currentTheme.green, currentTheme.blue])
    

    function test() {
      var ypos = ((window.pageYOffset - 160) / 100)
      setAlpha(ypos.toFixed(2))     
    }

    useEffect(() => {
      window.addEventListener("scroll", test)

      return () => {
        window.removeEventListener("scroll", test)
      }
    })


    useEffect(() => {
       if (!user) return
       setName(user.display_name)      
    }, [user])

    useEffect(() => {
      if (alpha < 1) {
        setNavPlayerShow(false)
      }
      else {
      setNavPlayerShow(true)
      }
    }, [alpha])


   



    return (
    
        <div id='navBar' style={{backgroundColor: 'rgba(' + adjustedColour.red + ',' + adjustedColour.green + ',' + adjustedColour.blue + ',' + alpha + ')'}}>

        <div className='navHistory'>
        <div className='navButton' onClick={() => history.goBack()}>
        <svg className='navIconLeft' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline className='goBack' points="15 18 9 12 15 6"></polyline>
        </svg>
        </div>

        <div className='navButton' onClick={() => history.goForward()}>
        <svg className='navIconRight' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline className='goForward' points="9 18 15 12 9 6"></polyline>
        </svg>
        </div>
        </div>
        
      {(location.pathname === '/' || location.pathname === '/search' || location.pathname === '/collection/playlists' || location.pathname === '/collection/albums' || location.pathname === '/collection/tracks')?
      <></>
      :
        <div id='navCurrentPage' style={(alpha >= 2)? {opacity: '1'}:{opacity: '0'}}>
          <div id='navPlayButton'
               style={(navPlayerShow)? {visibility: 'visible'} : {}}
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
          <span id='navCurrentTitle' style={(navPlayerShow)? {visibility: 'visible'} : {}}>{currentPage.pageName}</span>
        </div>
      }

        <div id='user' style={(toggle)? {backgroundColor: '#373737'} : {backgroundColor: '#121212'}}>
            <img id='userImg' src={defaultUser} alt=''></img>
            <span id='userName'>{name}</span>
        <svg className='userToggle'
             style={{marginRight: 'auto'}} xmlns="http://www.w3.org/2000/svg" 
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
            <polyline className='downIcon' points="8 9, 12 14, 16 9, 8 9" />
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
