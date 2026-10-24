
import axios from "axios";

const api = axios.create({
    baseURL: "https://s3-simulator-backend.onrender.com/api"
});

export default api;
