import { createSlice } from "@reduxjs/toolkit";
import { logoutReset } from "./storeUtils";

const initialState = {
    name: "",
    email: "",
    isLoggedIn: false,
};

export const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        setSignin: (state, action) => {
            state = { ...action.payload };
            return state;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logoutReset, () => initialState);
    },
});

export const { setSignin } = user.actions;
export default user.reducer;
