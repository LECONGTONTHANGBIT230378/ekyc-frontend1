import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm Interceptor cho request để tự động đính kèm Token
api.interceptors.request.use(
    (config) => {
        // ====================================================================
        // ĐÃ SỬA: Đổi 'accessToken' thành 'token' cho khớp với lúc Đăng nhập
        // ====================================================================
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm Interceptor cho response (Bắt lỗi 401/403 tập trung)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Phiên đăng nhập đã hết hạn hoặc token không hợp lệ.");

            // ====================================================================
            // ĐÃ MỞ KHÓA: Tự động dọn dẹp và đẩy về trang đăng nhập nếu token sai
            // ====================================================================
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;