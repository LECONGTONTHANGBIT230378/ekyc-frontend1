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

    // ====================================================================
    // ĐÃ SỬA: Biến lỗi thành một Object chứa lỗi riêng cho từng ô
    // ====================================================================
    const [errors, setErrors] = useState({
        phone: '',
        email: '',
        fullName: ''
    });

    // Hàm kiểm tra lỗi dùng chung
    const validateField = (name, value) => {
        let errorMsg = '';
        const valStr = value.trim();

        if (name === 'phone') {
            const phoneRegex = /^0\d{9}$/;
            if (valStr && !phoneRegex.test(valStr)) {
                errorMsg = 'Số điện thoại phải gồm đúng 10 số và bắt đầu bằng số 0.';
            }
        }
        if (name === 'email') {
            const emailValue = valStr.toLowerCase();
            if (emailValue && !emailValue.endsWith('@gmail.com')) {
                errorMsg = 'Email không hợp lệ. Vui lòng nhập đuôi @gmail.com.';
            }
        }
        return errorMsg;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Real-time: Gõ đến đâu, xóa lỗi (hoặc báo lỗi mới) đến đó
        const errorMsg = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: errorMsg }));
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

        // Kiểm tra lại lần cuối toàn bộ các trường trước khi sang Bước 2
        const phoneError = validateField('phone', formData.phone);
        const emailError = validateField('email', formData.email);

        // Bắt lỗi bỏ trống (do ta đã tắt Required của HTML5)
        const fullNameError = !formData.fullName.trim() ? 'Vui lòng nhập họ và tên.' : '';
        const emptyPhoneError = !formData.phone.trim() ? 'Vui lòng nhập số điện thoại.' : phoneError;
        const emptyEmailError = !formData.email.trim() ? 'Vui lòng nhập email.' : emailError;

        if (fullNameError || emptyPhoneError || emptyEmailError) {
            setErrors({
                fullName: fullNameError,
                phone: emptyPhoneError,
                email: emptyEmailError
            });
            return; // Khóa lại, không cho đi tiếp
        }

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

            {/* ĐÃ SỬA: Thêm thuộc tính noValidate để tắt popup báo lỗi xấu xí của trình duyệt */}
            <form onSubmit={handleSubmit} className={styles.formWrapper} noValidate>

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
                            {/* Truyền biến lỗi vào từng ô */}
                            <InputField
                                label="Họ và tên" name="fullName"
                                value={formData.fullName} onChange={handleChange} required
                                error={errors.fullName}
                            />
                        </div>
                        <div className={styles.row}>
                            <InputField
                                label="Số điện thoại" name="phone"
                                value={formData.phone} onChange={handleChange} required
                                error={errors.phone}
                            />
                            <InputField
                                label="Email" type="email" name="email"
                                value={formData.email} onChange={handleChange} required
                                error={errors.email}
                            />
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
                    >
                        Tiếp tục ›
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step1Info;