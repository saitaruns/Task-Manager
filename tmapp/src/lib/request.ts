import axios, { AxiosInstance } from "axios";

const instance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URI,
  headers: {
    "Authorization": `Bearer ${typeof localStorage !== "undefined" ? localStorage.getItem("token") : ""}`,
    "Content-Type": "application/json",
  },
});

export default instance;
