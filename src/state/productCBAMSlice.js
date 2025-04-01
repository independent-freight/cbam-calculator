import { createSlice } from "@reduxjs/toolkit";

const initialState = { data: [], pagination: { page: 1, limit: 10 } };

export const productCBAM = createSlice({
    name: "productCBAM",
    initialState,
    reducers: {
        setProductCBAM: (state, action) => {
            state.data = [...(action?.payload?.products ?? [])];
            state.pagination = { ...(action.payload?.pagination ?? {}) };
            return state;
        },
        updateListPage: (state, action) => {
            state.pagination.page = action.payload;
        },
    },
});

export const { setProductCBAM, updateListPage } = productCBAM.actions;
export default productCBAM.reducer;
