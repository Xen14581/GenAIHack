import { createSlice } from '@reduxjs/toolkit'

export const userDataSlice = createSlice({
  name: 'user',
  initialState: {
    value: localStorage.getItem("user")
  },
  reducers: {
    storeUserData: (state, action) => {
      state.value = action.payload
      localStorage.setItem("user", action.payload)
      return 
    },
    removeUserData: state => {
      state.value = {}
      localStorage.removeItem("user")
      return
    }
  }
})

// Action creators are generated for each case reducer function
export const { storeUserData, removeUserData } = userDataSlice.actions

export default userDataSlice.reducer