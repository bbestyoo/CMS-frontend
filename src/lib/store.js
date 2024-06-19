import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./user/userSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
        user: userReducer,

    },
  })
}