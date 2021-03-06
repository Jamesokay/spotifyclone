import { useEffect, useState, useCallback, useContext} from 'react'
import { RightClickContext } from '../contexts'

export default function useContextMenu() {
    const [anchorPoint, setAnchorPoint] = useState({x: 0, y: 0})
    const [showMenu, setShowMenu] = useState(false)
    const { setRightClick } = useContext(RightClickContext)


    const handleContextMenu = useCallback(
      (event) => {
        event.preventDefault()
        if (event.target.className.baseVal) {
            if (event.target.className.baseVal.toLowerCase().includes('track')) {
            setAnchorPoint({ x: event.pageX + 5, y: event.pageY + 5})
            setShowMenu(true)  
            }
            else {
                return
            }
        }
        else if (event.target.className.toLowerCase().includes('card') || event.target.className.toLowerCase().includes('track') || event.target.className === 'playlistLi' || event.target.className === 'sideBarPlaylist' || event.target.className === 'sideBarPlaylist sideBarPlaylistActive' || event.target.className === 'playlistTitle') {
            setAnchorPoint({ x: event.pageX + 5, y: event.pageY + 5})
            setShowMenu(true)         
        }
        else {
            return
        }
      },
      [setAnchorPoint]
    )

    const handleClick = useCallback(() => {
      if (showMenu) { 
        setShowMenu(false)
        setRightClick({type: '', id: ''})
      }
      else {
        return
      }
    }, [showMenu, setRightClick])

    useEffect(() => {
      document.addEventListener("click", handleClick)
      document.addEventListener("contextmenu", handleContextMenu)

      return () => {
        document.removeEventListener("click", handleClick)
        document.removeEventListener("contextmenu", handleContextMenu)
      }
    })

    return { anchorPoint, showMenu}
}
