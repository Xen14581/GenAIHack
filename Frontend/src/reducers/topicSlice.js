import { createSlice } from '@reduxjs/toolkit'

export const topicSlice = createSlice({
  name: 'topic',
  initialState: {
    selectedTopic: JSON.parse(localStorage.getItem("selectedTopic") || '{}'),
    topics: JSON.parse(localStorage.getItem("topics") || '[]')
  },
  reducers: {
    setTopic: (state, action) => {
      state.selectedTopic = action.payload
      localStorage.setItem("selectedTopic", JSON.stringify(state.selectedTopic))
    },
    setAllTopics: (state, action) => {
      state.topics = action.payload
      state.selectedTopic = action.payload[0]
      localStorage.setItem("selectedTopic", JSON.stringify(state.selectedTopic))
      localStorage.setItem("topics", JSON.stringify(state.topics))
    }
  }
})

// Action creators are generated for each case reducer function
export const { setTopic, setAllTopics } = topicSlice.actions

export default topicSlice.reducer