import { NavLink } from 'react-router-dom'

export default function Collection() {
    return (
        <div id='dash'>
          <ul id='collectionList'>
              <li className='collectionListItem'>
              <NavLink className='collectionLink' draggable="false" to="/search" activeClassName="collectionActive">
                <span>Playlists</span>
              </NavLink>
              </li>
              <li className='collectionListItem'>
              <NavLink className='collectionLink' draggable="false" to="/search" activeClassName="collectionActive">
                <span>Artists</span>
              </NavLink>
              </li>
              <li className='collectionListItem'>
              <NavLink className='collectionLink' draggable="false" to="/search" activeClassName="collectionActive">
                <span>Albums</span>
              </NavLink>
              </li>
              
          </ul>          
        </div>
    )
}
