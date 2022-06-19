import SideBar from './SideBar'
import NavBar from './NavBar'
import WebPlayer from './WebPlayer'
import Menu from './Menu'
import { AuthContext } from '../contexts'
import { useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useViewport from '../hooks/useViewPort'
import { useSelector, useDispatch } from 'react-redux'
import { updateSidebarWidth } from '../pageSlice'


export default function Layout({ children }) {
    const accessToken = useContext(AuthContext)
    const [show, setShow] = useState(false) 
    const [resizing, setResizing] = useState(false)
    const { width } = useViewport() 
    const location = useLocation()
    const dispatch = useDispatch()
    const sidebarWidth = useSelector(state => state.page.sidebarWidth)
    const notification = useSelector(state => state.page.notification)

    const resizeSidebar = (newWidth) => {
      dispatch(updateSidebarWidth({sidebarWidth: newWidth}))
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location])
    
    useEffect(() => {
        if (!notification) return
        setShow(true)
        const notify = setTimeout(() => { 
            setShow(false) }, 3000)
        return () => {
            setShow(false)
            clearTimeout(notify)}
    }, [notification])


    return (accessToken)?
        <div style={(resizing)? {cursor: 'col-resize'}:{}}
             onMouseMove={(e) => {
             e.preventDefault()
             if (resizing && e.pageX >= 215 && e.pageX <= 390) {
               resizeSidebar(e.pageX)
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

          <div id='navBarContainer' style={{marginLeft: sidebarWidth, width: window.innerWidth - sidebarWidth}}>
            <NavBar />
          </div>
          <div id='sideBarContainer' style={{width: sidebarWidth}}>
            <SideBar />
            <div id='sideBarDrag' 
                style={(resizing)? {background: 'linear-gradient(to right, black 80%, rgb(168, 168, 168) 20%)'}:{}}
                onMouseDown={() => setResizing(true)}/>
          </div>
          <div style={{marginLeft: sidebarWidth, width: width - sidebarWidth}}>
            {children}
          </div>
          <div className='likedNotification' style={(show)? {opacity: '1'} : {opacity: '0'}}>{notification}</div>
          <WebPlayer />
        </div>
    
    :
        <div>
            {children}
        </div>
    
}
