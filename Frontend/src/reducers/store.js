import { configureStore } from '@reduxjs/toolkit'
import userDataReducer from "./userSlice"
import topicReducer from "./topicSlice"

export default configureStore({
  reducer: {
    userData: userDataReducer,
    topic: topicReducer,
  }
})