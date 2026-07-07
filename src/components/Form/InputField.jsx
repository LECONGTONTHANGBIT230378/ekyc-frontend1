import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import styles from './InputField.module.css';

const InputField = ({ label, type = 'text', name, value, onChange, placeholder, required }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
        <div className={styles.wrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.inputContainer}>
                <input
                    type={inputType}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={styles.input}
                />
                {isPassword && (
                    <button
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default InputField;