import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
    loading: false,
};

const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        setCategories(state, action) {
            state.data = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
    },
});

export const { setCategories, setLoading } = categoriesSlice.actions;
export default categoriesSlice.reducer;
