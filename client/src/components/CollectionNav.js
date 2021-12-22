import { NavLink } from 'react-router-dom'

export default function CollectionNav() {
    return (
        <div>
         <ul id='collectionList'>
              <li className='collectionListItem'>
              <NavLink className='collectionLink' draggable="false" to="/collection/playlists" activeClassName="collectionActive">
                <span>Playlists</span>
              </NavLink>
              </li>
              <li className='collectionListItem'>
              <NavLink className='collectionLink' draggable="false" to="/collection/artists" activeClassName="collectionActive">
                <span>Artists</span>
              </NavLink>
              </li>
              <li className='collectionListItem'>
              <NavLink className='collectionLink' draggable="false" to="/collection/albums" activeClassName="collectionActive">
                <span>Albums</span>
              </NavLink>
              </li>
              
          </ul>   
        </div>
    )
}
