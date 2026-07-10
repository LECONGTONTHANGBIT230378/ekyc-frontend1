import React, { useState, useEffect } from 'react';
import ImageUpload from '../../../components/Form/ImageUpload.jsx';
import styles from './Step2Upload.module.css';

const Step2Upload = ({ onNext, onPrev, initialData }) => {
    // Lưu trữ ảnh mặt trước và mặt sau (Nhận dữ liệu khởi tạo từ Bước 1 hoặc Bước 2 truyền sang)
    const [images, setImages] = useState({
        front: initialData?.front || null,
        back: initialData?.back || null,
    });

    // Hook này giúp đồng bộ dữ liệu ảnh ngay lập tức nếu người dùng lùi về Bước 1 sửa ảnh và đi tới lại Bước 2
    useEffect(() => {
        setImages({
            front: initialData?.front || null,
            back: initialData?.back || null,
        });
    }, [initialData]);

    const handleUpload = (field, url) => {
        setImages({ ...images, [field]: url });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext({ cccdImages: images }); // Chuyển dữ liệu ảnh sang bước 3
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Tải lên Căn cước công dân (CCCD)</h2>
                <p>Vui lòng cung cấp ảnh chụp mặt trước và mặt sau của thẻ CCCD bản gốc.</p>
            </div>

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
                            onUpload={(url) => handleUpload('front', url)}
                            onRemove={() => handleUpload('front', null)}
                        />
                        <ImageUpload
                            label="Mặt sau CCCD"
                            hint="Kéo thả hoặc chọn ảnh PNG/JPG"
                            image={images.back}
                            onUpload={(url) => handleUpload('back', url)}
                            onRemove={() => handleUpload('back', null)}
                        />
                    </div>
                </div>

                <div className={styles.actionGroup}>
                    <button type="button" className={styles.backBtn} onClick={onPrev}>Quay lại</button>
                    <button
                        type="submit"
                        className={styles.nextBtn}
                        disabled={!images.front || !images.back} /* Khóa nút nếu chưa có đủ 2 mặt */
                    >
                        Tiếp tục ›
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step2Upload;