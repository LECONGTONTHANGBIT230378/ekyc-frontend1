// File: src/services/userService.js
import api from './api';

export const userService = {
    // ---------------------------------------------------------
    // TẠO TÀI KHOẢN MỚI
    // ---------------------------------------------------------
    createAccount: async (userData) => {
        // Sử dụng endpoint /users thay vì /auth/register để sử dụng đúng luồng Admin quản lý
        const response = await api.post('/users', userData);
        return response.data;
    },

    // ---------------------------------------------------------
    // LẤY DANH SÁCH TÀI KHOẢN (CÓ TÌM KIẾM)
    // ---------------------------------------------------------
    getAllUsers: async (keyword = '') => {
        // Thiết lập size lớn (ví dụ 100) để lấy toàn bộ dữ liệu
        // và cho phép Frontend tự phân trang nội bộ một cách mượt mà
        let url = '/users?size=100';

        if (keyword && keyword.trim() !== '') {
            url = `/users?keyword=${encodeURIComponent(keyword.trim())}&size=100`;
        }

        const response = await api.get(url);
        return response.data;
    },

    // ---------------------------------------------------------
    // LẤY THÔNG TIN CHI TIẾT 1 TÀI KHOẢN THEO ID
    // ---------------------------------------------------------
    getUserById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    // ---------------------------------------------------------
    // CẬP NHẬT THÔNG TIN TÀI KHOẢN
    // ---------------------------------------------------------
    updateUser: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },

    // ---------------------------------------------------------
    // XÓA TÀI KHOẢN
    // ---------------------------------------------------------
    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};