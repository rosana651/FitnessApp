import { api } from "./client";

export const uploadSquatVideo = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/workouts/squat", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};

export const uploadPlankVideo = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/workouts/plank", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};

export const uploadWidePushupVideo = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/workouts/wide_pushup", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};

export const getWorkoutById = async (id) => {
    const response = await api.get(`/workouts/${id}`);
    return response.data;
};

export const getWorkoutHistory = async () => {
    const response = await api.get("/workouts/history");
    return response.data;
};

export const deleteWorkout = async (id) => {
    await api.delete(`/workouts/${id}`);
};