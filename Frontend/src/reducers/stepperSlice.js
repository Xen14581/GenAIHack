import { createSlice } from '@reduxjs/toolkit'

export const stepperSlice = createSlice({
  name: 'stepper',
  initialState: {
    activeStep: localStorage.getItem("activeStep") ? localStorage.getItem("activeStep") : 0
  },
  reducers: {
    setActiveStep: (state, action) => {
      state.activeStep = action.payload
      localStorage.setItem("activeStep", state.activeStep)
    }
  }
})

// Action creators are generated for each case reducer function
export const { setActiveStep } = stepperSlice.actions

export default stepperSlice.reducer