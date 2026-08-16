import api from './api';

export const historyService = {
    // Lấy danh sách lịch sử (có phân trang, tìm kiếm, lọc)
    getAllHistory: async (params) => {
        try {
            // params có thể gồm: { page, size, keyword, status }
            const response = await api.get('/history', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy chi tiết một lượt xác thực cụ thể theo ID
    getHistoryById: async (id) => {
        try {
            const response = await api.get(`/history/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};