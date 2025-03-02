import axios from "axios";

export const baseURL = import.meta.env.VITE_BASE_URL; // Base URL for backend

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: `${baseURL}`, // Base URL for your backend
    headers: {
        "Content-Type": "application/json", // Default header for all requests
    },
});

export default axiosInstance;