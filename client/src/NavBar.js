import { useHistory } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
import { ThemeContext } from './ThemeContext'
import { UserContext } from './UserContext'
import { PageContext } from './PageContext'
import defaultUser from './defaultUser.png'
import { useLocation } from 'react-router-dom'


export default function NavBar() {
    const history = useHistory()
    const [alpha, setAlpha] = useState(0)
    const { currentTheme } = useContext(ThemeContext)
    const user = useContext(UserContext)
    const { currentPage } = useContext(PageContext)
    const [name, setName] = useState('')
    const location = useLocation()
    const [navPlayer, setNavPlayer] = useState(false)

    useEffect(() => {
      if (location.pathname === '/') {
        setNavPlayer(false)
      }
      else {
        setNavPlayer(true)
      }

    }, [location])

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
        
        {(navPlayer)?
        <div id='navCurrentPage' style={(alpha >= 2.5)? {opacity: '1'}:{opacity: '0'}}>
          <div id='navPlayButton'>
            <div id='navPlayIcon'></div>
          </div>
          <span id='navCurrentTitle'>{currentPage}</span>
        </div>
        :
        <div></div>
        }

        <div id='user'>
            <img id='userImg' src={defaultUser} alt=''></img>
            <span id='userName'>{name}</span>
            <svg style={{marginRight: 'auto'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter">
            <polyline points="8 9, 12 14, 16 9, 8 9" />
        </svg>
        </div>
        </div>
      
    )
}
