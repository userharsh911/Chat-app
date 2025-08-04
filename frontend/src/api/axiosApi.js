import axios from "axios"

const axiosApi = axios.create({
    baseURL : import.meta.env.MODE=="development" ? "http://localhost:3002/api" : "/api",
    timeout:10000,
    withCredentials:true
})

export default axiosApi;