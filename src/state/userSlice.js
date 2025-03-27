import { createSlice } from "@reduxjs/toolkit";

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
});

export const { setSignin } = user.actions;
export default user.reducer;
