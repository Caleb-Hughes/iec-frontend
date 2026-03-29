import axios from 'axios';

const isDevelopment = import.meta.env.MODE === 'development';
//create an axios instance with base URL
const apiClient = axios.create({
    baseURL: isDevelopment ? '/api' : `${import.meta.env.VITE_API_BASE_URL}/api`, // Use proxy in development
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
});

//auto-logout on 401 response
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn("Unauthorized - session expired");
        }
        return Promise.reject(error);
    }
);



export default apiClient;