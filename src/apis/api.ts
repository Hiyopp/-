import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: "/local",
});

export default api;
