import api from './api';

export const ekycService = {
    // Hàm tải ảnh lên máy chủ (Mặt trước/Mặt sau CCCD)
    uploadImage: async (customerId, file, type) => {
        try {
            // Sử dụng FormData để đóng gói file
            const formData = new FormData();
            formData.append('file', file);       // File ảnh thực tế
            formData.append('type', type);       // Loại ảnh: 'FRONT' hoặc 'BACK'

            // Gọi API (Đường dẫn này sẽ phụ thuộc vào Backend của bạn)
            const response = await api.post(`/customers/${customerId}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Bắt buộc khi gửi file
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi tải ảnh lên máy chủ');
        }
    }
};