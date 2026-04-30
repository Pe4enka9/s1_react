import axios from "axios";
import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: apiUrl + '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

api.interceptors.request.use(config => {
    const token = Cookies.get('XSRF-TOKEN');

    if (token) {
        config.headers['X-XSRF-TOKEN'] = token;
    }

    return config;
});

export const getCsrf = () => axios.get(apiUrl + '/sanctum/csrf-cookie', {withCredentials: true});

export default api;
