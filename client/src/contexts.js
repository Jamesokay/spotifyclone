import { createContext } from 'react'

export const AuthContext = createContext(null)

export const NotificationContext = createContext({
    notification:  {text: '',
                    action: ''},
    setNotification: () => { }
})

export const PageContext = createContext({
    currentPage: {pageName: '',
                  pageUri: ''},
    setCurrentPage: () => { }
})

export const PlaylistContext = createContext({
    newTrack: {},
    setNewTrack: () => { }
})

export const RightClickContext = createContext({
    rightClick: {type: '',
                 yPos: 0,
                 xPos: 0,
                 id: ''},
    setRightClick: () => { }
})

export const SidebarContext = createContext({
    userPlaylists: [],
    setUserPlaylists: () => { }
})

export const SideBarWidthContext = createContext({
    currentWidth: window.innerWidth * 0.15,
    setCurrentWidth: () => { }
})

export const ThemeContext = createContext({
    currentTheme: {red: 0, 
                   green: 0, 
                   blue: 0},
    setCurrentTheme: () => { }
})

export const TrackContext = createContext({
    nowPlaying: {contextUri: '',
                 trackUri: '',
                 trackName: '',
                 isPaused: false},
    setNowPlaying: () => { }
})

export const UserContext = createContext(null)