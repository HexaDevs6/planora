import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import searchAndFilterEventsReducer from "./searchAndFilterEventsSlice";
import searchAndFilterServiceReducer from "./searchAndFilterServiceSlice";
import categoriesReducer from "@/store/categoriesSlice";
import eventsReducer from "@/store/eventsSlice";
import servicesReducer from "@/store/servicesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    servicesSearchAndFilter: searchAndFilterServiceReducer,
    eventsSearchAndFilter: searchAndFilterEventsReducer,
    events: eventsReducer,
    services: servicesReducer,
  },
});
