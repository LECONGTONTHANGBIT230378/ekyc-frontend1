import React from 'react';
import styles from './Step7Success.module.css';

const Step7Success = ({ initialData, onPrev }) => {
    // 1. Lấy dữ liệu từ Bước 6 (Kết quả AI)
    const resultData = initialData?.verificationResult || {};
    const score = initialData?.faceMatchResult || 0;

    // Xác định kết quả Khớp hay Không khớp
    let isMatched = false;
    if (resultData.result !== undefined) {
        isMatched = resultData.result;
    } else if (resultData.isMatch !== undefined) {
        isMatched = resultData.isMatch;
    } else {
        isMatched = score >= 80;
    }

    // 2. Lấy dữ liệu OCR để hiển thị bên cột trái
    const ocrData = initialData?.finalOcrData || {};
    const fullName = ocrData.fullName || 'N/A';
    const dob = ocrData.dateOfBirth || ocrData.dob || 'N/A';
    const gender = ocrData.gender || 'N/A';

    // 3. Xử lý nút bấm
    const handleSaveAndFinish = () => {
        // Vì dữ liệu thực tế đã được lưu ở Bước 6 qua API /verify
        // Nút này sẽ đưa người dùng về trang Quản lý khách hàng hoặc Trang chủ
        window.location.href = '/customers';
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Xác nhận đăng ký khách hàng</h2>
                <p>Rà soát toàn bộ thông tin trước khi hoàn tất.</p>
            </div>

            <div className={styles.contentGrid}>
                {/* CỘT TRÁI: THÔNG TIN CCCD */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Thông tin CCCD</h3>

                    <div className={styles.infoList}>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Họ và tên</span>
                            <span className={styles.value}>{fullName}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Ngày sinh</span>
                            <span className={styles.value}>{dob}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Giới tính</span>
                            <span className={styles.value}>{gender}</span>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: KẾT QUẢ XÁC THỰC VÀ NÚT BẤM */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Kết quả xác thực</h3>

                    <div className={styles.resultList}>
                        <div className={styles.resultItem}>
                            OCR: <span style={{color: '#137333'}}>✓ Thành công</span>
                        </div>
                        <div className={styles.resultItem}>
                            Xác thực khuôn mặt: <span style={{color: isMatched ? '#137333' : '#DC2626'}}>
                                {isMatched ? '✓ Khớp' : '✕ Không khớp'}
                            </span>
                        </div>
                        <div className={styles.resultItem}>
                            Độ tương đồng: <strong>{score}%</strong>
                        </div>
                    </div>

                    <div className={styles.actionGroup}>
                        <button
                            type="button"
                            className={styles.saveBtn}
                            onClick={handleSaveAndFinish}
                        >
                            Hoàn tất & Về danh sách
                        </button>
                        <button
                            type="button"
                            className={styles.backBtn}
                            onClick={onPrev}
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step7Success;