import { useEffect, useState, useContext } from 'react'
import { AuthContext } from './AuthContext'
import { SidebarContext } from './SidebarContext'
import { TrackContext } from './TrackContext'
import { UserContext } from './UserContext'
import { NotificationContext } from './NotificationContext'
import axios from 'axios'
import unlike from './unlike'
import like from './like'
import playTrack from './playTrack'
import pauseTrack from './pauseTrack'

export default function HeaderControls({contextUri, contextId, isOwner, playlistObj}) {
    const accessToken = useContext(AuthContext)
    const { nowPlaying } = useContext(TrackContext)
    const {setUserPlaylists} = useContext(SidebarContext)
    const { setNotification } = useContext(NotificationContext)
    const user = useContext(UserContext)
    const [liked, setLiked] = useState(false)

    useEffect(() => {
        if (!accessToken) return

        const options = {
            url: `https://api.spotify.com/v1/playlists/${contextId}/followers/contains?ids=${user.id}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        }

        axios(options)
        .then(response => {
          console.log(response.data)
          setLiked(response.data[0])
        })
        .catch(error => {
          console.log(error)
        })

        return function cleanUp() {
            setLiked(false)
        }

    }, [contextId, user.id, accessToken])


    return (
        <div id='headerControls'> 
        <div className='headerPlayButton'
             onClick={(e) => {
                e.preventDefault()
                 if (contextUri === nowPlaying.contextUri && !nowPlaying.isPaused) {
                     pauseTrack(accessToken)
                 }
                 else if (contextUri === nowPlaying.contextUri && nowPlaying.isPaused) {
                     playTrack(accessToken)
                 }
                 else {
                 playTrack(accessToken, {context_uri: contextUri})} 
                }
               }>
            <div className={(!nowPlaying.isPaused && contextUri === nowPlaying.contextUri)?'headerPauseIcon': 'headerPlayIcon'}></div>   
        </div>
        {(isOwner)?
        <div/>
        :
        <svg className={(liked)?'headerLiked':'headerLike'} viewBox="0 0 32 32" stroke="white" 
               onClick={() => {
                   if (liked) {
                       unlike(accessToken, `https://api.spotify.com/v1/playlists/${contextId}/followers`) 
                       setUserPlaylists(userPlaylists => userPlaylists.filter(item => item.id !== contextId))                    
                       setLiked(false)
                       setNotification({text: 'Removed from Your Library',
                                        action: 'unlike' + contextId})
                   }
                   else {
                       like(accessToken, `https://api.spotify.com/v1/playlists/${contextId}/followers`)
                       setUserPlaylists(userPlaylists => [...userPlaylists, playlistObj])
                       setLiked(true)
                       setNotification({text: 'Added to Your Library',
                                        action: 'like' + contextId})
                   }
                   
                }}>
            <path className='headerHeartIcon' d="M27.672 5.573a7.904 7.904 0 00-10.697-.489c-.004.003-.425.35-.975.35-.564 0-.965-.341-.979-.354a7.904 7.904 0 00-10.693.493A7.896 7.896 0 002 11.192c0 2.123.827 4.118 2.301 5.59l9.266 10.848a3.196 3.196 0 004.866 0l9.239-10.819A7.892 7.892 0 0030 11.192a7.896 7.896 0 00-2.328-5.619z"></path>
          </svg> 
        }
      </div>  
    )
}
