import { api,  TOKEN_KEY } from "./client";
 
export const register = async (username, email, password) => {
    const response = await api.post("/auth/register", { username, email, password });
    localStorage.setItem(TOKEN_KEY, response.data.access_token);
    return response.data;
};
 
export const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem(TOKEN_KEY, response.data.access_token);
    return response.data;
};
 
export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/login";
};
 
export const me = async () => {
    const response = await api.get("/auth/me");
    return response.data;
};