import api from './api';

export const dashboardService = {
    /**
     * 1. Lấy dữ liệu thống kê Dashboard
     * Endpoint Backend: GET /api/v1/dashboard/statistics
     */
    getStatistics: async () => {
        // Gọi API (đã được tự động gắn /api/v1 và Token từ api.js)
        const response = await api.get('/dashboard/statistics');

        // Backend bọc dữ liệu trong class ApiResponse { success, message, data }
        // Do đó ta cần trả về response.data.data để Reports.jsx lấy đúng object stats
        return response.data.data;
    },

    /**
     * 2. Xuất báo cáo Excel
     * Endpoint Backend: GET /api/v1/history/export-excel
     */
    exportExcel: async () => {
        const response = await api.get('/history/export-excel', {
            // QUAN TRỌNG: Bắt buộc cấu hình responseType là 'blob'
            // để Axios hiểu và không làm hỏng dữ liệu nhị phân của file Excel
            responseType: 'blob'
        });

        // Trả về trực tiếp dữ liệu blob để Reports.jsx convert thành URL
        return response.data;
    },

    /**
     * 3. Xuất báo cáo CSV
     * Endpoint Backend: GET /api/v1/history/export-csv
     */
    exportCsv: async () => {
        const response = await api.get('/history/export-csv', {
            // Tương tự như Excel, CSV từ Spring Boot trả về dạng InputStreamResource
            responseType: 'blob'
        });

        return response.data;
    }
};