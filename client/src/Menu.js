import { useContext } from 'react'
import useContextMenu from './useContextMenu'
import { RightClickContext } from './RightClickContext'

export default function Menu() {
    const { rightClick } = useContext(RightClickContext)
    const { anchorPoint, showMenu } = useContextMenu()
    
    if (showMenu && rightClick.type === 'playlist') {
      return (
         <div className='contextMenuDash' style={{top: anchorPoint.y, left: anchorPoint.x}}>
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
        <div className='contextMenuDash' style={{top: anchorPoint.y, left: anchorPoint.x}}>
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
        <div className='contextMenuDash' style={{top: anchorPoint.y, left: anchorPoint.x}}>
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
          <div className='contextMenuDash' style={{top: anchorPoint.y, left: anchorPoint.x}}>
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
