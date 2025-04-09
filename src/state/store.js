import { configureStore } from "@reduxjs/toolkit";
import user from "state/userSlice";
import logger from "redux-logger"; // Import redux-logger
import productCBAM from "state/productCBAMSlice";

export const store = configureStore({
    reducer: { user: user, productCBAM: productCBAM },
    middleware: (getDefaultMiddleware) =>
        process.env?.REACT_APP_DEV === "dev"
            ? getDefaultMiddleware().concat(logger)
            : null, // Add logger as middleware
});
