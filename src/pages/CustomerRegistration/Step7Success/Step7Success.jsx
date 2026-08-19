import React, { useState } from 'react';
import { customerService } from '../../../services/customerService';
import styles from './Step7Success.module.css';

const Step7Success = ({ initialData, onPrev }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const resultData = initialData?.verificationResult || {};
    const score = initialData?.faceMatchResult || 0;

    let isMatched = false;
    if (resultData.result !== undefined) {
        isMatched = resultData.result;
    } else if (resultData.isMatch !== undefined) {
        isMatched = resultData.isMatch;
    } else {
        isMatched = score >= 80;
    }

    // ĐÃ SỬA: Lấy đầy đủ 8 trường thông tin từ dữ liệu OCR
    const ocrData = initialData?.finalOcrData || {};
    const idNumber = ocrData.idNumber || 'N/A';
    const fullName = ocrData.fullName || 'N/A';
    const dob = ocrData.dateOfBirth || ocrData.dob || 'N/A';
    const gender = ocrData.gender || 'N/A';
    const nationality = ocrData.nationality || 'N/A';
    const homeTown = ocrData.homeTown || 'N/A';
    const address = ocrData.address || 'N/A';
    const expiryDate = ocrData.expiryDate || 'N/A';

    const handleSaveAndFinish = async () => {
        if (isLoading) return;
        setIsLoading(true);
        setError(null);

        try {
            const step1Data = initialData?.combinedData || {};
            const frontFile = initialData?.cccdImages?.frontFile;
            const selfieFile = initialData?.selfieImages?.selfieFile;

            // Đóng gói JSON OCR
            const cccdDataJson = {
                cccdNumber: idNumber !== 'N/A' ? idNumber : '',
                fullName: fullName !== 'N/A' ? fullName : '',
                dateOfBirth: dob !== 'N/A' ? dob : '',
                gender: gender !== 'N/A' ? gender : '',
                nationality: nationality !== 'N/A' ? nationality : '',
                placeOfOrigin: homeTown !== 'N/A' ? homeTown : '',
                placeOfResidence: address !== 'N/A' ? address : '',
                expiryDate: expiryDate !== 'N/A' ? expiryDate : ''
            };

            const payload = new FormData();
            payload.append('fullName', step1Data.fullName || fullName);
            payload.append('phone', step1Data.phone || '');
            if (step1Data.email) payload.append('email', step1Data.email);
            payload.append('fileFront', frontFile);
            payload.append('fileSelfie', selfieFile);
            payload.append('cccdDataJson', JSON.stringify(cccdDataJson));
            payload.append('similarityScore', score);

            // GỌI API LƯU CHÍNH THỨC VÀO DATABASE
            await customerService.registerFullCustomer(payload);

            window.location.href = '/customers';
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Lỗi lưu hồ sơ vào hệ thống.');
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Xác nhận đăng ký khách hàng</h2>
                <p>Rà soát toàn bộ thông tin trước khi hoàn tất.</p>
            </div>

            {error && (
                <div style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
                    {error}
                </div>
            )}

            <div className={styles.contentGrid}>
                {/* CỘT TRÁI: THÔNG TIN CCCD ĐẦY ĐỦ */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Thông tin CCCD</h3>

                    <div className={styles.infoList}>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Số CCCD</span>
                            <span className={styles.value}>{idNumber}</span>
                        </div>
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
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Quốc tịch</span>
                            <span className={styles.value}>{nationality}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Có giá trị đến</span>
                            <span className={styles.value}>{expiryDate}</span>
                        </div>

                        {/* Các trường dài được xếp theo dạng dọc */}
                        <div className={styles.infoRowVertical}>
                            <span className={styles.label}>Quê quán</span>
                            <span className={styles.value}>{homeTown}</span>
                        </div>
                        <div className={styles.infoRowVertical}>
                            <span className={styles.label}>Nơi thường trú</span>
                            <span className={styles.value}>{address}</span>
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
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang lưu...' : 'Hoàn tất & Về danh sách'}
                        </button>
                        <button
                            type="button"
                            className={styles.backBtn}
                            onClick={onPrev}
                            disabled={isLoading}
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