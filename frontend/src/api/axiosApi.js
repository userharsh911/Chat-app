import axios from "axios"

const axiosApi = axios.create({
    baseURL : import.meta.env.MODE === "development" ? "http://localhost:3002/api" : `${import.meta.env.VITE_BACKEND_URI}/api`,
    timeout:30000,
    withCredentials:true
})

export default axiosApi;