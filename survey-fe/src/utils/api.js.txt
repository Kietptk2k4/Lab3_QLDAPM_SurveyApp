// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:80").replace(/\/+$/,""),
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("access_token");
  if (raw) {
    config.headers.Authorization = raw.startsWith("Bearer ") ? raw : `Bearer ${raw}`;
  }
  return config;
});

export default api;
