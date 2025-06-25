import {createSlice} from '@reduxjs/toolkit'


export const courseSlice= createSlice({
  name:"courseSlice",
  initialState:{
      courseId: null
  },
  reducers:{
      redirectToCourse:((state,action)=>{
        state.courseId = action.payload
      })
  }
})

export default courseSlice.reducer

export const {redirectToCourse} =  courseSlice.actions