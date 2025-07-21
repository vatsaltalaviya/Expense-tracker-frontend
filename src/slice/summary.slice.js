import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/AxiosInstance";


export const getSummary = createAsyncThunk("getSummary", async (_, thunkAPI) => {
    try {
        const res = await axiosInstance.get(`/summary`)
        const data = res.data
        if (data.success) {
            return data.summary
        }
    } catch (error) {
        const message = error?.response?.data?.message || error.message || "Something went wrong";
        return thunkAPI.rejectWithValue({ message });
    }
})
export const getRecentTrasaction = createAsyncThunk("getRecentTrasaction", async (page, thunkAPI) => {
    try {
        const res = await axiosInstance.get(`/summary/transaction?page=${page}`)
        const data = res.data
        if (data.success) {
            return { transactions: data.transactions, meta: data.meta }
        }
    } catch (error) {
        const message = error?.response?.data?.message || error.message || "Something went wrong";
        return thunkAPI.rejectWithValue({ message });
    }
})
export const getIncomeExpenseTrand = createAsyncThunk("getIncomeExpenseTrand", async (_, thunkAPI) => {
    try {
        const res = await axiosInstance.get(`charts/trends`)
        const data = res.data
        if (data.success) {
            return { income: data.incomeTrend, expense: data.expenseTrend }
        }
    } catch (error) {
        const message = error?.response?.data?.message || error.message || "Something went wrong";
        return thunkAPI.rejectWithValue({ message });
    }
})



const summarySlice = createSlice({
    name: "summary",
    initialState: {
        summary: [],
        recentTransaction: [],
        chartTrand: null,
        summaryLoading: false,
        recentTransactionLoading: false,
        totalData: 0,
        hasmore: false,
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSummary.pending, (state, action) => {
                state.summaryLoading = true,
                    state.error = null
            })
            .addCase(getSummary.fulfilled, (state, action) => {
                state.summaryLoading = false,
                    state.summary = action.payload,
                    state.error = null
            })
            .addCase(getSummary.rejected, (state, action) => {
                state.summaryLoading = false,
                    state.error = action.payload
            })
            .addCase(getRecentTrasaction.pending, (state, action) => {
                state.recentTransactionLoading = true,
                    state.error = null
            })
            .addCase(getRecentTrasaction.fulfilled, (state, action) => {
                const { transactions, meta } = action.payload
                state.recentTransactionLoading = false
                      // 👇 APPEND instead of overwrite
                if (meta.currentPage === 1) {
                    state.recentTransaction = transactions; // For first page, overwrite
                } else {
                    state.recentTransaction = [...state.recentTransaction, ...transactions]; // For next pages, append
                }
                state.totalData = meta.totalDocs
                state.hasmore = meta.currentPage < meta.totalPages;
                state.error = null
            })
            .addCase(getRecentTrasaction.rejected, (state, action) => {
                state.recentTransactionLoading = false,
                    state.error = action.payload
            })
            .addCase(getIncomeExpenseTrand.pending, (state, action) => {
                state.recentTransactionLoading = true,
                    state.error = null
            })
            .addCase(getIncomeExpenseTrand.fulfilled, (state, action) => {
                state.recentTransactionLoading = false,
                    state.chartTrand = action.payload,
                    state.error = null
            })
            .addCase(getIncomeExpenseTrand.rejected, (state, action) => {
                state.recentTransactionLoading = false,
                    state.error = action.payload
            })

    }
})

export default summarySlice.reducer