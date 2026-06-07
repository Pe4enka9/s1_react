import axios from "axios";
import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
    },
});

api.interceptors.request.use(config => {
    const token = Cookies.get('XSRF-TOKEN');

    if (token) {
        config.headers['X-XSRF-TOKEN'] = token;
    }

    return config;
});

export const getCsrf = () => api.get('/csrf-cookie');

export default api;
