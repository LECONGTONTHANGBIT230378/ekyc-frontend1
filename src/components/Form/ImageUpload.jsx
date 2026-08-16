import React, { useRef } from 'react';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import styles from './ImageUpload.module.css';

const ImageUpload = ({ label, hint, image, onUpload, onRemove }) => {
    const inputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            // SỬA LỖI Ở ĐÂY: Truyền cả imageUrl và đối tượng file gốc lên component cha
            onUpload(imageUrl, file);
        }
    };

    return (
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
    );
};

export default ImageUpload;