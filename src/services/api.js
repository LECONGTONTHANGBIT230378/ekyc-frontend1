import axios from 'axios';

const api = axios.create({
    // Chỉ dùng đường dẫn tương đối, KHÔNG điền tên miền http://localhost:8080 vào đây nữa
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;