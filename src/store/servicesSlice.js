import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  servicesData: [],
  servicesLoading: false,
};

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setServices(state, action) {
      state.servicesData = action.payload;
    },
    setLoading(state, action) {
      state.servicesLoading = action.payload;
    },
  },
});

export const { setServices, setLoading } = serviceSlice.actions;
export default serviceSlice.reducer;