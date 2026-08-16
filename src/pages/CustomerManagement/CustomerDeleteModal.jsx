import React from 'react';
import { FiX } from 'react-icons/fi';
import styles from './CustomerManagement.module.css';

const CustomerDeleteModal = ({ customerId, customerName, onConfirm, onClose }) => {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>Xác nhận xóa khách hàng</h3>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                        Bạn có chắc chắn muốn xóa hồ sơ của khách hàng
                        <strong style={{ color: '#1E293B' }}> {customerName} </strong>
                        (ID: {customerId}) không?
                    </p>
                    <p style={{ color: '#EF4444', fontSize: '13px', marginTop: '12px' }}>
                        * Hành động này không thể hoàn tác và sẽ xóa mọi dữ liệu liên quan.
                    </p>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.btnCancel} onClick={onClose}>
                        Hủy bỏ
                    </button>
                    <button className={styles.btnDelete} onClick={onConfirm}>
                        Xóa hồ sơ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerDeleteModal;