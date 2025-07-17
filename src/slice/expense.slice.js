import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/AxiosInstance";


export const addExpense = createAsyncThunk("addExpense" , async(expenseData,thunkAPI)=>{
    try {
        const res = await axiosInstance.post(`/expense/addExpense/`,expenseData)  
        const data =res.data
        if(data.success){
            return data.expense
        }
    } catch (error) {
         const message = error?.response?.data?.message || error.message || "Something went wrong";
    return thunkAPI.rejectWithValue({ message });
    }
})
export const deleteExpense = createAsyncThunk("deleteExpense" , async(Id,thunkAPI)=>{
    try {
        const res = await axiosInstance.delete(`/expense/deleteExpense/${Id}`)  
        const data =res.data
        if(data.success){
            return data.expense
        }
    } catch (error) {
         const message = error?.response?.data?.message || error.message || "Something went wrong";
    return thunkAPI.rejectWithValue({ message });
    }
})
export const getExpense = createAsyncThunk("getExpense" , async(id,thunkAPI)=>{
    
    try {
        const res = await axiosInstance.get(`/expense/getExpense/${id}`)  
        const data =res.data
        if(data.success){
            return data.expense
        }
    } catch (error) {
         const message = error?.response?.data?.message || error.message || "Something went wrong";
    return thunkAPI.rejectWithValue({ message });
    }
})
export const getExpenseTrend = createAsyncThunk("getExpenseTrend" , async(_,thunkAPI)=>{
    
    try {
        const res = await axiosInstance.get(`charts/trends`)  
        const data =res.data
        if(data.success){
            return data.expenseTrend
        }
    } catch (error) {
         const message = error?.response?.data?.message || error.message || "Something went wrong";
    return thunkAPI.rejectWithValue({ message });
    }
})


const expenseSlice = createSlice({
    name:"expense",
    initialState:{
        expense:[],
        expenseTrend:[],
        expenseLoading:false,
        trendLoading:false,
        AddexpenseLoading:false,
        error:null
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getExpense.pending ,(state , action)=>{
                    state.expenseLoading = true,
                    state.error = null
                } )
                .addCase(getExpense.fulfilled ,(state , action)=>{
                    state.expenseLoading = false,
                    state.expense = action.payload,
                    state.error = null
                } )
                .addCase(getExpense.rejected ,(state , action)=>{
                    state.expenseLoading = false,
                    state.error = action.payload
                } )
        .addCase(getExpenseTrend.pending ,(state , action)=>{
                    state.trendLoading = true,
                    state.error = null
                } )
                .addCase(getExpenseTrend.fulfilled ,(state , action)=>{
                    state.trendLoading = false,
                    state.expenseTrend = action.payload,
                    state.error = null
                } )
                .addCase(getExpenseTrend.rejected ,(state , action)=>{
                    state.trendLoading = false,
                    state.error = action.payload
                } )
        .addCase(deleteExpense.pending ,(state , action)=>{
                    state.expenseLoading = true,
                    state.error = null
                } )
                .addCase(deleteExpense.fulfilled ,(state , action)=>{
                    state.expenseLoading = false,
                    state.error = null
                } )
                .addCase(deleteExpense.rejected ,(state , action)=>{
                    state.expenseLoading = false,
                    state.error = action.payload
                } )
        .addCase(addExpense.pending ,(state , action)=>{
                    state.AddexpenseLoading = true,
                    state.error = null
                } )
                .addCase(addExpense.fulfilled ,(state , action)=>{
                    state.AddexpenseLoading = false,
                    state.error = null
                } )
                .addCase(addExpense.rejected ,(state , action)=>{
                    state.AddexpenseLoading = false,
                    state.error = action.payload
                } )
    }
})

export default expenseSlice.reducer