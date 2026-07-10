import React from 'react';
import styles from './InputField.module.css'; // Dùng chung CSS với InputField cho đồng bộ

const TextAreaField = ({ label, name, value, onChange, placeholder, required, rows = 5 }) => {
    return (
        <div className={styles.wrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={styles.input}
                rows={rows}
                style={{ resize: 'vertical', height: 'auto', padding: '12px 16px' }}
            />
        </div>
    );
};

export default TextAreaField;