import React from 'react';
import { FiX } from 'react-icons/fi';
import styles from './CustomerManagement.module.css';

const CustomerDeleteModal = ({ isOpen, onClose, onConfirm, customer }) => {
    if (!isOpen || !customer) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>

                <div className={styles.modalHeader}>
                    <h3 style={{ color: '#A63232' }}>Xác nhận xóa hồ sơ</h3>
                    <button className={styles.closeBtn} onClick={onClose}><FiX /></button>
                </div>

                <div className={styles.modalBody}>
                    <p style={{ margin: 0, fontSize: '15px', color: '#555' }}>
                        Bạn có chắc chắn muốn xóa dữ liệu của khách hàng <strong>{customer.name}</strong>? Hành động này không thể hoàn tác.
                    </p>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.btnCancel} onClick={onClose}>Hủy bỏ</button>
                    <button className={styles.btnDelete} onClick={onConfirm}>Xóa dữ liệu</button>
                </div>

            </div>
        </div>
    );
};

export default CustomerDeleteModal;