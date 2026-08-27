import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { customerService } from '../../services/customerService';

const CustomerEditModal = ({ customer, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState({ type: '', message: '' });

    useEffect(() => {
        if (customer) {
            setFormData({
                fullName: customer.fullName || '',
                phone: customer.phone || '',
                email: customer.email || ''
            });
        }
    }, [customer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (notification.message) {
            setNotification({ type: '', message: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- VALIDATE SỐ ĐIỆN THOẠI ---
        const phoneRegex = /^0\d{9}$/;
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            setNotification({
                type: 'error',
                message: 'Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 số và bắt đầu bằng số 0.'
            });
            return;
        }

        // ==========================================
        // ĐÃ THÊM: VALIDATE EMAIL BẮT BUỘC ĐUÔI @GMAIL.COM
        // ==========================================
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (formData.email && !gmailRegex.test(formData.email)) {
            setNotification({
                type: 'error',
                message: 'Định dạng Email không hợp lệ! Vui lòng nhập địa chỉ có đuôi @gmail.com.'
            });
            return; // Dừng lại, không cho phép bấm lưu
        }

        setSubmitting(true);
        setNotification({ type: '', message: '' });

        try {
            const customerId = customer.id || customer.customer_id;
            await customerService.updateCustomer(customerId, formData);

            setNotification({ type: 'success', message: 'Cập nhật thông tin khách hàng thành công!' });

            setTimeout(() => {
                if (onSuccess) onSuccess();
                if (onClose) onClose();
            }, 1500);

        } catch (error) {
            console.error("Lỗi khi cập nhật khách hàng:", error);
            setNotification({ type: 'error', message: 'Cập nhật thất bại. Vui lòng kiểm tra lại!' });
            setSubmitting(false);
        }
    };

    if (!customer) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h3 style={styles.title}>Chỉnh sửa hồ sơ (#{customer.id || customer.customer_id})</h3>
                    <button onClick={onClose} style={styles.closeBtn}>
                        <FiX size={20} />
                    </button>
                </div>

                {notification.message && (
                    <div style={{
                        ...styles.notification,
                        backgroundColor: notification.type === 'success' ? '#ecfdf5' : '#fef2f2',
                        color: notification.type === 'success' ? '#065f46' : '#991b1b',
                        border: `1px solid ${notification.type === 'success' ? '#34d399' : '#f87171'}`
                    }}>
                        {notification.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Họ và tên <span style={styles.required}>*</span></label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="Nhập họ và tên"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Số điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Ví dụ: 0912345678"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="ví dụ: khachhang@gmail.com"
                        />
                    </div>

                    <div style={styles.actions}>
                        <button type="button" onClick={onClose} style={styles.cancelBtn} disabled={submitting}>
                            Hủy bỏ
                        </button>
                        <button type="submit" style={styles.submitBtn} disabled={submitting}>
                            {submitting ? "Đang xử lý..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(2px)'
    },
    modal: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '450px',
        padding: '24px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        fontFamily: 'inherit'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid #f3f4f6',
        paddingBottom: '12px'
    },
    title: {
        margin: 0,
        fontSize: '18px',
        color: '#111827',
        fontWeight: '600'
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#9ca3af',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px'
    },
    notification: {
        padding: '12px',
        marginBottom: '20px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        textAlign: 'center',
        transition: 'all 0.3s ease'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#4b5563'
    },
    required: {
        color: '#ef4444'
    },
    input: {
        padding: '10px 12px',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        fontSize: '14px',
        outline: 'none',
        color: '#1f2937',
        boxSizing: 'border-box'
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        marginTop: '20px'
    },
    cancelBtn: {
        padding: '8px 16px',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        backgroundColor: '#ffffff',
        color: '#374151',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer'
    },
    submitBtn: {
        padding: '8px 16px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: '#2563eb',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer'
    }
};

export default CustomerEditModal;