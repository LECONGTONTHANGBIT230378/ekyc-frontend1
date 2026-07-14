import api from './api';

export const customerService = {
    // Gọi lệnh POST để tạo mới khách hàng (Dùng ở Step 1)
    registerCustomer: async (customerData) => {
        try {
            const response = await api.post('/customers', customerData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi kết nối: Không thể tạo hồ sơ khách hàng');
        }
    },

    // Gọi lệnh PUT để cập nhật (Phòng trường hợp quay lại Step 1 để sửa thông tin)
    updateCustomer: async (id, customerData) => {
        try {
            const response = await api.put(`/customers/${id}`, customerData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi kết nối: Không thể cập nhật hồ sơ');
        }
    },

    // Hàm gọi API Upload ảnh CCCD (Dùng cho Step 2)
    uploadCccdImages: async (id, frontFile, backFile) => {
        try {
            // Định dạng multipart/form-data bắt buộc phải dùng FormData
            const formData = new FormData();
            formData.append('frontImage', frontFile);
            formData.append('backImage', backFile);

            const response = await api.post(`/customers/${id}/upload-cccd`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi kết nối: Không thể tải ảnh lên máy chủ');
        }
    }
};