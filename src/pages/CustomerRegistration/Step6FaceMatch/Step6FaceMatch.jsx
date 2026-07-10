import React, { useState, useEffect } from 'react';
import styles from './Step6FaceMatch.module.css';

const Step6FaceMatch = ({ onNext, onPrev, initialData }) => {
    const [isMatching, setIsMatching] = useState(true);
    const [matchScore, setMatchScore] = useState(0);

    // Lấy ảnh từ các bước trước truyền sang
    const cccdImage = initialData?.cccdImages?.front;
    const selfieImage = initialData?.selfieImage;

    // Giả lập thời gian AI xử lý (2.5 giây)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMatching(false);
            setMatchScore(92); // Điểm tương đồng giống thiết kế
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    const handleNext = () => {
        onNext({ faceMatchResult: matchScore });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Trang xác thực khuôn mặt</h2>
                <p>So sánh khuôn mặt trên CCCD với ảnh selfie.</p>
            </div>

            {/* KHU VỰC SO SÁNH (2 khung ảnh + chữ "so với") */}
            <div className={styles.comparisonArea}>
                {/* Khung ảnh CCCD */}
                <div className={styles.imageCard}>
                    {cccdImage ? (
                        <img src={cccdImage} alt="CCCD" className={styles.previewImage} />
                    ) : (
                        <div className={styles.placeholderCccd}>
                            <span className={styles.fakeTextHeader}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span>
                            <div className={styles.fakeAvatar}></div>
                            <div className={styles.fakeLines}>
                                <div className={styles.line}></div>
                                <div className={styles.lineShort}></div>
                                <div className={styles.lineLong}></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Chữ "so với" ở giữa */}
                <div className={styles.vsText}>so với</div>

                {/* Khung ảnh Selfie */}
                <div className={styles.imageCard}>
                    {selfieImage ? (
                        <img src={selfieImage} alt="Selfie" className={styles.previewImage} />
                    ) : (
                        <div className={styles.placeholderSelfie}>
                            <div className={styles.fakeFace}></div>
                        </div>
                    )}
                </div>
            </div>

            {/* THẺ KẾT QUẢ MÀU XANH BÊN DƯỚI */}
            {isMatching ? (
                <div className={styles.loadingBanner}>
                    <div className={styles.spinner}></div>
                    <p>Hệ thống đang tiến hành đối chiếu khuôn mặt...</p>
                </div>
            ) : (
                <div className={styles.resultBanner}>
                    <span className={styles.resultLabel}>Điểm tương đồng</span>
                    <div className={styles.resultScore}>{matchScore}%</div>
                    <div className={styles.badge}>KHỚP</div>
                </div>
            )}

            {/* Nút điều hướng */}
            <div className={styles.actionGroup}>
                <button type="button" className={styles.backBtn} onClick={onPrev} disabled={isMatching}>
                    Quay lại
                </button>
                <button
                    type="button"
                    className={styles.nextBtn}
                    onClick={handleNext}
                    disabled={isMatching}
                >
                    Hoàn tất hồ sơ ›
                </button>
            </div>
        </div>
    );
};

export default Step6FaceMatch;