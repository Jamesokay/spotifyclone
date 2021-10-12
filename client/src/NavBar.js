import { useHistory } from 'react-router-dom'

export default function NavBar() {
    const history = useHistory()


    return (
        <div className='navBar'>

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
