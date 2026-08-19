import React from 'react';
import { FiX } from 'react-icons/fi';
import styles from './CustomerManagement.module.css';

const CustomerViewModal = ({ customer, onClose }) => {
    if (!customer) return null;

    // Lấy chữ cái đầu tiên của tên làm Avatar
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        return parts[parts.length - 1].charAt(0).toUpperCase();
    };

    // ĐÃ SỬA: Hàm formatDateTime thông minh, hỗ trợ cả định dạng mảng từ Backend
    const formatDateTime = (dateVal) => {
        if (!dateVal) return 'N/A';

        let date;
        // Xử lý trường hợp Backend trả về mảng [Năm, Tháng, Ngày, Giờ, Phút, Giây]
        if (Array.isArray(dateVal)) {
            // Mảng trả về tháng từ 1-12, nhưng JavaScript Date dùng tháng 0-11 nên phải trừ 1
            date = new Date(dateVal[0], dateVal[1] - 1, dateVal[2], dateVal[3] || 0, dateVal[4] || 0, dateVal[5] || 0);
        } else {
            // Xử lý trường hợp Backend trả về chuỗi String
            let dateStr = typeof dateVal === 'string' ? dateVal.replace(' ', 'T') : dateVal;
            date = new Date(dateStr);
        }

        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleString('vi-VN', {
            hour: '2-digit', minute: '2-digit',
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>Hồ sơ khách hàng #{customer.id}</h3>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.profileSection}>
                        <div className={styles.avatarPlaceholder}>
                            {getInitials(customer.fullName)}
                        </div>
                        <div className={styles.profileTitle}>
                            <h4 className={styles.customerName}>{customer.fullName || 'Chưa cập nhật'}</h4>
                            <span style={{ fontSize: '13px', color: '#64748B' }}>
                                ID: {customer.id}
                            </span>
                        </div>
                    </div>

                    <div className={styles.infoBox}>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItemFull}>
                                <span className={styles.infoLabel}>Số thẻ CCCD</span>
                                <span className={styles.infoValue} style={{ fontWeight: 'bold' }}>
                                    {customer.cccdNumber || 'Chưa định danh CCCD'}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Số điện thoại</span>
                                <span className={styles.infoValue}>{customer.phone || 'Chưa cập nhật'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Email</span>
                                <span className={styles.infoValue}>{customer.email || 'Chưa cập nhật'}</span>
                            </div>
                            <div className={styles.infoItemFull}>
                                <span className={styles.infoLabel}>Ngày đăng ký tài khoản</span>
                                <span className={styles.infoValue}>{formatDateTime(customer.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.btnPrimary} onClick={onClose}>Đóng cửa sổ</button>
                </div>
            </div>
        </div>
    );
};

export default CustomerViewModal;