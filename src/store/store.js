import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import searchAndFilterEventsSlice from "./searchAndFilterEventsSlice";
import searchAndFilterServiceSlice from "./searchAndFilterServiceSlice";
import categoriesReducer from "@/store/categoriesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    servicesSearchAndFilter: searchAndFilterServiceSlice,
    eventsSearchAndFilter: searchAndFilterEventsSlice,
  },
});

export default store;
