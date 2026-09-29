import axios from "axios";

const api = axios.create({
  baseURL: "https://e-commerce-task-gtmj.onrender.com",
  withCredentials: true,
});

export default api;
