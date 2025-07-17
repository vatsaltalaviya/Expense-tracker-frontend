import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../slice/user.slice'
import incomeReducer from '../slice/income.slice'
import expenseReducer from '../slice/expense.slice'
import summaryReducer from '../slice/summary.slice'

export const store = configureStore({
    reducer:{
        user:userReducer,
        income:incomeReducer,
        expense:expenseReducer,
        summary:summaryReducer,
        }

})