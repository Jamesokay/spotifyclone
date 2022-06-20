import { useHistory } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
import { TrackContext } from '../contexts'
import defaultUser from '../icons/defaultUser.png'
import { useLocation } from 'react-router-dom'
import playTrack from '../utils/playTrack'
import pauseTrack from '../utils/pauseTrack'
import { useSelector } from 'react-redux'

export default function NavBar() {
    const history = useHistory()
    const [alpha, setAlpha] = useState(0)
    const user = useSelector(state => state.user.profile)
    const accessToken = useSelector(state => state.user.token)
    const { nowPlaying } = useContext(TrackContext)
    const [navPlayerShow, setNavPlayerShow] = useState(false)
    const location = useLocation()
    const [toggle, setToggle] = useState(false)
    const [adjustedColour, setAdjustedColour] = useState({red: 0, green: 0, blue: 0})
    const theme = useSelector(state => state.page.theme)
    const page = useSelector(state => state.page.name)
    const uri = useSelector(state => state.page.uri)
    
    function calculateChange(startNum) {
      var distance = 18 - startNum
      var change = Math.floor(distance * 0.625)
      return startNum + change
    }

    useEffect(() => {
      setAdjustedColour({red: calculateChange(theme.red), 
                         green: calculateChange(theme.green), 
                         blue: calculateChange(theme.blue)})

      return function cleanUp() {
        setAdjustedColour({red: 0, green: 0, blue: 0})
      }
    }, [theme.red, theme.green, theme.blue])
    

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
                 if (uri === nowPlaying.contextUri && !nowPlaying.isPaused) {
                     pauseTrack(accessToken)
                 }
                 else if (uri === nowPlaying.contextUri && nowPlaying.isPaused) {
                     playTrack(accessToken)
                 }
                 else {
                 playTrack(accessToken, {context_uri: uri})} 
                }
               }>
            <div className={(!nowPlaying.isPaused && uri === nowPlaying.contextUri)? 'navPauseIcon' : 'navPlayIcon'}></div>
          </div>
          <span id='navCurrentTitle' style={(navPlayerShow)? {visibility: 'visible'} : {}}>{page}</span>
        </div>
      }

        <div id='user' style={(toggle)? {backgroundColor: '#373737'} : {backgroundColor: '#121212'}}>
            <img id='userImg' src={defaultUser} alt=''></img>
            <span id='userName'>{user.display_name? user.display_name : ''}</span>
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
