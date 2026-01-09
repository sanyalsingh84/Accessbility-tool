import axios from "axios";

export type ApiError = {
  message: string;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized");
      // optional: redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
