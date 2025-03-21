import axios from "axios";
export const apiCall = axios.create({
    baseURL: REACT_APP_BASE_URL,
    headers: { "Content-Type": "application/json" },
});
