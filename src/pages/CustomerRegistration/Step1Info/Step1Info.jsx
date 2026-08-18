import React, { useState } from 'react';
import InputField from '../../../components/Form/InputField';
import ImageUpload from '../../../components/Form/ImageUpload';
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
        frontImage: initialData?.frontImage || null,
        frontFile: initialData?.frontFile || null,
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Không gọi API, chỉ chuyển dữ liệu vào State tổng của CustomerRegistration
        onNext({
            combinedData: formData
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Đăng ký khách hàng mới</h2>
                <p>Bắt đầu tạo hồ sơ với thông tin cơ bản. (Có thể bỏ trống phần hình ảnh để tải lên ở bước sau)</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.formWrapper}>
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
                        disabled={!formData.fullName || !formData.phone}
                    >
                        Tiếp tục ›
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step1Info;