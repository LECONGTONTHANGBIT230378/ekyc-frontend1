import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; /* 1. Bổ sung thư viện điều hướng */
import styles from './Step7Success.module.css';

const Step7Success = ({ onPrev, initialData }) => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate(); /* 2. Khởi tạo biến điều hướng */

    const ocrData = initialData?.finalOcrData || {};

    const handleSave = () => {
        setShowSuccessModal(true);
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
    };

    const handleGoHome = () => {
        /* 3. Chuyển hướng thẳng về Dashboard */
        navigate('/dashboard');

        /* (Lưu ý: Nếu link trang chủ của bạn là đường dẫn gốc, bạn chỉ cần sửa thành navigate('/') là được nhé) */
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Xác nhận đăng ký khách hàng</h2>
                    <p>Rà soát toàn bộ thông tin trước khi lưu.</p>
                </div>

                <div className={styles.contentGrid}>
                    {/* THẺ TRÁI: Thông tin CCCD */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Thông tin CCCD</h3>
                        <div className={styles.infoList}>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Họ và tên</span>
                                <strong className={styles.value}>{ocrData.fullName || 'NGUYỄN VĂN A'}</strong>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Ngày sinh</span>
                                <strong className={styles.value}>{ocrData.dob || '10/08/1994'}</strong>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Giới tính</span>
                                <strong className={styles.value}>{ocrData.gender || 'Nam'}</strong>
                            </div>
                        </div>
                    </div>

                    {/* THẺ PHẢI: Kết quả xác thực */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Kết quả xác thực</h3>
                        <div className={styles.resultList}>
                            <div className={styles.resultItem}>OCR: ✓ Thành công</div>
                            <div className={styles.resultItem}>Xác thực khuôn mặt: ✓ Khớp</div>
                        </div>

                        <div className={styles.actionGroup}>
                            <button type="button" className={styles.saveBtn} onClick={handleSave}>
                                Lưu hồ sơ
                            </button>
                            <button type="button" className={styles.backBtn} onClick={onPrev}>
                                Quay lại
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL GIAO DIỆN CHUẨN NHƯ ẢNH MẪU */}
            {showSuccessModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContainer}>

                        {/* 1. THANH HEADER */}
                        <div className={styles.modalHeader}>
                            <div className={styles.modalHeaderTitle}>
                                <span className={styles.headerIcon}>✓</span> Thông báo hệ thống
                            </div>
                            <button className={styles.closeBtn} onClick={handleCloseModal}>✕</button>
                        </div>

                        {/* 2. PHẦN NỘI DUNG CHÍNH (BODY) */}
                        <div className={styles.modalBody}>
                            <div className={styles.successIconBox}>✓</div>
                            <h3 className={styles.modalTitle}>Lưu hồ sơ thành công</h3>
                            <p className={styles.modalDesc}>
                                Dữ liệu eKYC của khách hàng <strong>{ocrData.fullName || 'NGUYỄN VĂN A'}</strong> đã được lưu trữ an toàn vào hệ thống.
                            </p>
                        </div>

                        {/* 3. KHU VỰC NÚT BẤM (FOOTER) */}
                        <div className={styles.modalFooter}>
                            <button className={styles.btnSecondary} onClick={handleCloseModal}>
                                Đóng
                            </button>
                            <button className={styles.btnPrimary} onClick={handleGoHome}>
                                Về trang chủ
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default Step7Success;