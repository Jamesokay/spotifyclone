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
        if (!notification.action) return
        setShow(true)
        const notify = setTimeout(() => { 
            setShow(false) }, 3000)
        return () => {
            setShow(false)
            clearTimeout(notify)}
    }, [notification.action])


    return (accessToken)?
    
        <div>
            <NavBar />
            <SideBar />
            {children}
            <div className='likedNotification' style={(show)? {opacity: '1'} : {opacity: '0'}}>{notification.text}</div>
            <WebPlayer />
        </div>
    
    :
        <div>
            {children}
        </div>
    
}
