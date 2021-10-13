import SideBar from './SideBar'
import NavBar from './NavBar'
import WebPlayer from './WebPlayer'
import { AuthContext } from './AuthContext'
import { useContext } from 'react'

export default function Layout({ children }) {
    const accessToken = useContext(AuthContext)


    return (accessToken)?
    
        <div>
            <NavBar />
            <SideBar />
            {children}
            <WebPlayer />
        </div>
    
    :
        <div>
            {children}
        </div>
    
}
