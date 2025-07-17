import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../Utils/AxiosInstance";

export const LoginUser = createAsyncThunk("LoginUser",async(UserData,thunkAPI)=>{
    try {
        const res = await axiosInstance.post(`/user/login`,UserData) 
        const data =res.data
        if(data.success){
            sessionStorage.setItem("refreshToken",data.Refreshtoken)
            sessionStorage.setItem("AccessToken",data.Accesstoken)
            localStorage.setItem("username",data.user.username)
            localStorage.setItem("userid",data.user.id)
            return data.user
        }
    } catch (error) {
         const message = error?.response?.data?.message || error.message || "Something went wrong";
    return thunkAPI.rejectWithValue({ message });
    }
})
export const registerUser = createAsyncThunk("registerUser",async(UserData,thunkAPI)=>{
    try {
        const res = await axiosInstance.post(`/user/register`,UserData)
        
        const data =res.data
        if(data.success){
            sessionStorage.setItem("refreshToken",data.Refreshtoken)
            sessionStorage.setItem("AccessToken",data.Accesstoken)
            localStorage.setItem("username",data.user.username)
            localStorage.setItem("userid",data.user.id)
            return data.user
        }
    } catch (error) {
         const message = error?.response?.data?.message || error.message || "Something went wrong";
    return thunkAPI.rejectWithValue({ message });
    }
})
export const userProfile = createAsyncThunk("userProfile",async(_,thunkAPI)=>{
    try {
        const res = await axiosInstance.get(`/user/profile`)
        
        const data =res.data
        if(data.success){
            return data.user
        }
    } catch (error) {
         const message = error?.response?.data?.message || error.message || "Something went wrong";
    return thunkAPI.rejectWithValue({ message });
    }
})

const userSlice = createSlice({
    name:"user",
    initialState:{
        user:null,
        profile:false,
        loading:false,
        error:null
    },
    extraReducers:(builder)=>{
        builder
        .addCase(LoginUser.pending ,(state , action)=>{
            state.loading = true,
            state.error = null
        } )
        .addCase(LoginUser.fulfilled ,(state , action)=>{
            state.loading = false,
            state.user = action.payload,
            state.error = null
        } )
        .addCase(LoginUser.rejected ,(state , action)=>{
            state.loading = false,
            state.error = action.payload
        } )
        .addCase(registerUser.pending ,(state , action)=>{
            state.loading = true,   
            state.error = null
        } )
        .addCase(registerUser.fulfilled ,(state , action)=>{
            state.loading = false,
            state.user = action.payload,
            state.error = null
        } )
        .addCase(registerUser.rejected ,(state , action)=>{
            state.loading = false,
            state.error = action.payload
        } )
        .addCase(userProfile.pending ,(state , action)=>{
            state.loading = true,
            state.error = null
        } )
        .addCase(userProfile.fulfilled ,(state , action)=>{
            state.loading = false,
            state.error = null
            state.profile = action.payload.success;
        } )
        .addCase(userProfile.rejected ,(state , action)=>{
            state.loading = false,
            state.error = action.payload
        } )
    }
})

export default userSlice.reducer