import React from 'react';
import { FiX } from 'react-icons/fi';
import styles from './AccountManagement.module.css';

const AccountModal = ({ isOpen, type, data, onClose, onSave, errorMessage }) => {
    if (!isOpen) return null;

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
                            <div style={{
                                color: '#EF4444',
                                backgroundColor: '#FEF2F2',
                                padding: '10px',
                                borderRadius: '6px',
                                marginBottom: '16px',
                                fontSize: '14px',
                                textAlign: 'center',
                                fontWeight: '500'
                            }}>
                                {errorMessage}
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label>Họ và tên nhân viên</label>
                            <input
                                type="text"
                                name="fullName"
                                className={styles.inputField}
                                placeholder="Nhập họ và tên"
                                defaultValue={data?.name}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Email đăng nhập</label>
                            <input
                                type="email"
                                name="email"
                                className={styles.inputField}
                                placeholder="ví dụ: nv.a@cmcu.edu.vn"
                                defaultValue={data?.email}
                                required
                                disabled={type === 'edit'}
                            />
                        </div>
                        {type === 'add' && (
                            <div className={styles.formGroup}>
                                <label>Mật khẩu khởi tạo</label>
                                <input
                                    type="password"
                                    name="password"
                                    className={styles.inputField}
                                    placeholder="Nhập mật khẩu mặc định"
                                    required
                                />
                            </div>
                        )}
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Phân quyền (Role)</label>
                                <select name="role" className={styles.selectField} defaultValue={data?.role || 'Nhân viên'}>
                                    <option value="Nhân viên">Nhân viên</option>
                                    <option value="Admin">Admin</option>
                                </select>
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
                        <button type="submit" className={styles.btnPrimary}>
                            {type === 'add' ? 'Tạo tài khoản' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountModal;