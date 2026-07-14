import React, { useState } from 'react';
import InputField from '../../../components/Form/InputField';
import TextAreaField from '../../../components/Form/TextAreaField';
import ImageUpload from '../../../components/Form/ImageUpload';
import styles from './Step1Info.module.css';

// 1. IMPORT SERVICE GỌI API (Đảm bảo bạn đã tạo file customerService.js)
import { customerService } from '../../../services/customerService';

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
        backImage: initialData?.backImage || null,
        // Thêm biến này để lưu ID thật do Database cấp sau khi đăng ký thành công
        dbId: initialData?.dbId || null,
    });

    // 2. THÊM STATE QUẢN LÝ LỖI VÀ TRẠNG THÁI CHỜ
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpload = (field, url) => {
        setFormData({ ...formData, [field]: url });
    };

    // 3. LOGIC XỬ LÝ KHI ẤN "TIẾP TỤC" ĐỂ GỌI API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            let currentDbId = formData.dbId;

            // Nếu đã có dbId (quay lại từ bước 2 để sửa thông tin) -> Gọi API Cập nhật
            if (currentDbId) {
                await customerService.updateCustomer(currentDbId, formData);
            }
            // Nếu chưa có dbId (Lần đầu đăng ký) -> Gọi API Tạo mới
            else {
                const res = await customerService.registerCustomer(formData);
                // Lấy ID thật từ Backend (Tùy cấu trúc của bạn, có thể là res.data.id hoặc res.id)
                currentDbId = res.data?.id || res.data?.customer?.id || res.id;
            }

            // Gắn dbId thật vào formData để mang sang các bước tiếp theo
            const updatedData = { ...formData, dbId: currentDbId };

            // Chuyển sang Bước 2
            onNext({ combinedData: updatedData });

        } catch (err) {
            setError(err.message || 'Lỗi kết nối máy chủ. Không thể lưu hồ sơ!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Đăng ký khách hàng mới</h2>
                <p>Bắt đầu tạo hồ sơ với thông tin cơ bản. (Có thể bỏ trống phần hình ảnh để tải lên ở bước sau)</p>
            </div>

            {/* HIỂN THỊ THÔNG BÁO LỖI NẾU API THẤT BẠI */}
            {error && (
                <div style={{ color: '#DC2626', backgroundColor: '#FEF2F2', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #FEE2E2', fontSize: '14px' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.formWrapper}>
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
                    <button type="button" className={styles.cancelBtn} disabled={isLoading}>Hủy</button>
                    <button
                        type="submit"
                        className={styles.nextBtn}
                        // Khóa nút nếu chưa điền Tên/SĐT hoặc đang chờ API gọi về
                        disabled={!formData.fullName || !formData.phone || isLoading}
                    >
                        {isLoading ? 'Đang lưu hồ sơ...' : 'Tiếp tục ›'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step1Info;