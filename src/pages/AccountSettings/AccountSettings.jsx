import React, { useState } from 'react';
// Bổ sung thêm FiCheckCircle cho Modal thông báo
import { FiUser, FiShield, FiBell, FiCamera, FiLock, FiCheckCircle } from 'react-icons/fi';
import styles from './AccountSettings.module.css';

const AccountSettings = () => {
    const [profile, setProfile] = useState({
        fullName: 'Nguyễn Văn Quản Trị',
        email: 'admin.nguyen@cmcu.edu.vn',
        phone: '0901234567',
        role: 'Quản trị viên cấp cao',
    });

    const [security, setSecurity] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [toggles, setToggles] = useState({
        twoFactorAuth: true,
        emailNotif: true,
        smsNotif: false,
    });

    // STATE QUẢN LÝ MODAL THÔNG BÁO LƯU THÀNH CÔNG
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleToggle = (name) => {
        setToggles({ ...toggles, [name]: !toggles[name] });
    };

    // HÀM LƯU: Thay vì dùng alert(), giờ sẽ mở Modal lên
    const handleSave = () => {
        setIsSuccessModalOpen(true);
    };

    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false);
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.headerSection}>
                <h2 className={styles.title}>Cài đặt tài khoản</h2>
                <p className={styles.subtitle}>Quản lý thông tin cá nhân, mật khẩu và tùy chọn bảo mật của bạn.</p>
            </div>

            <div className={styles.contentGrid}>
                {/* CỘT TRÁI: Thông tin cá nhân */}
                <div className={styles.leftColumn}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <FiUser className={styles.cardIcon} />
                            <h3>Thông tin cá nhân</h3>
                        </div>
                        <div className={styles.cardBody}>

                            <div className={styles.avatarSection}>
                                <div className={styles.avatarCircle}>
                                    <span className={styles.avatarInitials}>QT</span>
                                    <button className={styles.avatarEditBtn} title="Thay đổi ảnh đại diện">
                                        <FiCamera size={14} />
                                    </button>
                                </div>
                                <div className={styles.avatarInfo}>
                                    <h4>{profile.fullName}</h4>
                                    <span className={styles.roleBadge}>{profile.role}</span>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Họ và tên</label>
                                <input type="text" name="fullName" value={profile.fullName} onChange={handleProfileChange} className={styles.inputField} />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Email đăng nhập (Không thể thay đổi)</label>
                                <input type="email" value={profile.email} disabled className={`${styles.inputField} ${styles.inputDisabled}`} />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Số điện thoại</label>
                                <input type="text" name="phone" value={profile.phone} onChange={handleProfileChange} className={styles.inputField} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: Bảo mật & Thông báo */}
                <div className={styles.rightColumn}>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <FiShield className={styles.cardIcon} />
                            <h3>Bảo mật & Đăng nhập</h3>
                        </div>
                        <div className={styles.cardBody}>

                            <div className={styles.toggleRow}>
                                <div className={styles.toggleInfo}>
                                    <strong>Xác thực 2 yếu tố (2FA)</strong>
                                    <p>Bảo vệ tài khoản bằng mã OTP gửi về điện thoại mỗi khi đăng nhập.</p>
                                </div>
                                <label className={styles.switch}>
                                    <input type="checkbox" checked={toggles.twoFactorAuth} onChange={() => handleToggle('twoFactorAuth')} />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>

                            <div className={styles.divider}></div>

                            <div className={styles.passwordSection}>
                                <h4>Thay đổi mật khẩu</h4>
                                <div className={styles.formGroup}>
                                    <label>Mật khẩu hiện tại</label>
                                    <input type="password" placeholder="Nhập mật khẩu hiện tại" className={styles.inputField} />
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Mật khẩu mới</label>
                                        <input type="password" placeholder="Nhập mật khẩu mới" className={styles.inputField} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Xác nhận mật khẩu</label>
                                        <input type="password" placeholder="Nhập lại mật khẩu mới" className={styles.inputField} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <FiBell className={styles.cardIcon} />
                            <h3>Cài đặt thông báo</h3>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.toggleRow}>
                                <div className={styles.toggleInfo}>
                                    <strong>Thông báo qua Email</strong>
                                    <p>Nhận báo cáo tổng hợp và cảnh báo lỗi hệ thống qua Email.</p>
                                </div>
                                <label className={styles.switch}>
                                    <input type="checkbox" checked={toggles.emailNotif} onChange={() => handleToggle('emailNotif')} />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>
                            <div className={styles.divider}></div>
                            <div className={styles.toggleRow}>
                                <div className={styles.toggleInfo}>
                                    <strong>Cảnh báo khẩn cấp qua SMS</strong>
                                    <p>Gửi tin nhắn về điện thoại khi phát hiện đăng nhập bất thường.</p>
                                </div>
                                <label className={styles.switch}>
                                    <input type="checkbox" checked={toggles.smsNotif} onChange={() => handleToggle('smsNotif')} />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className={styles.bottomBar}>
                <button className={styles.cancelBtn}>Hủy bỏ</button>
                <button className={styles.saveBtn} onClick={handleSave}>Lưu thay đổi</button>
            </div>

            {/* GIAO DIỆN MODAL THÔNG BÁO LƯU THÀNH CÔNG */}
            {isSuccessModalOpen && (
                <div className={styles.modalOverlay} onClick={closeSuccessModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalIconBox}>
                            <FiCheckCircle size={32} />
                        </div>
                        <h3 className={styles.modalTitle}>Lưu thành công</h3>
                        <p className={styles.modalText}>Các thay đổi cài đặt tài khoản của bạn đã được cập nhật vào hệ thống!</p>
                        <button className={styles.btnPrimaryFull} onClick={closeSuccessModal}>
                            Đã hiểu
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AccountSettings;