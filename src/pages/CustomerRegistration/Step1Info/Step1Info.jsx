import React, { useState } from 'react';
import InputField from '../../../components/Form/InputField';
import TextAreaField from '../../../components/Form/TextAreaField';
import ImageUpload from '../../../components/Form/ImageUpload';
import { customerService } from '../../../services/customerService';
import styles from './Step1Info.module.css';

const generateCustomerId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `CUS-${timestamp}${randomStr}`;
};

const Step1Info = ({ onNext, initialData }) => {
    const [formData, setFormData] = useState({
        customerId: initialData?.customerId || generateCustomerId(),
        fullName: initialData?.fullName || '',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        notes: initialData?.notes || '',
        frontImage: initialData?.frontImage || null,
        frontFile: initialData?.frontFile || null,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpload = (field, url, file) => {
        setFormData({
            ...formData,
            [field]: url,
            [`${field.replace('Image', 'File')}`]: file
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const payload = new FormData();

            // Map tên biến chính xác với @RequestParam của Spring Boot
            payload.append('fullName', formData.fullName);
            payload.append('phone', formData.phone);

            if (formData.email) payload.append('email', formData.email);
            if (formData.notes) payload.append('note', formData.notes); // React: notes -> Java: note

            // Nếu có upload file mặt trước CCCD
            if (formData.frontFile) {
                payload.append('fileFront', formData.frontFile); // React: frontFile -> Java: fileFront
            }

            // Gọi API
            const res = await customerService.createCustomer(payload);

            // Xử lý logic check response dựa theo cấu trúc ApiResponse của Spring Boot
            if (res && (res.code === 200 || res.success === true)) {
                // Lấy ID thật từ Database trả về để gán cho các bước sau
                const savedCustomerId = res.data?.id;

                // Chuyển sang Bước 2, mang theo data và ID của Backend
                onNext({
                    combinedData: {
                        ...formData,
                        dbId: savedCustomerId
                    }
                });
            } else {
                setError(res.message || 'Có lỗi xảy ra từ máy chủ, vui lòng thử lại.');
            }
        } catch (err) {
            // Xử lý lỗi validation từ Spring Boot (VD: Sai regex SĐT, email)
            const errorMessage =
                err.response?.data?.message ||
                err.response?.data?.data || // Đôi khi lỗi validation danh sách được Spring Boot đẩy vào data
                'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.';

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Đăng ký khách hàng mới</h2>
                <p>Bắt đầu tạo hồ sơ với thông tin cơ bản. (Có thể bỏ trống phần hình ảnh để tải lên ở bước sau)</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.formWrapper}>
                {/* HIỂN THỊ LỖI NẾU CÓ */}
                {error && (
                    <div style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
                        {error}
                    </div>
                )}

                <div className={styles.contentGrid}>
                    <div className={styles.leftColumn}>
                        <div className={styles.row}>
                            <InputField
                                label="Mã khách hàng (Tự động)"
                                name="customerId"
                                value={formData.customerId}
                                onChange={handleChange}
                                disabled={true}
                                readOnly={true}
                            />
                            <InputField label="Họ và tên" name="fullName" value={formData.fullName} onChange={handleChange} required />
                        </div>
                        <div className={styles.row}>
                            <InputField label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} required />
                            <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className={styles.fullWidth}>
                            <TextAreaField label="Ghi chú" name="notes" value={formData.notes} onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.rightColumn}>
                        <ImageUpload
                            label="Mặt trước CCCD (Tùy chọn)"
                            hint="Kéo thả hoặc chọn ảnh PNG/JPG tối đa 10MB"
                            image={formData.frontImage}
                            onUpload={(url, file) => handleUpload('frontImage', url, file)}
                            onRemove={() => handleUpload('frontImage', null, null)}
                        />
                    </div>
                </div>

                <div className={styles.actionGroup}>
                    <button type="button" className={styles.cancelBtn}>Hủy</button>
                    <button
                        type="submit"
                        className={styles.nextBtn}
                        disabled={!formData.fullName || !formData.phone || loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Tiếp tục ›'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step1Info;