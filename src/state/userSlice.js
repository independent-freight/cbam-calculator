import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: "",
    username: "",
};

export const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setUsername: (state, action) => {
            state.username = action.payload;
        },
    },
});

export const { setToken, setUsername } = user.actions;
export default user.reducer;
