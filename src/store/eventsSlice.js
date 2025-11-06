import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  eventsData: [],
  eventsLoading: false,
};

const eventsSlice = createSlice({
    name: "events",
    initialState,
    reducers:{
        setEvents(state, action){
            state.eventsData = action.payload;
        },
        setLoading(state, action){
            state.eventsLoading = action.payload;
        }
    }
})

export const {setEvents, setLoading} = eventsSlice.actions;
export default eventsSlice.reducer;