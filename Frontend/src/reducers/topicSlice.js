import { createSlice } from '@reduxjs/toolkit'

export const topicSlice = createSlice({
  name: 'topic',
  initialState: {
    value: localStorage.getItem("topic")
  },
  reducers: {
    setTopic: (state, action) => {
      state.value = action.payload
      localStorage.setItem("topic", action.payload)
    },
  }
})

// Action creators are generated for each case reducer function
export const { setTopic } = topicSlice.actions

export default topicSlice.reducer