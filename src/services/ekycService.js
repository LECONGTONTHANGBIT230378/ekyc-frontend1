// src/services/ekycService.js
import api from './api';

export const ekycService = {
    // ---------------------------------------------------------
    // Hàm gọi API nhận diện OCR (Dùng cho Bước 3)
    // ---------------------------------------------------------
    detectOcr: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        // KHÔNG CẦN tự lấy Token ở đây nữa, api.js đã có Interceptor tự động gắn
        const response = await api.post('/ekyc/ocr', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });

        return response.data;
    },

    // ---------------------------------------------------------
    // Hàm gọi API Xác thực khuôn mặt và lưu hồ sơ (Dùng cho Bước 6)
    // ---------------------------------------------------------
    verifyFace: async (cccdFile, selfieFile, ocrDataJson, customerId) => {
        const formData = new FormData();

        // 1. TRUYỀN ID KHÁCH HÀNG: Khớp với @RequestParam("customer_id") ở Backend
        formData.append('customer_id', customerId);

        // 2. DỮ LIỆU FILE VÀ OCR: Khớp với các @RequestParam ở Backend
        formData.append('cccd_image', cccdFile);
        formData.append('selfie_image', selfieFile);
        formData.append('cccd_data_json', JSON.stringify(ocrDataJson));

        // KHÔNG CẦN tự lấy Token ở đây nữa
        const response = await api.post('/ekyc/verify', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });

        return response.data;
    }
};