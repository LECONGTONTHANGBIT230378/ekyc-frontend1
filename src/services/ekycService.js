import api from './api';

export const ekycService = {
    // ---------------------------------------------------------
    // Hàm gọi API nhận diện OCR (Dùng cho Bước 3)
    // ---------------------------------------------------------
    detectOcr: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        // Lấy JWT Token từ localStorage (Đảm bảo key lưu token của bạn là 'token' hoặc đổi lại cho đúng)
        const token = localStorage.getItem('token');

        const response = await api.post('/ekyc/ocr', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
        });

        return response.data;
    },

    // ---------------------------------------------------------
    // Hàm gọi API Xác thực khuôn mặt và lưu hồ sơ (Dùng cho Bước 6)
    // ---------------------------------------------------------
    verifyFace: async (cccdFile, selfieFile, ocrDataJson) => {
        const formData = new FormData();

        // Tên các key này BẮT BUỘC phải khớp với @RequestParam trong EkycController.java của Backend
        formData.append('cccd_image', cccdFile);
        formData.append('selfie_image', selfieFile);

        // Backend yêu cầu nhận dữ liệu chữ dưới dạng JSON String
        formData.append('cccd_data_json', JSON.stringify(ocrDataJson));

        const token = localStorage.getItem('token');

        const response = await api.post('/ekyc/verify', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
        });

        return response.data;
    }
};