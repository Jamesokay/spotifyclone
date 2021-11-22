export default function Login() {
    
    const AUTHORIZE = 'https://accounts.spotify.com/authorize?client_id=e39d5b5b499d4088a003eb0471c537bb&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-top-read%20user-read-recently-played%20streaming%20user-follow-read%20playlist-modify-private%20playlist-modify-public%20playlist-read-private'

    return (
      <div className='loginPage'>
        <a className='button' href={AUTHORIZE}>Login with Spotify</a>
      </div>
    )
}