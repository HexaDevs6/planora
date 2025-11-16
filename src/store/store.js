import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import searchAndFilterEventsReducer from "./searchAndFilterEventsSlice";
import searchAndFilterServiceReducer from "./searchAndFilterServiceSlice";
import categoriesReducer from "@/store/categoriesSlice";
import eventsReducer from "@/store/eventsSlice";
import servicesReducer from "@/store/servicesSlice";
import clientTicketsReducer from "@/store/tickets/clientTicketsSlice";
import hostEventTicketsReducer from "@/store/tickets/hostEventTicketsSlice";




export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    servicesSearchAndFilter: searchAndFilterServiceReducer,
    eventsSearchAndFilter: searchAndFilterEventsReducer,
    events: eventsReducer,
    services: servicesReducer,
    clientTickets: clientTicketsReducer,
    hostTickets: hostEventTicketsReducer,
  },
});
