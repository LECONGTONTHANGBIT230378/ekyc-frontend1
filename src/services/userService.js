// File: src/services/userService.js
import api from './api';

export const userService = {
    // Gọi API đăng ký tài khoản (Backend đã có sẵn)
    createAccount: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    }
};