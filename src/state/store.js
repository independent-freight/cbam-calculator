import { configureStore } from "@reduxjs/toolkit";
import user from "state/userSlice";

export const store = configureStore({
    reducer: { user },
});
