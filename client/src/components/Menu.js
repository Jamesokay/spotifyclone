import { useContext, useEffect, useState } from 'react'
import useContextMenu from '../hooks/useContextMenu'
import { RightClickContext } from '../contexts'

export default function Menu() {
    const { rightClick } = useContext(RightClickContext)
    const { anchorPoint, showMenu } = useContextMenu()
    const [scrolled, setScrolled] = useState(0)
    const [menuXY, setMenuXY] = useState()
    
    // Keep track of scroll distance in order to adjust y co-ordinate of context menu
    function handleScroll() {
      setScrolled(window.pageYOffset)
    }

    useEffect (() => {
      window.addEventListener("scroll", handleScroll)

      return () => {
        window.removeEventListener("scroll", handleScroll)
      }
    }, [])

    
    // Condition to check whether context menu will overflow viewport
    // then translating X, Y or both accordingly, keep menu within viewport boundaries
    useEffect(() => {
      if (anchorPoint.y + (window.innerHeight * 0.3) > window.innerHeight + scrolled && anchorPoint.x + (window.innerWidth * 0.15) > window.innerWidth) {
        setMenuXY({top: anchorPoint.y, left: anchorPoint.x, transform: 'translateX(-105%) translateY(-105%)'})
      }
      else if (anchorPoint.y + (window.innerHeight * 0.3) > window.innerHeight + scrolled) {
        setMenuXY({top: anchorPoint.y, left: anchorPoint.x, transform: 'translateY(-105%)'})
      }
      else if (anchorPoint.x + (window.innerWidth * 0.15) > window.innerWidth) {
        setMenuXY({top: anchorPoint.y, left: anchorPoint.x, transform: 'translateX(-105%)'})
      }
      else setMenuXY({top: anchorPoint.y, left: anchorPoint.x})

    }, [anchorPoint.y, anchorPoint.x, scrolled])
    
  
    if (showMenu && rightClick.type === 'playlist') {
      return (
         <div className='contextMenuDash' style={menuXY}>
            <ul className='contextMenuOptions'>
              <li className='contextMenuOpt'>Add to queue</li>
              <li className='contextMenuOpt'>Go to playlist radio</li>
              <hr className='contextMenuDivider'/>
              <li className='contextMenuOpt'>Add to Your Library</li>
              <li className='contextMenuOpt'>Add to playlist</li>
              <hr className='contextMenuDivider'/>
              <li className='contextMenuOpt'>Share</li>
            </ul>
          </div>
       )
    }
    else if (showMenu && rightClick.type === 'artist') {
      return (
        <div className='contextMenuDash' style={menuXY}>
          <ul className='contextMenuOptions'>
            <li className='contextMenuOpt'>Follow</li>
            <li className='contextMenuOpt'>Go to artist radio</li>
            <li className='contextMenuOpt'>Share</li>
          </ul>
      </div>
      )
    }
    else if (showMenu && rightClick.type === 'album') {
      return (
        <div className='contextMenuDash' style={menuXY}>
          <ul className='contextMenuOptions'>
            <li className='contextMenuOpt'>Add to queue</li>
            <li className='contextMenuOpt'>Go to artist radio</li>
            <hr className='contextMenuDivider'/>
            <li className='contextMenuOpt'>Add to Your Library</li>
            <li className='contextMenuOpt'>Add to playlist</li>
            <hr className='contextMenuDivider'/>
            <li className='contextMenuOpt'>Share</li>
          </ul>
        </div>
      )
    }
    else if (showMenu && rightClick.type === 'track') {
        return (
          <div className='contextMenuDash' style={menuXY}>
            <ul className='contextMenuOptions'>
              <li className='contextMenuOpt'>Add to queue</li>
              <hr className='contextMenuDivider'/>
              <li className='contextMenuOpt'>Go to song radio</li>
              <li className='contextMenuOpt'>Go to artist</li>
              <li className='contextMenuOpt'>Go to album</li>
              <li className='contextMenuOpt'>Show credits</li>
              <hr className='contextMenuDivider'/>
              <li className='contextMenuOpt'>Save to your Liked Songs</li>
              <li className='contextMenuOpt'>Add to playlist</li>
              <hr className='contextMenuDivider'/>
              <li className='contextMenuOpt'>Share</li>
            </ul>
          </div>
        )
    }
    else return null
}
