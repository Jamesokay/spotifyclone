import { useEffect, useState, useContext } from 'react'
import { TrackContext } from '../contexts'
import axios from 'axios'
import unlike from '../utils/unlike'
import like from '../utils/like'
import playTrack from '../utils/playTrack'
import pauseTrack from '../utils/pauseTrack'
import { useDispatch, useSelector } from 'react-redux'
import { updateSidebarPlaylists, updateNotification } from '../pageSlice'

export default function HeaderControls({URL, contextUri, contextId, isOwner, playlistObj, isEmpty, type}) {
    const accessToken = useSelector(state => state.user.token)
    const { nowPlaying } = useContext(TrackContext)
    const [liked, setLiked] = useState(false)
    const dispatch = useDispatch()
    const sidebarPlaylists = useSelector(state => state.page.sidebarPlaylists)

    function likePlaylist() {
        like(accessToken, `https://api.spotify.com/v1/playlists/${contextId}/followers`)
        dispatch(updateSidebarPlaylists({ sidebarPlaylists: [...sidebarPlaylists, playlistObj] }))
        setLiked(true)
        dispatch(updateNotification({notification: 'Added to Your Library'}))
    }

    function unlikePlaylist() {
        unlike(accessToken, `https://api.spotify.com/v1/playlists/${contextId}/followers`) 
        dispatch(updateSidebarPlaylists({ sidebarPlaylists: sidebarPlaylists.filter(item => item.id !== contextId)}))       
        setLiked(false)
        dispatch(updateNotification({notification: 'Removed from Your Library'}))
    }

    function likeAlbum() {
        like(accessToken, `https://api.spotify.com/v1/me/albums?ids=${contextId}`)
        setLiked(true)
        dispatch(updateNotification({notification: 'Added to Your Library'}))
    }

    function unlikeAlbum() {
        unlike(accessToken, `https://api.spotify.com/v1/me/albums?ids=${contextId}`)
        setLiked(false)
        dispatch(updateNotification({notification: 'Removed from Your Library'}))
    }

    useEffect(() => {
        if (!accessToken) return
        if (isOwner) return
        if(!URL) return

        const options = {
            url: URL,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        }

        axios(options)
        .then(response => {
          setLiked(response.data[0])
        })
        .catch(error => {
          console.log(error)
        })

        return function cleanUp() {
            setLiked(false)
        }

    }, [contextId, URL, accessToken, isOwner])


    return isEmpty? <div id='headerControls'></div> : (
        <div id='headerControls'>
        <div className='headerPlayButton'
             style={(type === 'ARTIST')? {transform: 'scale(1.15)'} : {}}
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
        {(type === 'ARTIST')?
        <div className='followButton' style={(liked)? {borderColor: 'white'}:{}}>
            {(liked)?
            <span>FOLLOWING</span>
            :
            <span>FOLLOW</span>
            }
        </div>
        :
        <svg style={(isOwner)? {visibility: 'hidden'} : {visibility: 'visible'}}
               className={(liked)?'headerLiked':'headerLike'} viewBox="0 0 32 32" stroke="white" 
               onClick={() => {
                   if (playlistObj && liked) {
                       unlikePlaylist()
                   }
                   else if (playlistObj && !liked) {
                       likePlaylist()
                   }
                   else if (!playlistObj && liked) {
                       unlikeAlbum()
                   }
                   else if (!playlistObj && !liked) {
                       likeAlbum()
                   }                  
                }}>
            <path className='headerHeartIcon' d="M27.672 5.573a7.904 7.904 0 00-10.697-.489c-.004.003-.425.35-.975.35-.564 0-.965-.341-.979-.354a7.904 7.904 0 00-10.693.493A7.896 7.896 0 002 11.192c0 2.123.827 4.118 2.301 5.59l9.266 10.848a3.196 3.196 0 004.866 0l9.239-10.819A7.892 7.892 0 0030 11.192a7.896 7.896 0 00-2.328-5.619z"></path>
          </svg>
        }
        </div>
    )
}
