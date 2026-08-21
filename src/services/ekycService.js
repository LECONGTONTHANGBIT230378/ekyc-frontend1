import api from './api';

export const ekycService = {
    detectOcr: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/ekyc/ocr', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    // ĐÃ SỬA: Nhận thêm cccdNumber và đóng gói vào form để gửi xuống Backend
    verifyFace: async (cccdFile, selfieFile, cccdNumber) => {
        const formData = new FormData();
        formData.append('cccd_image', cccdFile);
        formData.append('selfie_image', selfieFile);

        // ĐÃ THÊM: Bắt số CCCD và nhét vào hộp hàng (nếu có)
        if (cccdNumber) {
            formData.append('cccd_number', cccdNumber);
        }

        const response = await api.post('/ekyc/verify', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    }
};