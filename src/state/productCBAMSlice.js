import { createSlice } from "@reduxjs/toolkit";
import { logoutReset } from "./storeUtils";

const initialState = {
    data: [],
    pagination: { page: 1, limit: 5 },
    details: {},
    dashboard: {},
};

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
        updateCBAMDetails: (state, action) => {
            state.details = {
                ...state.details,
                [action.payload?.id]: action?.payload?.data,
            };

            return state;
        },
        updateDashboard: (state, action) => {
            state.dashboard = { ...action.payload };
            return state;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logoutReset, () => initialState);
    },
});

export const {
    setProductCBAM,
    updateListPage,
    updateCBAMDetails,
    updateDashboard,
} = productCBAM.actions;
export default productCBAM.reducer;
