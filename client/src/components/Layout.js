import SideBar from './SideBar'
import NavBar from './NavBar'
import WebPlayer from './WebPlayer'
import Menu from './Menu'
import { AuthContext, NotificationContext, SideBarWidthContext  } from '../contexts'
import { useContext, useState, useEffect } from 'react'

export default function Layout({ children }) {
    const accessToken = useContext(AuthContext)
    const { notification } = useContext(NotificationContext)
    const [show, setShow] = useState(false) 
    const [resizing, setResizing] = useState(false)
    const { currentWidth, setCurrentWidth } = useContext(SideBarWidthContext)
    
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
        <div style={(resizing)? {cursor: 'col-resize'}:{}}
             onMouseMove={(e) => {
             e.preventDefault()
             if (resizing && e.pageX >= 215 && e.pageX <= 390) {
               setCurrentWidth(e.pageX)
             }
             else return
             }}
            onMouseUp={(e) => {
                e.preventDefault()
                if (resizing) {
                    setResizing(false)
                }
                else return
            }}>
          <Menu/>

          <div id='navBarContainer' style={{marginLeft: currentWidth, width: window.innerWidth - currentWidth}}>
            <NavBar />
          </div>
          <div id='sideBarContainer' style={{width: currentWidth}}>
            <SideBar />
            <div id='sideBarDrag' 
                style={(resizing)? {background: 'linear-gradient(to right, black 80%, rgb(168, 168, 168) 20%)'}:{}}
                onMouseDown={() => setResizing(true)}/>
          </div>
          <div style={{marginLeft: currentWidth}}>
            {children}
          </div>
          <div className='likedNotification' style={(show)? {opacity: '1'} : {opacity: '0'}}>{notification.text}</div>
          <WebPlayer />
        </div>
    
    :
        <div>
            {children}
        </div>
    
}
