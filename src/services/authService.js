import api from './api';

export const authService = {
    login: async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            return response.data; // Trả về cục ApiResponse từ Backend
        } catch (error) {
            if (error.response && error.response.data) {
                throw new Error(error.response.data.message || 'Tài khoản hoặc mật khẩu không chính xác');
            }
            throw new Error('Không thể kết nối đến máy chủ!');
        }
    },

    logout: () => {
        // ĐÃ SỬA: Đồng bộ dùng đúng tên biến là 'token' và xóa cả 'role'
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login'; // Tự động đẩy về trang login khi đăng xuất
    }
};