import React from 'react';
import { FiX, FiCheckCircle, FiXCircle } from 'react-icons/fi';
// Tái sử dụng style của module CustomerManagement
import styles from '../CustomerManagement/CustomerManagement.module.css';

const AuthenticationDetailModal = ({ historyData, onClose }) => {
    if (!historyData) return null;

    const isSuccess = historyData.status === 'SUCCESS' || historyData.status === 'VERIFIED';

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} style={{ width: '600px' }} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Chi tiết giao dịch #{historyData.id}
                        {isSuccess ?
                            <FiCheckCircle style={{ color: '#16A34A', fontSize: '18px' }}/> :
                            <FiXCircle style={{ color: '#DC2626', fontSize: '18px' }}/>
                        }
                    </h3>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                <div className={styles.modalBody} style={{ maxHeight: '70vh', overflowY: 'auto' }}>

                    {/* KHỐI KẾT QUẢ AI */}
                    <h4 style={{ fontSize: '15px', color: '#1E293B', marginBottom: '12px', borderBottom: '2px solid #E2E8F0', paddingBottom: '8px' }}>
                        Kết quả xác thực AI
                    </h4>
                    <div className={styles.infoBox} style={{ marginBottom: '24px' }}>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Điểm khuôn mặt (Face Match)</span>
                                <span className={styles.infoValue} style={{ color: historyData.faceMatchScore >= 80 ? '#16A34A' : '#DC2626', fontSize: '16px', fontWeight: 'bold' }}>
                                    {historyData.faceMatchScore ? `${historyData.faceMatchScore}%` : 'Không xác định'}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Trạng thái hệ thống</span>
                                <span className={styles.infoValue}>{historyData.status || 'N/A'}</span>
                            </div>
                            <div className={styles.infoItemFull}>
                                <span className={styles.infoLabel}>Thông báo / Lỗi</span>
                                <span className={styles.infoValue} style={{ color: '#64748B' }}>
                                    {historyData.errorMessage || historyData.message || 'Xử lý thành công không có lỗi phát sinh.'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* KHỐI THÔNG TIN OCR */}
                    <h4 style={{ fontSize: '15px', color: '#1E293B', marginBottom: '12px', borderBottom: '2px solid #E2E8F0', paddingBottom: '8px' }}>
                        Dữ liệu bóc tách (OCR)
                    </h4>
                    <div className={styles.infoBox}>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItemFull}>
                                <span className={styles.infoLabel}>Số CCCD</span>
                                <span className={styles.infoValue}>{historyData.cccdNumber || 'N/A'}</span>
                            </div>
                            <div className={styles.infoItemFull}>
                                <span className={styles.infoLabel}>Họ và tên</span>
                                <span className={styles.infoValue}>{historyData.fullName || 'N/A'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Ngày sinh</span>
                                <span className={styles.infoValue}>{historyData.dateOfBirth || 'N/A'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Giới tính</span>
                                <span className={styles.infoValue}>{historyData.gender || 'N/A'}</span>
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

export default AuthenticationDetailModal;