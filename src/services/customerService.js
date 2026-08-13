import api from './api';

export const customerService = {
    // ---------------------------------------------------------
    // BƯỚC 1: TẠO KHÁCH HÀNG MỚI
    // ---------------------------------------------------------
    createCustomer: async (formDataPayload) => {
        // Mặc định api.js đã có interceptor tự động đính kèm Token
        const response = await api.post('/customers', formDataPayload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        // Trả về phần data thực sự từ response của Axios (ApiResponse của Spring Boot)
        return response.data;
    },

    // ---------------------------------------------------------
    // LẤY DANH SÁCH HOẶC TÌM KIẾM KHÁCH HÀNG
    // ---------------------------------------------------------
    getAllCustomers: async (params) => {
        let url = '/customers';

        // Nếu người dùng có nhập keyword tìm kiếm, phải trỏ đúng vào endpoint /search của Backend
        if (params && params.keyword && params.keyword.trim() !== '') {
            url = `/customers/search?keyword=${encodeURIComponent(params.keyword.trim())}`;
        }

        const response = await api.get(url);
        return response.data;
    },

    // ---------------------------------------------------------
    // LẤY CHI TIẾT 1 KHÁCH HÀNG THEO ID
    // ---------------------------------------------------------
    getCustomerById: async (id) => {
        const response = await api.get(`/customers/${id}`);
        return response.data;
    },

    // ---------------------------------------------------------
    // CẬP NHẬT THÔNG TIN KHÁCH HÀNG
    // ---------------------------------------------------------
    updateCustomer: async (id, data) => {
        // Dữ liệu update thường là JSON nên không cần set header multipart/form-data
        const response = await api.put(`/customers/${id}`, data);
        return response.data;
    },

    // ---------------------------------------------------------
    // XÓA KHÁCH HÀNG
    // ---------------------------------------------------------
    deleteCustomer: async (id) => {
        const response = await api.delete(`/customers/${id}`);
        return response.data;
    }
};