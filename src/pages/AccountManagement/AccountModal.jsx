import React, { useState, useEffect } from 'react';
import { FiX, FiAlertCircle, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import styles from './AccountManagement.module.css';

const AccountModal = ({ isOpen, type, data, onClose, onSave, errorMessage, accounts = [] }) => {
    // State quản lý lỗi trùng lặp dữ liệu
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');

    // State quản lý mật khẩu
    const [showPassword, setShowPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState('');

    // Reset dữ liệu mỗi khi đóng/mở lại modal
    useEffect(() => {
        if (!isOpen) {
            setNameError('');
            setEmailError('');
            setShowPassword(false);
            setPasswordValue('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // HÀM KIỂM TRA TRÙNG TÊN NHÂN VIÊN
    const handleNameChange = (e) => {
        const value = e.target.value.trim().toLowerCase();
        if (type === 'add' && value !== '') {
            const isExist = accounts.some(acc => acc.name && acc.name.toLowerCase() === value);
            if (isExist) {
                setNameError('Họ tên này đã tồn tại trong hệ thống!');
            } else {
                setNameError('');
            }
        } else {
            setNameError('');
        }
    };

    // HÀM KIỂM TRA TRÙNG EMAIL
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

    // ==========================================
    // LOGIC KIỂM TRA ĐIỀU KIỆN MẬT KHẨU
    // ==========================================
    const hasMinLength = passwordValue.length >= 8;
    const hasUppercase = /[A-Z]/.test(passwordValue);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(passwordValue);

    // Tính điểm độ mạnh mật khẩu (từ 0 đến 3)
    const strengthScore = (hasMinLength ? 1 : 0) + (hasUppercase ? 1 : 0) + (hasSpecialChar ? 1 : 0);

    let barColor = '#E5E7EB'; // Màu xám mặc định
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

    // Nút "Tạo tài khoản" sẽ bị mờ đi nếu: trùng tên/email HOẶC (đang thêm mới mà mật khẩu chưa đạt đủ 3 điều kiện)
    const isPasswordValid = type !== 'add' || strengthScore === 3;
    const hasValidationError = !!nameError || !!emailError || !isPasswordValid;

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

                        {/* HIỂN THỊ LỖI TỪ BACKEND NẾU CÓ */}
                        {errorMessage && (
                            <div style={{
                                color: '#EF4444', backgroundColor: '#FEF2F2', padding: '10px',
                                borderRadius: '6px', marginBottom: '16px', fontSize: '14px',
                                textAlign: 'center', fontWeight: '500', borderLeft: '4px solid #EF4444'
                            }}>
                                {errorMessage}
                            </div>
                        )}

                        {/* TRƯỜNG HỌ VÀ TÊN */}
                        <div className={styles.formGroup}>
                            <label>Họ và tên nhân viên <span style={{color: '#EF4444'}}>*</span></label>
                            <input
                                type="text"
                                name="fullName"
                                className={styles.inputField}
                                placeholder="Nhập họ và tên"
                                defaultValue={data?.name}
                                onChange={handleNameChange}
                                required
                                style={{ borderColor: nameError ? '#EF4444' : '', marginBottom: '4px' }}
                            />
                            {nameError && (
                                <span style={{ fontSize: '12px', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <FiAlertCircle /> {nameError}
                                </span>
                            )}
                        </div>

                        {/* TRƯỜNG EMAIL */}
                        <div className={styles.formGroup}>
                            <label>Email đăng nhập <span style={{color: '#EF4444'}}>*</span></label>
                            <input
                                type="email"
                                name="email"
                                className={styles.inputField}
                                placeholder="ví dụ: nv.a@cmcu.edu.vn"
                                defaultValue={data?.email}
                                onChange={handleEmailChange}
                                required
                                disabled={type === 'edit'}
                                style={
                                    type === 'edit'
                                        ? { backgroundColor: '#F3F4F6', cursor: 'not-allowed', marginBottom: '4px' }
                                        : { borderColor: emailError ? '#EF4444' : '', marginBottom: '4px' }
                                }
                            />
                            {emailError ? (
                                <span style={{ fontSize: '12px', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <FiAlertCircle /> {emailError}
                                </span>
                            ) : (
                                type === 'add' && (
                                    <span style={{ fontSize: '12px', color: '#6B7280', display: 'block' }}>
                                        * Sử dụng email hợp lệ để nhận thông báo hoặc khôi phục mật khẩu.
                                    </span>
                                )
                            )}
                        </div>

                        {/* TRƯỜNG MẬT KHẨU CÓ NÚT XEM/ẨN VÀ THANH ĐỘ MẠNH */}
                        {type === 'add' && (
                            <div className={styles.formGroup}>
                                <label>Mật khẩu khởi tạo <span style={{color: '#EF4444'}}>*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        className={styles.inputField}
                                        placeholder="Nhập mật khẩu mặc định"
                                        value={passwordValue}
                                        onChange={(e) => setPasswordValue(e.target.value)}
                                        required
                                        minLength={8}
                                        pattern="(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}"
                                        style={{ width: '100%', paddingRight: '40px', boxSizing: 'border-box' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                            background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
                                        }}
                                        title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                    >
                                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>

                                {/* THANH ĐỘ AN TOÀN */}
                                <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                                        <span style={{ color: '#6B7280', fontWeight: 500 }}>Độ an toàn:</span>
                                        <span style={{ color: strengthTextColor, fontWeight: 600 }}>{strengthText}</span>
                                    </div>
                                    <div style={{ height: '4px', backgroundColor: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%', width: barWidth, backgroundColor: barColor, transition: 'all 0.3s ease'
                                        }}></div>
                                    </div>
                                </div>

                                {/* DANH SÁCH ĐIỀU KIỆN ĐỔI MÀU REAL-TIME */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                                    <div style={{ color: hasMinLength ? '#10B981' : '#6B7280', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}>
                                        <FiCheckCircle size={14} style={{ color: hasMinLength ? '#10B981' : '#D1D5DB', transition: 'color 0.2s' }} />
                                        Tối thiểu 8 ký tự
                                    </div>
                                    <div style={{ color: hasUppercase ? '#10B981' : '#6B7280', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}>
                                        <FiCheckCircle size={14} style={{ color: hasUppercase ? '#10B981' : '#D1D5DB', transition: 'color 0.2s' }} />
                                        Bao gồm ít nhất 1 chữ in hoa
                                    </div>
                                    <div style={{ color: hasSpecialChar ? '#10B981' : '#6B7280', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}>
                                        <FiCheckCircle size={14} style={{ color: hasSpecialChar ? '#10B981' : '#D1D5DB', transition: 'color 0.2s' }} />
                                        Bao gồm ít nhất 1 ký tự đặc biệt (!, @, #, $,...)
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Phân quyền (Role) <span style={{color: '#EF4444'}}>*</span></label>
                                <select name="role" className={styles.selectField} defaultValue={data?.role || 'Nhân viên'} required style={{ marginBottom: '4px' }}>
                                    <option value="Nhân viên">Nhân viên</option>
                                    <option value="Admin">Admin</option>
                                </select>
                                <span style={{ fontSize: '12px', color: '#D97706', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <FiAlertCircle /> Quyền Admin có toàn quyền thay đổi dữ liệu.
                                </span>
                            </div>

                            {type === 'edit' && (
                                <div className={styles.formGroup}>
                                    <label>Trạng thái</label>
                                    <select name="status" className={styles.selectField} defaultValue={data?.status || 'active'}>
                                        <option value="active">Hoạt động</option>
                                        <option value="inactive">Khóa tài khoản</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.btnCancel} onClick={onClose}>Hủy bỏ</button>
                        <button
                            type="submit"
                            className={styles.btnPrimary}
                            disabled={hasValidationError}
                            style={{
                                opacity: hasValidationError ? 0.6 : 1,
                                cursor: hasValidationError ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s'
                            }}
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