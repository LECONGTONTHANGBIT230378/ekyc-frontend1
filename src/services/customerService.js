import api from './api';

export const customerService = {
    createCustomer: async (formDataPayload) => {
        const response = await api.post('/customers', formDataPayload, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // THÊM API MỚI CHO BƯỚC 7
    registerFullCustomer: async (formDataPayload) => {
        const response = await api.post('/customers/register-full', formDataPayload, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    getAllCustomers: async (params) => {
        let url = '/customers';
        if (params && params.keyword && params.keyword.trim() !== '') {
            url = `/customers/search?keyword=${encodeURIComponent(params.keyword.trim())}`;
        }
        const response = await api.get(url);
        return response.data;
    },

    getCustomerById: async (id) => {
        const response = await api.get(`/customers/${id}`);
        return response.data;
    },

    updateCustomer: async (id, data) => {
        const response = await api.put(`/customers/${id}`, data);
        return response.data;
    },

    deleteCustomer: async (id) => {
        const response = await api.delete(`/customers/${id}`);
        return response.data;
    }
};