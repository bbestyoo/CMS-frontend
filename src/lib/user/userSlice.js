import { createSlice } from '@reduxjs/toolkit'
import { deleteCookie } from 'cookies-next'

const initialState = {
  value: null,
}
  
export const UserSlice = createSlice({
    
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      // console.log("hereinsslice")
        // console.log("*****cartslice",action.payload)
        state.value = action.payload
        // console.log("*****cartslice",state.value)
        
  },
    logoutUser: (state) => {
        state.value = null
        deleteCookie('accesstoken')
        deleteCookie('refreshtoken')
        
        // localStorage.removeItem('accessToken');
        // localStorage.removeItem('refreshToken');
    }
  }})

// Action creators are generated for each case reducer function
export const { setUserInfo, logoutUser } = UserSlice.actions

export default UserSlice.reducer