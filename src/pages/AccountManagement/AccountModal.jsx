import React, { useState, useEffect } from 'react';
import { FiX, FiAlertCircle, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import styles from './AccountManagement.module.css'; // Khung giao diện dùng chung
import localStyles from './AccountModal.module.css'; // CSS đặc thù vừa tạo

const AccountModal = ({ isOpen, type, data, onClose, onSave, errorMessage, accounts = [] }) => {
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setEmailError('');
            setPhoneError('');
            setShowPassword(false);
            setPasswordValue('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleEmailChange = (e) => {
        const value = e.target.value.trim().toLowerCase();
        if (type === 'add' && value !== '') {
            const isExist = accounts.some(acc => acc.email && acc.email.toLowerCase() === value);
            if (isExist) {
                setEmailError('Email này đã được sử dụng cho tài khoản khác!');
            } else {
                setEmailError('');
            }
        } else {
            setEmailError('');
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.trim();
        if (value !== '') {
            const phoneRegex = /^0\d{9}$/;
            if (!phoneRegex.test(value)) {
                setPhoneError('Số điện thoại phải gồm 10 số và bắt đầu bằng số 0');
            } else {
                if (type === 'add') {
                    const isExist = accounts.some(acc => acc.phone && acc.phone === value);
                    if (isExist) {
                        setPhoneError('Số điện thoại này đã được sử dụng!');
                    } else {
                        setPhoneError('');
                    }
                } else if (type === 'edit') {
                    if (data?.phone === value) {
                        setPhoneError('');
                    } else {
                        const isExist = accounts.some(acc => acc.id !== data?.id && acc.phone && acc.phone === value);
                        if (isExist) {
                            setPhoneError('Số điện thoại này đã được sử dụng cho tài khoản khác!');
                        } else {
                            setPhoneError('');
                        }
                    }
                }
            }
        } else {
            setPhoneError('');
        }
    };

    const hasMinLength = passwordValue.length >= 8;
    const hasUppercase = /[A-Z]/.test(passwordValue);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(passwordValue);
    const strengthScore = (hasMinLength ? 1 : 0) + (hasUppercase ? 1 : 0) + (hasSpecialChar ? 1 : 0);

    let barColor = '#E5E7EB';
    let barWidth = '0%';
    let strengthText = 'Chưa nhập';
    let strengthTextColor = '#9CA3AF';

    if (passwordValue.length > 0) {
        if (strengthScore === 1) {
            barColor = '#EF4444'; barWidth = '33%'; strengthText = 'Yếu'; strengthTextColor = '#EF4444';
        } else if (strengthScore === 2) {
            barColor = '#F59E0B'; barWidth = '66%'; strengthText = 'Trung bình'; strengthTextColor = '#F59E0B';
        } else if (strengthScore === 3) {
            barColor = '#10B981'; barWidth = '100%'; strengthText = 'Mạnh'; strengthTextColor = '#10B981';
        }
    }

    const isPasswordValid = type !== 'add' || strengthScore === 3;
    const hasValidationError = !!emailError || !!phoneError || !isPasswordValid;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>{type === 'add' ? 'Thêm tài khoản nhân sự' : 'Cập nhật phân quyền'}</h3>
                    <button type="button" className={styles.closeBtn} onClick={onClose}>
                        <FiX />
                    </button>
                </div>
                <form onSubmit={onSave}>
                    <div className={styles.modalBody}>

                        {errorMessage && (
                            <div className={localStyles.backendError}>
                                {errorMessage}
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label>Họ và tên nhân viên <span className={localStyles.requiredStar}>*</span></label>
                            <input
                                type="text"
                                name="fullName"
                                className={`${styles.inputField} ${localStyles.inputSpaced}`}
                                placeholder="Nhập họ và tên"
                                defaultValue={data?.name}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Email đăng nhập <span className={localStyles.requiredStar}>*</span></label>
                            <input
                                type="email"
                                name="email"
                                className={`${styles.inputField} ${localStyles.inputSpaced} ${type === 'edit' ? localStyles.inputDisabled : ''} ${emailError ? localStyles.inputError : ''}`}
                                placeholder="ví dụ: nv.a@cmcu.edu.vn"
                                defaultValue={data?.email}
                                onChange={handleEmailChange}
                                required
                                disabled={type === 'edit'}
                            />
                            {emailError ? (
                                <span className={localStyles.errorText}>
                                    <FiAlertCircle /> {emailError}
                                </span>
                            ) : (
                                type === 'add' && (
                                    <span className={localStyles.helperText}>
                                        * Sử dụng email hợp lệ để nhận thông báo hoặc khôi phục mật khẩu.
                                    </span>
                                )
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Số điện thoại <span className={localStyles.requiredStar}>*</span></label>
                            <input
                                type="tel"
                                name="phone"
                                className={`${styles.inputField} ${localStyles.inputSpaced} ${phoneError ? localStyles.inputError : ''}`}
                                placeholder="Nhập số điện thoại"
                                defaultValue={data?.phone}
                                onChange={handlePhoneChange}
                                required
                                maxLength={10}
                            />
                            {phoneError && (
                                <span className={localStyles.errorText}>
                                    <FiAlertCircle /> {phoneError}
                                </span>
                            )}
                        </div>

                        {type === 'add' && (
                            <div className={styles.formGroup}>
                                <label>Mật khẩu khởi tạo <span className={localStyles.requiredStar}>*</span></label>
                                <div className={localStyles.passwordWrapper}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        className={`${styles.inputField} ${localStyles.passwordInput}`}
                                        placeholder="Nhập mật khẩu mặc định"
                                        value={passwordValue}
                                        onChange={(e) => setPasswordValue(e.target.value)}
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={localStyles.passwordToggleBtn}
                                        title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                    >
                                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>

                                <div className={localStyles.strengthContainer}>
                                    <div className={localStyles.strengthHeader}>
                                        <span className={localStyles.strengthLabel}>Độ an toàn:</span>
                                        <span className={localStyles.strengthValue} style={{ color: strengthTextColor }}>
                                            {strengthText}
                                        </span>
                                    </div>
                                    <div className={localStyles.strengthBarBg}>
                                        <div
                                            className={localStyles.strengthBarFill}
                                            style={{ width: barWidth, backgroundColor: barColor }}
                                        ></div>
                                    </div>
                                </div>

                                <div className={localStyles.criteriaList}>
                                    <div className={`${localStyles.criteriaItem} ${hasMinLength ? localStyles.criteriaValid : localStyles.criteriaInvalid}`}>
                                        <FiCheckCircle size={14} className={hasMinLength ? localStyles.iconValid : localStyles.iconInvalid} />
                                        Tối thiểu 8 ký tự
                                    </div>
                                    <div className={`${localStyles.criteriaItem} ${hasUppercase ? localStyles.criteriaValid : localStyles.criteriaInvalid}`}>
                                        <FiCheckCircle size={14} className={hasUppercase ? localStyles.iconValid : localStyles.iconInvalid} />
                                        Bao gồm ít nhất 1 chữ in hoa
                                    </div>
                                    <div className={`${localStyles.criteriaItem} ${hasSpecialChar ? localStyles.criteriaValid : localStyles.criteriaInvalid}`}>
                                        <FiCheckCircle size={14} className={hasSpecialChar ? localStyles.iconValid : localStyles.iconInvalid} />
                                        Bao gồm ít nhất 1 ký tự đặc biệt (!, @, #, $,...)
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label>Phân quyền (Role) <span className={localStyles.requiredStar}>*</span></label>
                            <select name="role" className={`${styles.selectField} ${localStyles.inputSpaced}`} defaultValue={data?.role || 'Nhân viên'} required>
                                <option value="Nhân viên">Nhân viên</option>
                                <option value="Admin">Admin</option>
                            </select>
                            <span className={localStyles.warningText}>
                                <FiAlertCircle /> Quyền Admin có toàn quyền thay đổi dữ liệu.
                            </span>
                        </div>

                    </div>

                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.btnCancel} onClick={onClose}>Hủy bỏ</button>
                        <button
                            type="submit"
                            className={`${styles.btnPrimary} ${hasValidationError ? localStyles.btnDisabled : ''}`}
                            disabled={hasValidationError}
                        >
                            {type === 'add' ? 'Tạo tài khoản' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountModal;