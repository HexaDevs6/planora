import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    filter:"all",
    visibleCount : 6
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
      state.visibleCount = 6
    },
    setFilterQuery: (state,action) =>{
    state.filter = action.payload;
    state.visibleCount = 6
    },
    setVisibleCount : (state) => {
        state.visibleCount += 3;
    }
  },
});

export const { setSearchQuery , setFilterQuery,setVisibleCount} = searchSlice.actions;
export default searchSlice.reducer;
