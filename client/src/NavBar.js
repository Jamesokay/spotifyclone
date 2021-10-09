export default function NavBar({ dispatch }) {
    return (
        <div className='navBar'>
          <ul>
            <li><span onClick={() => dispatch({type: 'DASHBOARD'})}>Home</span></li>
            <li><span onClick={() => dispatch({type: 'SEARCH_PAGE'})}>Search</span></li>
            <li id="logOut"><span onClick={() => dispatch({type: 'LOGOUT'})}>Logout</span></li>
          </ul>
        </div>
    )
}
