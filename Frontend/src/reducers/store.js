import { configureStore } from '@reduxjs/toolkit'
import userDataReducer from "./userSlice"
import topicReducer from "./topicSlice"
import stepperReducer from "./stepperSlice"

export default configureStore({
  reducer: {
    user: userDataReducer,
    topic: topicReducer,
    step: stepperReducer,
  }
})