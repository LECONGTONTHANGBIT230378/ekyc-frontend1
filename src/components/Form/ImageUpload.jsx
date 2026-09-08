import React, { useRef, useState } from 'react';
import { FiUploadCloud, FiX, FiAlertTriangle } from 'react-icons/fi';
import styles from './ImageUpload.module.css';

const ImageUpload = ({ label, hint, image, onUpload, onRemove }) => {
    const inputRef = useRef(null);
    const [showSizeError, setShowSizeError] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const maxSize = 10 * 1024 * 1024;

            if (file.size > maxSize) {
                setShowSizeError(true);
                e.target.value = null;
                return;
            }

            const imageUrl = URL.createObjectURL(file);
            onUpload(imageUrl, file);
        }
    };

    const handleReupload = () => {
        setShowSizeError(false);
        inputRef.current.click();
    };

    return (
        <>
            <div className={styles.uploadZone} onClick={() => !image && inputRef.current.click()}>
                <input
                    type="file"
                    accept="image/jpeg, image/png"
                    className={styles.hiddenInput}
                    ref={inputRef}
                    onChange={handleFileChange}
                />

                {image ? (
                    <div className={styles.previewContainer}>
                        <img src={image} alt={label} className={styles.previewImg} />
                        <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        >
                            <FiX />
                        </button>
                    </div>
                ) : (
                    <div className={styles.placeholder}>
                        <FiUploadCloud className={styles.uploadIcon} />
                        <h4 className={styles.uploadTitle}>{label}</h4>
                        <span className={styles.uploadHint}>{hint}</span>
                        <div className={styles.fakeBtn}>Chọn ảnh</div>
                    </div>
                )}
            </div>

            {/* MODAL CẢNH BÁO ĐÃ SỬ DỤNG CLASS TỪ CSS MODULE */}
            {showSizeError && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <div className={styles.iconBox}>
                            <FiAlertTriangle size={32} />
                        </div>
                        <h3 className={styles.title}>Ảnh quá giới hạn</h3>
                        <p className={styles.text}>
                            Kích thước tệp hình ảnh không được vượt quá <b>10MB</b>. Vui lòng chọn một hình ảnh khác hoặc nén ảnh lại trước khi tải lên.
                        </p>
                        <div className={styles.buttonGroup}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => setShowSizeError(false)}
                            >
                                Đóng
                            </button>
                            <button
                                className={styles.reuploadBtn}
                                onClick={handleReupload}
                            >
                                Tải lại ảnh khác
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageUpload;