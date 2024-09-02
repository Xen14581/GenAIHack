import { createSlice } from '@reduxjs/toolkit'

export const userDataSlice = createSlice({
  name: 'userData',
  initialState: {
    value: localStorage.getItem("user")
  },
  reducers: {
    login: (state, action) => {
      state.value = action.payload
      localStorage.setItem("user", action.payload)
    },
    logout: state => {
      state.value = {}
      localStorage.removeItem("user")
    },
  }
})

// Action creators are generated for each case reducer function
export const { login, logout } = userDataSlice.actions

export default userDataSlice.reducer