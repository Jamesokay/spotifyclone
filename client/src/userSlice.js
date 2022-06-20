import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: {},
    token: ''
  },
  reducers: {
    updateUser: (state, action) => {
      return {
        ...state,
        profile: action.payload.profile,
      }
    },
    updateToken: (state, action) => {
      return {
        ...state,
        token: action.payload.token
      }
    }
  }
})

export const { updateUser, updateToken } = userSlice.actions

export default userSlice.reducer