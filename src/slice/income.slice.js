import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/AxiosInstance";


export const addIncome = createAsyncThunk("addIncome" , async(incomeData,thunkAPI)=>{
    try {
        const res = await axiosInstance.post(`/income/addIncome/`,incomeData)  
        const data =res.data
        if(data.success){
            return data.income
        }
    } catch (error) {
         const message = error?.response?.data?.message || error.message || "Something went wrong";
    return thunkAPI.rejectWithValue({ message });
    }
})
export const deleteIncome = createAsyncThunk("deleteIncome" , async(Id,thunkAPI)=>{
    try {
        const res = await axiosInstance.delete(`/income/deleteIncome/${Id}`)  
        const data =res.data
        if(data.success){
            return data.income
        }
    } catch (error) {
         const message = error?.response?.data?.message || error.message || "Something went wrong";
    return thunkAPI.rejectWithValue({ message });
    }
})
export const getIncome = createAsyncThunk("getIncome" , async(id,thunkAPI)=>{
    
    try {
        const res = await axiosInstance.get(`/income/getIncome/${id}`)  
        const data =res.data
        if(data.success){
            return data.income
        }
    } catch (error) {
         const message = error?.response?.data?.message || error.message || "Something went wrong";
    return thunkAPI.rejectWithValue({ message });
    }
})
export const getIncomeTrend = createAsyncThunk("getIncomeTrend" , async(_,thunkAPI)=>{
    
    try {
        const res = await axiosInstance.get(`charts/trends`)  
        const data =res.data
        if(data.success){
            return data.incomeTrend
        }
    } catch (error) {
         const message = error?.response?.data?.message || error.message || "Something went wrong";
    return thunkAPI.rejectWithValue({ message });
    }
})


const incomeSlice = createSlice({
    name:"income",
    initialState:{
        income:[],
        incomeTrend:[],
        incomeLoading:false,
        trendLoading:false,
        AddincomeLoading:false,
        error:null
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getIncome.pending ,(state , action)=>{
                    state.incomeLoading = true,
                    state.error = null
                } )
                .addCase(getIncome.fulfilled ,(state , action)=>{
                    state.incomeLoading = false,
                    state.income = action.payload,
                    state.error = null
                } )
                .addCase(getIncome.rejected ,(state , action)=>{
                    state.incomeLoading = false,
                    state.error = action.payload
                } )
        .addCase(getIncomeTrend.pending ,(state , action)=>{
                    state.trendLoading = true,
                    state.error = null
                } )
                .addCase(getIncomeTrend.fulfilled ,(state , action)=>{
                    state.trendLoading = false,
                    state.incomeTrend = action.payload,
                    state.error = null
                } )
                .addCase(getIncomeTrend.rejected ,(state , action)=>{
                    state.trendLoading = false,
                    state.error = action.payload
                } )
        .addCase(deleteIncome.pending ,(state , action)=>{
                    state.incomeLoading = true,
                    state.error = null
                } )
                .addCase(deleteIncome.fulfilled ,(state , action)=>{
                    state.incomeLoading = false,
                    state.error = null
                } )
                .addCase(deleteIncome.rejected ,(state , action)=>{
                    state.incomeLoading = false,
                    state.error = action.payload
                } )
        .addCase(addIncome.pending ,(state , action)=>{
                    state.AddincomeLoading = true,
                    state.error = null
                } )
                .addCase(addIncome.fulfilled ,(state , action)=>{
                    state.AddincomeLoading = false,
                    state.error = null
                } )
                .addCase(addIncome.rejected ,(state , action)=>{
                    state.AddincomeLoading = false,
                    state.error = action.payload
                } )
    }
})

export default incomeSlice.reducer