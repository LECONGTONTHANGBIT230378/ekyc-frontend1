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

    // ĐÃ SỬA: Chỉ nhận 2 ảnh để gửi lên AI
    verifyFace: async (cccdFile, selfieFile) => {
        const formData = new FormData();
        formData.append('cccd_image', cccdFile);
        formData.append('selfie_image', selfieFile);

        const response = await api.post('/ekyc/verify', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    }
};