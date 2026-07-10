import React from 'react';
import styles from './InputField.module.css'; // (Hoặc đường dẫn CSS bạn đang dùng)

const InputField = ({
                        label,
                        type = 'text',
                        name,
                        value,
                        onChange,
                        required = false,
                        disabled = false, // Thêm biến nhận lệnh khóa
                        readOnly = false  // Thêm biến nhận lệnh chỉ đọc
                    }) => {
    return (
        <div className={styles.inputGroup}>
            {label && (
                <label className={styles.label}>
                    {label} {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled} // TRUYỀN LỆNH XUỐNG THẺ INPUT
                readOnly={readOnly} // TRUYỀN LỆNH XUỐNG THẺ INPUT
                className={`${styles.input} ${disabled ? styles.disabledInput : ''}`}
            />
        </div>
    );
};

export default InputField;