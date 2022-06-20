import { configureStore } from '@reduxjs/toolkit'
import pageReducer from './pageSlice'
import userReducer from './userSlice'

export const store = configureStore({
    reducer: {
        page: pageReducer,
        user: userReducer
    }
})