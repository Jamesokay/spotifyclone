import { createSlice } from '@reduxjs/toolkit'

export const pageSlice = createSlice({
  name: 'page',
  initialState: {
    name: '',
    uri: '',
    theme: { red: '', green: '', blue: ''},
    notification: '',
    sidebarPlaylists: [],
    sidebarWidth: window.innerWidth * 0.15
  },
  reducers: {
    updatePage: (state, action) => {
      return {
        ...state,
        name: action.payload.name,
        uri: action.payload.uri
      }
    },
    updateNotification: (state, action) => {
      return {
        ...state,
        notification: action.payload.notification
      }
    },
    updateSidebarPlaylists: (state, action) => {
      return {
        ...state,
        sidebarPlaylists: action.payload.sidebarPlaylists
      }
    },
    updateSidebarWidth: (state, action) => {
      return {
        ...state,
        sidebarWidth: action.payload.sidebarWidth
      }

    },
    updateTheme: (state, action) => {
      return {
        ...state,
        theme: {red: action.payload.red, green: action.payload.green, blue: action.payload.blue}
      }
    }
  }
})

export const { updatePage, updateNotification, updateSidebarPlaylists, updateSidebarWidth, updateTheme } = pageSlice.actions

export default pageSlice.reducer