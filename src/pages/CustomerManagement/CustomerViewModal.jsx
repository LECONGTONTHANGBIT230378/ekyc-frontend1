import React from 'react';
import { FiX, FiUser } from 'react-icons/fi';
import styles from './CustomerManagement.module.css';

const CustomerViewModal = ({ isOpen, onClose, customer }) => {
    if (!isOpen || !customer) return null;

    // Hàm phụ trợ để render màu sắc thẻ trạng thái cho đúng
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'verified':
                return <span className={`${styles.badge} ${styles.badgeVerified}`}>Đã xác thực</span>;
            case 'pending':
                return <span className={`${styles.badge} ${styles.badgePending}`}>Đang chờ</span>;
            case 'failed':
                return <span className={`${styles.badge} ${styles.badgeFailed}`}>Thất bại</span>;
            default:
                return null;
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>

                {/* HEADER CƠ BẢN */}
                <div className={styles.modalHeader}>
                    <h3>Chi tiết hồ sơ khách hàng</h3>
                    <button className={styles.closeBtn} onClick={onClose}><FiX /></button>
                </div>

                <div className={styles.modalBody}>

                    {/* PHẦN 1: PROFILE HEADER (AVATAR + TÊN + TRẠNG THÁI) */}
                    <div className={styles.profileSection}>
                        <div className={styles.avatarPlaceholder}>
                            <FiUser />
                        </div>
                        <div className={styles.profileTitle}>
                            <h2 className={styles.customerName}>{customer.name}</h2>
                            <div className={styles.statusWrapper}>
                                {renderStatusBadge(customer.status)}
                            </div>
                        </div>
                    </div>

                    {/* PHẦN 2: THÔNG TIN CHI TIẾT DẠNG GRID */}
                    <div className={styles.infoBox}>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Mã khách hàng</span>
                                <strong className={styles.infoValue}>{customer.id}</strong>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Số điện thoại</span>
                                <strong className={styles.infoValue}>{customer.phone}</strong>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Số CCCD</span>
                                <strong className={styles.infoValue}>{customer.cccd}</strong>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Ngày sinh</span>
                                <strong className={styles.infoValue}>{customer.dob}</strong>
                            </div>
                            <div className={styles.infoItemFull}>
                                <span className={styles.infoLabel}>Địa chỉ liên hệ</span>
                                <strong className={styles.infoValue}>{customer.address}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className={styles.modalFooter}>
                    <button className={styles.btnPrimary} onClick={onClose}>Hoàn tất</button>
                </div>

            </div>
        </div>
    );
};

export default CustomerViewModal;