import React from 'react';
import styles from './InputField.module.css';

const InputField = ({
                        label,
                        type = 'text',
                        name,
                        value,
                        onChange,
                        required = false,
                        disabled = false,
                        readOnly = false,
                        error // ĐÃ THÊM: Biến nhận thông báo lỗi từ component cha
                    }) => {
    return (
        <div className={styles.inputGroup}>
            {label && (
                <label className={styles.label}>
                    {label} {required && <span className={styles.required}style={{ color: '#E53E3E', marginLeft: '4px' }}>*</span>}
                </label>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                className={`${styles.input} ${disabled ? styles.disabledInput : ''}`}
                // ĐÃ THÊM: Đổi màu viền thành đỏ nếu có lỗi
                style={error ? { borderColor: '#d32f2f', outlineColor: '#d32f2f' } : {}}
            />
            {/* ĐÃ THÊM: Hiển thị dòng chữ lỗi màu đỏ ngay dưới ô input */}
            {error && (
                <span style={{ color: '#d32f2f', fontSize: '12px', marginTop: '6px', display: 'block', fontWeight: '500' }}>
                    ! {error}
                </span>
            )}
        </div>
    );
};

export default InputField;