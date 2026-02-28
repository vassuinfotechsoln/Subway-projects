import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

export const STATIC_URL = "http://localhost:4000";

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;

    if (userInfo && userInfo.token) {
      if (!config.headers) config.headers = {};
      config.headers["Authorization"] = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
