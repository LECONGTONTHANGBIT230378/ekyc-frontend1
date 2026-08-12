import axios from 'axios';

const api = axios.create({
    // Chỉ dùng đường dẫn tương đối, cấu hình proxy trong vite.config.ts sẽ định tuyến tới backend
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm Interceptor cho request để tự động đính kèm Token
api.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage với key 'accessToken'
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

// Thêm Interceptor cho response (Tùy chọn: giúp bắt lỗi 401/403 tập trung)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Phiên đăng nhập đã hết hạn hoặc token không hợp lệ.");
            // Tùy chọn: Tự động xóa token và đẩy về trang đăng nhập
            // localStorage.removeItem('accessToken');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;