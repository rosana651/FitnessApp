import axios from 'axios'
 
const baseURL = "http://localhost:8000" || "http://127.0.0.1:8000";
 
export const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});
 
 
export const TOKEN_KEY = "access_token";
 
api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
 
api.interceptors.response.use(async (response) => {
    return response;
}, async (error) => {
    if (error.response.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = "/login";
    }
    return Promise.reject(error);
});