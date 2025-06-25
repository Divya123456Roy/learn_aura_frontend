import { configureStore } from "@reduxjs/toolkit";
import user from "./Userslice";
import course from "./courseSlice";

export const store = configureStore({
reducer:{
    auth:user,
    course
}
})
