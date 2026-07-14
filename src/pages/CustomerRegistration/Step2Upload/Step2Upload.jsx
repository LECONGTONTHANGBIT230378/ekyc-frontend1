import React, { useState, useEffect } from 'react';
import ImageUpload from '../../../components/Form/ImageUpload.jsx';
import styles from './Step2Upload.module.css';
// 1. IMPORT SERVICE GỌI API
import { customerService } from '../../../services/customerService';

const Step2Upload = ({ onNext, onPrev, initialData }) => {
    // Lưu trữ ảnh mặt trước và mặt sau
    const [images, setImages] = useState({
        front: initialData?.front || null,
        back: initialData?.back || null,
    });

    // 2. THÊM STATE ĐỂ QUẢN LÝ LỖI VÀ TRẠNG THÁI CHỜ KHI GỌI API
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setImages({
            front: initialData?.front || null,
            back: initialData?.back || null,
        });
    }, [initialData]);

    const handleUpload = (field, file) => {
        setImages({ ...images, [field]: file });
        // Xóa thông báo lỗi cũ nếu người dùng bắt đầu chọn lại ảnh
        if (error) setError('');
    };

    // 3. CẬP NHẬT HÀM SUBMIT ĐỂ BẮN API LÊN BACKEND
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Lấy ID thật sự của khách hàng từ Bước 1 truyền sang
        const customerDbId = initialData?.dbId;

        // Nếu không có ID (do lỗi luồng), chặn không cho gọi API
        if (!customerDbId) {
            setError('Lỗi hệ thống: Không tìm thấy ID hồ sơ khách hàng. Vui lòng quay lại Bước 1.');
            return;
        }

        setIsLoading(true);

        try {
            // Gọi hàm Upload từ customerService (đã dùng FormData multipart/form-data)
            await customerService.uploadCccdImages(customerDbId, images.front, images.back);

            // Tải lên Backend thành công -> Chuyển dữ liệu ảnh sang bước 3 (OCR)
            onNext({ cccdImages: images });
        } catch (err) {
            // Hiển thị lỗi nếu tải ảnh thất bại
            setError(err.message || 'Lỗi tải ảnh. Vui lòng kiểm tra lại định dạng hoặc dung lượng file!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Tải lên Căn cước công dân (CCCD)</h2>
                <p>Vui lòng cung cấp ảnh chụp mặt trước và mặt sau của thẻ CCCD bản gốc.</p>
            </div>

            {/* 4. HIỂN THỊ THÔNG BÁO LỖI NẾU API THẤT BẠI */}
            {error && (
                <div style={{ color: '#DC2626', backgroundColor: '#FEF2F2', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #FEE2E2', fontSize: '14px' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.formWrapper}>
                <div className={styles.contentGrid}>

                    {/* CỘT TRÁI: HƯỚNG DẪN / YÊU CẦU */}
                    <div className={styles.leftColumn}>
                        <h3 className={styles.sectionTitle}>Yêu cầu hình ảnh</h3>
                        <ul className={styles.guidelineList}>
                            <li>Sử dụng thẻ CCCD/CMND bản gốc, còn hạn sử dụng.</li>
                            <li>Không dùng ảnh photocopy, đen trắng hoặc chụp lại qua màn hình.</li>
                            <li>Đảm bảo môi trường đủ sáng, ảnh rõ nét, không bị lóa.</li>
                            <li>Ảnh chụp phải lấy đủ 4 góc của thẻ, không bị cắt xén.</li>
                        </ul>
                        <div className={styles.noteBox}>
                            <strong>Lưu ý:</strong> Dữ liệu trên thẻ của bạn sẽ được hệ thống AI quét và tự động trích xuất ở bước tiếp theo.
                        </div>
                    </div>

                    {/* CỘT PHẢI: KHU VỰC TẢI ẢNH */}
                    <div className={styles.rightColumn}>
                        <ImageUpload
                            label="Mặt trước CCCD"
                            hint="Kéo thả hoặc chọn ảnh PNG/JPG"
                            image={images.front}
                            onUpload={(file) => handleUpload('front', file)}
                            onRemove={() => handleUpload('front', null)}
                        />
                        <ImageUpload
                            label="Mặt sau CCCD"
                            hint="Kéo thả hoặc chọn ảnh PNG/JPG"
                            image={images.back}
                            onUpload={(file) => handleUpload('back', file)}
                            onRemove={() => handleUpload('back', null)}
                        />
                    </div>
                </div>

                <div className={styles.actionGroup}>
                    {/* Khóa nút quay lại khi đang tải ảnh lên */}
                    <button type="button" className={styles.backBtn} onClick={onPrev} disabled={isLoading}>
                        Quay lại
                    </button>
                    <button
                        type="submit"
                        className={styles.nextBtn}
                        // Khóa nút nếu chưa có đủ 2 mặt hoặc đang chờ API gọi về
                        disabled={!images.front || !images.back || isLoading}
                    >
                        {isLoading ? 'Đang tải ảnh lên...' : 'Tiếp tục ›'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step2Upload;