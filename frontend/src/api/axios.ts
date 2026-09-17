import axios from "axios";

// AXIOS INSTANCE

const api = axios.create({
    // Falls back to localhost so nothing breaks in local dev — but
    // in production, Render injects VITE_API_URL at build time (set
    // in the Static Site's Environment tab), pointing at your actual
    // deployed backend instead of the visitor's own machine.
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
});



api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {

        config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

});


export default api;