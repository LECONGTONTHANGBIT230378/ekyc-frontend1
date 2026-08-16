import React, { useState, useEffect } from 'react';
import ImageUpload from '../../../components/Form/ImageUpload.jsx';
import styles from './Step2Upload.module.css';

const Step2Upload = ({ onNext, onPrev, initialData }) => {
    // Chỉ cần các trường front và frontFile để lưu ảnh mặt trước
    const [images, setImages] = useState({
        front: initialData?.front || null,
        frontFile: initialData?.frontFile || null,
    });

    useEffect(() => {
        setImages({
            front: initialData?.front || null,
            frontFile: initialData?.frontFile || null,
        });
    }, [initialData]);

    const handleUpload = (field, url, file) => {
        setImages(prev => ({
            ...prev,
            [field]: url,
            [`${field}File`]: file
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext({ cccdImages: images });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Tải lên Căn cước công dân (CCCD)</h2>
                <p>Vui lòng cung cấp ảnh chụp mặt trước của thẻ CCCD bản gốc.</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.formWrapper}>
                <div className={styles.contentGrid}>
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

                    <div className={styles.rightColumn}>
                        {/* Chỉ hiển thị một ImageUpload cho mặt trước */}
                        <ImageUpload
                            label="Mặt trước CCCD"
                            hint="Kéo thả hoặc chọn ảnh PNG/JPG"
                            image={images.front}
                            onUpload={(url, file) => handleUpload('front', url, file)}
                            onRemove={() => handleUpload('front', null, null)}
                        />
                    </div>
                </div>

                <div className={styles.actionGroup}>
                    <button type="button" className={styles.backBtn} onClick={onPrev}>Quay lại</button>
                    <button
                        type="submit"
                        className={styles.nextBtn}
                        // Khóa nút nếu chưa có file vật lý của mặt trước
                        disabled={!images.frontFile}
                    >
                        Tiếp tục ›
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step2Upload;