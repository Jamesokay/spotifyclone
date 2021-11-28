import SideBar from './SideBar'
import NavBar from './NavBar'
import WebPlayer from './WebPlayer'
import { AuthContext } from './AuthContext'
import { NotificationContext } from './NotificationContext'
import { useContext, useState, useEffect } from 'react'

export default function Layout({ children }) {
    const accessToken = useContext(AuthContext)
    const { notification } = useContext(NotificationContext)
    const [show, setShow] = useState(false) 

    useEffect(() => {
        if (!notification) return
        setShow(true)
        setTimeout(function() { setShow(false) }, 3000)
    }, [notification])


    return (accessToken)?
    
        <div>
            <NavBar />
            <SideBar />
            {children}
            <div className='likedNotification' style={(show)? {opacity: '1'} : {opacity: '0'}}>{notification}</div>
            <WebPlayer />
        </div>
    
    :
        <div>
            {children}
        </div>
    
}
