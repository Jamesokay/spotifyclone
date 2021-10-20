import { useHistory } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
import { ThemeContext } from './ThemeContext'

export default function NavBar() {
    const history = useHistory()
    const [alpha, setAlpha] = useState(0)
    const { currentTheme } = useContext(ThemeContext)

    useEffect(() => {
        console.log('rgba(' + currentTheme + ', ' + alpha + ')')
    }, [currentTheme, alpha])



    

    function test() {
        var ypos = (window.pageYOffset / 100)
        setAlpha(ypos.toFixed(2))
      }
  
      window.addEventListener('scroll', test)


    return (
        <div className='navBar' style={{backgroundColor: 'rgba(' + currentTheme + ', ' + alpha + ')'}}>

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

        </div>
    )
}
