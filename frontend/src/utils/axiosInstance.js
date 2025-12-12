import axios from "axios";
import { BASE_URL } from "./ApiPath";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status) {
      if (error.response.status === 401) {
        window.location.href = "/";
      } else if (error.response.status === 500) {
        console.error("Server Error:", error.response.data);
      }
    } else if (error.code === "ERR_CANCELED" || error.code === "ECONNABORTED") {
      console.error("Request timeout or canceled");
    } else if (error.code === "ERR_NETWORK" || !error.response) {
      console.error("Network Error: Could not connect to server. Please check if backend is running.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
