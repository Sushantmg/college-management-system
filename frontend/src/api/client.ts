import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const onAuthPage =
        window.location.pathname === "/login" ||
        window.location.pathname === "/register";
      if (!onAuthPage) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;