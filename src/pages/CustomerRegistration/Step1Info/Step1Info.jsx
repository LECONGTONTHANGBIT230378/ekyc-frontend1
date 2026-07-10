import React, { useState } from 'react';
import InputField from '../../../components/Form/InputField';
import TextAreaField from '../../../components/Form/TextAreaField';
import ImageUpload from '../../../components/Form/ImageUpload';
import styles from './Step1Info.module.css';

// 1. HÀM TẠO MÃ KHÁCH HÀNG TỰ ĐỘNG & DUY NHẤT
const generateCustomerId = () => {
    const timestamp = Date.now().toString().slice(-6); // Lấy 6 số cuối của thời gian hiện tại
    const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase(); // Lấy 3 ký tự ngẫu nhiên
    return `CUS-${timestamp}${randomStr}`; // Ví dụ kết quả: CUS-123456ABC
};

const Step1Info = ({ onNext, initialData }) => {
    const [formData, setFormData] = useState({
        // Nếu đã có mã (do quay lại từ bước 2) thì giữ nguyên, nếu chưa có (lần đầu vào) thì tự tạo mới
        customerId: initialData?.customerId || generateCustomerId(),
        fullName: initialData?.fullName || '',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        notes: initialData?.notes || '',
        frontImage: initialData?.frontImage || null,
        backImage: initialData?.backImage || null,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpload = (field, url) => {
        setFormData({ ...formData, [field]: url });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext({ combinedData: formData });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Đăng ký khách hàng mới</h2>
                <p>Bắt đầu tạo hồ sơ với thông tin cơ bản. (Có thể bỏ trống phần hình ảnh để tải lên ở bước sau)</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.formWrapper}>
                <div className={styles.contentGrid}>

                    {/* CỘT TRÁI: THÔNG TIN TEXT */}
                    <div className={styles.leftColumn}>
                        <div className={styles.row}>
                            {/* 2. THÊM THUỘC TÍNH disabled ĐỂ KHÓA Ô MÃ KHÁCH HÀNG */}
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

                    {/* CỘT PHẢI: UPLOAD ẢNH MẶT TRƯỚC VÀ MẶT SAU */}
                    <div className={styles.rightColumn}>
                        <ImageUpload
                            label="Mặt trước CCCD (Tùy chọn)"
                            hint="Kéo thả hoặc chọn ảnh PNG/JPG tối đa 10MB"
                            image={formData.frontImage}
                            onUpload={(url) => handleUpload('frontImage', url)}
                            onRemove={() => handleUpload('frontImage', null)}
                        />
                        <ImageUpload
                            label="Mặt sau CCCD (Tùy chọn)"
                            hint="Kéo thả hoặc chọn ảnh PNG/JPG tối đa 10MB"
                            image={formData.backImage}
                            onUpload={(url) => handleUpload('backImage', url)}
                            onRemove={() => handleUpload('backImage', null)}
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