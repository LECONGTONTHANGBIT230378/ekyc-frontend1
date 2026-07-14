import api from './api';

export const authService = {
    // Đổi tham số nhận vào thành username
    login: async (username, password) => {
        try {
            // Gửi đúng cặp { username, password }
            const response = await api.post('/auth/login', { username, password });
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                // Lấy thông báo lỗi trực tiếp từ Backend để hiển thị ra UI
                throw new Error(error.response.data.message || 'Tài khoản hoặc mật khẩu không chính xác');
            }
            throw new Error('Không thể kết nối đến máy chủ!');
        }
    },

    logout: () => {
        localStorage.removeItem('accessToken');
    }
};