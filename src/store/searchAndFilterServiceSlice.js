import { createSlice } from "@reduxjs/toolkit";

const searchAndFilterServiceSlice = createSlice({
  name: "searchandfilter",
  initialState: {
    queryService: "",
    filterService: "all",
    visibleCountService: 6,
  },
  reducers: {
    setServiceSearchQuery: (state, action) => {
      state.queryService = action.payload;
      state.visibleCountService = 6;
    },
    setServiceFilterQuery: (state, action) => {
      state.filterService = action.payload;
      state.visibleCountService = 6;
    },
    setServiceVisibleCount: (state) => {
      state.visibleCountService += 6;
    },
  },
});

export const {
  setServiceSearchQuery,
  setServiceFilterQuery,
  setServiceVisibleCount,
} = searchAndFilterServiceSlice.actions;

export default searchAndFilterServiceSlice.reducer;
