import axios from 'axios';

const isDevelopment = import.meta.env.MODE === 'development';
//create an axios instance with base URL
const apiClient = axios.create({
    baseURL: isDevelopment ? '/api' : import.meta.env.VITE_API_BASE_URL, // Use proxy in development
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
});

//attach JWT token to request headers when available
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('iec_token') || localStorage.getItem('token'); // Adjust based on your auth storage strategy
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//auto-logout on 401 response
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('iec_token');
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);



export default apiClient;