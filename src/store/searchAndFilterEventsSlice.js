import { createSlice } from "@reduxjs/toolkit";

const searchAndFilterEventsSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    filter: "all",
    visibleCount: 6,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
      state.visibleCount = 6;
    },
    setFilterQuery: (state, action) => {
      state.filter = action.payload;
      state.visibleCount = 6;
    },
    setVisibleCount: (state) => {
      state.visibleCount += 6;
    },
  },
});

export const { setSearchQuery, setFilterQuery, setVisibleCount } =
  searchAndFilterEventsSlice.actions;
export default searchAndFilterEventsSlice.reducer;
