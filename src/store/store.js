import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import searchReducer from './searchSlice'
import categoriesReducer from '@/store/categoriesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    categories: categoriesReducer,
  },
});

export default store;
