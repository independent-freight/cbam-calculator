import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const productCBAM = createSlice({
    name: "productCBAM",
    initialState,
    reducers: {
        setProductCBAM: (state, action) => {
            state = [...action.payload];
            return state;
        },
    },
});

export const { setProductCBAM } = productCBAM.actions;
export default productCBAM.reducer;
