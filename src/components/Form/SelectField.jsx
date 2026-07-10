import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
// Tái sử dụng CSS của InputField cho đồng bộ giao diện
import styles from './InputField.module.css';

const SelectField = ({ label, name, value, onChange, options, required }) => {
    return (
        <div className={styles.wrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.inputContainer}>
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={styles.input}
                    style={{ appearance: 'none', cursor: 'pointer' }}
                >
                    <option value="" disabled>-- Chọn --</option>
                    {options.map((opt, index) => (
                        <option key={index} value={opt}>{opt}</option>
                    ))}
                </select>

                {/* Icon mũi tên trỏ xuống */}
                <div className={styles.eyeBtn} style={{ pointerEvents: 'none' }}>
                    <FiChevronDown />
                </div>
            </div>
        </div>
    );
};

export default SelectField;