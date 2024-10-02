import { createSlice } from '@reduxjs/toolkit'

let progress_json = {
  "Chat": 0,
  "Quiz": 1,
  "Code": 2,
  "Complete": 3
}

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
    },
    updateTopic: (state, action) => {
      let [topic_id, progress] = action.payload
      state.topics = state.topics.map(topic => {
        if (topic.id !== topic_id) {
          console.log("Here")
          return topic
        } else {
          console.log("Tere")
          progress.progress = progress_json[progress.progress]
          console.log(progress.progress)
          return {...topic, ...progress}
        }
      })
      state.selectedTopic = state.topics.filter(topic => topic.id === state.selectedTopic.id)[0]
      localStorage.setItem("selectedTopic", JSON.stringify(state.selectedTopic))
      localStorage.setItem("topics", JSON.stringify(state.topics))
    }
  }
})

// Action creators are generated for each case reducer function
export const { setTopic, setAllTopics, updateTopic } = topicSlice.actions

export default topicSlice.reducer