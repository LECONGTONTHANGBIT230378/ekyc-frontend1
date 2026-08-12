import api from './api';

export const customerService = {
    // Lấy danh sách khách hàng (Sửa từ /api/customers thành /customers)
    getAllCustomers: async (params) => {
        try {
            const response = await api.get('/customers', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy chi tiết 1 khách hàng
    getCustomerById: async (id) => {
        try {
            const response = await api.get(`/customers/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Cập nhật thông tin khách hàng
    updateCustomer: async (id, data) => {
        try {
            const response = await api.put(`/customers/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Xóa khách hàng
    deleteCustomer: async (id) => {
        try {
            const response = await api.delete(`/customers/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};