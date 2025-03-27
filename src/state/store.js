import { configureStore } from "@reduxjs/toolkit";
import user from "state/userSlice";
import logger from "redux-logger"; // Import redux-logger
import productCBAM from "state/productCBAMSlice";

export const store = configureStore({
    reducer: { user: user, productCBAM: productCBAM },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), // Add logger as middleware
});
