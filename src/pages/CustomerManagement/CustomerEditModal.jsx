import React, { useState, useEffect } from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import { customerService } from '../../services/customerService';

const CustomerEditModal = ({ customer, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: ''
    });

    // THÊM MỚI: State quản lý lỗi hiển thị dưới từng ô input
    const [errors, setErrors] = useState({
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

    // HÀM KIỂM TRA ĐỊNH DẠNG (Real-time Validation)
    const validateField = (name, value) => {
        let errorMsg = '';
        if (name === 'fullName' && value.trim() === '') {
            errorMsg = 'Họ và tên không được để trống.';
        }
        if (name === 'phone' && value.trim() !== '') {
            const phoneRegex = /^0\d{9}$/;
            if (!phoneRegex.test(value)) {
                errorMsg = 'Số điện thoại phải gồm 10 số và bắt đầu bằng số 0.';
            }
        }
        if (name === 'email' && value.trim() !== '') {
            const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
            if (!gmailRegex.test(value)) {
                errorMsg = 'Vui lòng nhập đúng địa chỉ có đuôi @gmail.com.';
            }
        }
        return errorMsg;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Kiểm tra lỗi ngay khi người dùng gõ
        const errorMsg = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: errorMsg }));

        if (notification.message) {
            setNotification({ type: '', message: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra lại toàn bộ trước khi Submit
        const fullNameError = validateField('fullName', formData.fullName);
        const phoneError = validateField('phone', formData.phone);
        const emailError = validateField('email', formData.email);

        if (fullNameError || phoneError || emailError) {
            setErrors({
                fullName: fullNameError,
                phone: phoneError,
                email: emailError
            });
            return; // Dừng lại, không submit
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
            // Hiển thị lỗi từ API trả về (ví dụ: lỗi trùng số điện thoại)
            setNotification({
                type: 'error',
                message: error.response?.data?.message || 'Cập nhật thất bại. Vui lòng kiểm tra lại!'
            });
            setSubmitting(false);
        }
    };

    // Kiểm tra xem form có đang dính lỗi nào không để disable nút Submit
    const hasValidationError = !!errors.fullName || !!errors.phone || !!errors.email || !formData.fullName.trim();

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

                {/* THÊM noValidate để chặn popup mặc định của trình duyệt */}
                <form onSubmit={handleSubmit} style={styles.form} noValidate>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Họ và tên <span style={styles.required}>*</span></label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            style={{
                                ...styles.input,
                                borderColor: errors.fullName ? '#ef4444' : '#d1d5db'
                            }}
                            placeholder="Nhập họ và tên"
                        />
                        {errors.fullName && (
                            <span style={styles.errorText}>
                                <FiAlertCircle /> {errors.fullName}
                            </span>
                        )}
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Số điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            style={{
                                ...styles.input,
                                borderColor: errors.phone ? '#ef4444' : '#d1d5db'
                            }}
                            placeholder="Ví dụ: 0912345678"
                        />
                        {errors.phone && (
                            <span style={styles.errorText}>
                                <FiAlertCircle /> {errors.phone}
                            </span>
                        )}
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={{
                                ...styles.input,
                                borderColor: errors.email ? '#ef4444' : '#d1d5db'
                            }}
                            placeholder="ví dụ: khachhang@gmail.com"
                        />
                        {errors.email && (
                            <span style={styles.errorText}>
                                <FiAlertCircle /> {errors.email}
                            </span>
                        )}
                    </div>

                    <div style={styles.actions}>
                        <button type="button" onClick={onClose} style={styles.cancelBtn} disabled={submitting}>
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            style={{
                                ...styles.submitBtn,
                                opacity: hasValidationError ? 0.6 : 1,
                                cursor: hasValidationError ? 'not-allowed' : 'pointer'
                            }}
                            disabled={submitting || hasValidationError}
                        >
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
        backgroundColor: 'rgba(15, 23, 42, 0.4)', // Đổi màu mờ đi một chút cho giống AccountModal
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
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        fontFamily: 'inherit'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '12px'
    },
    title: {
        margin: 0,
        fontSize: '16px',
        color: '#1e293b',
        fontWeight: '700'
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#9ca3af',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
        fontSize: '20px'
    },
    notification: {
        padding: '10px',
        marginBottom: '16px',
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
        gap: '4px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#475569'
    },
    required: {
        color: '#ef4444'
    },
    input: {
        padding: '10px 16px',
        borderRadius: '8px',
        border: '1px solid #d1d5db',
        fontSize: '14px',
        outline: 'none',
        color: '#1e293b',
        boxSizing: 'border-box',
        transition: '0.2s'
    },
    errorText: {
        fontSize: '12px',
        color: '#ef4444',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginTop: '2px'
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        marginTop: '8px',
        paddingTop: '16px',
        borderTop: '1px solid #e2e8f0'
    },
    cancelBtn: {
        padding: '10px 20px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        color: '#475569',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    submitBtn: {
        padding: '10px 24px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#2563eb',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '600',
        transition: '0.2s'
    }
};

export default CustomerEditModal;