import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiLoader, FiAlertCircle } from 'react-icons/fi';
import styles from './Step3Detection.module.css';
import { ekycService } from '../../../services/ekycService';

const Step3Detection = ({ onNext, onPrev, initialData }) => {
    const [progress, setProgress] = useState(0);
    const [currentAction, setCurrentAction] = useState('Khởi tạo engine AI...');
    const [isComplete, setIsComplete] = useState(false);
    const [error, setError] = useState(null);
    const [ocrResult, setOcrResult] = useState(null);

    // Lấy ảnh hiển thị và file gốc từ Bước 2
    const frontImagePreview = initialData?.cccdImages?.front;
    const frontFile = initialData?.cccdImages?.frontFile; // BẮT BUỘC PHẢI CÓ FILE GỐC ĐỂ GỬI API

    useEffect(() => {
        let isSubscribed = true;

        const processAI = async () => {
            if (!frontFile) {
                if (isSubscribed) {
                    setError('Không tìm thấy tệp ảnh gốc. Vui lòng quay lại Bước 2.');
                    setCurrentAction('Lỗi dữ liệu đầu vào!');
                }
                return;
            }

            try {
                // Gọi API sang Spring Boot Backend (chỉ gửi ảnh mặt trước theo Controller)
                const apiResponse = await ekycService.detectOcr(frontFile);

                if (isSubscribed) {
                    // Kiểm tra trường success trong ApiResponse của Spring Boot
                    if (apiResponse.success) {
                        // apiResponse.data chính là đối tượng CccdInformation
                        setOcrResult(apiResponse.data);
                        setProgress(100);
                        setIsComplete(true);
                        setCurrentAction(apiResponse.message || 'Nhận diện hoàn tất!');
                    } else {
                        setError(apiResponse.message || 'Hệ thống AI không thể nhận diện được thẻ.');
                        setCurrentAction('Nhận diện thất bại!');
                    }
                }
            } catch (err) {
                if (isSubscribed) {
                    console.error("Lỗi gọi API OCR:", err);
                    // Bắt lỗi từ cấu trúc trả về của ExceptionHandler trong Spring Boot
                    setError(err.response?.data?.message || 'Có lỗi xảy ra khi kết nối với máy chủ.');
                    setCurrentAction('Nhận diện thất bại!');
                }
            }
        };

        processAI();

        // Hiệu ứng UX: Thanh tiến trình chạy lên 90% rồi đợi API
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(timer);
                    return 90;
                }

                if (prev === 20) setCurrentAction('Đang kiểm tra chất lượng ảnh (độ mờ, chói lóa)...');
                if (prev === 45) setCurrentAction('Đang kết nối AI Server và cắt khung CCCD...');
                if (prev === 70) setCurrentAction('Đang chạy mô hình OCR trích xuất văn bản...');

                return prev + 5;
            });
        }, 500);

        return () => {
            isSubscribed = false;
            clearInterval(timer);
        };
    }, [frontFile]);

    const handleNext = () => {
        // Truyền kết quả CccdInformation sang component cha để đưa vào Bước 4
        onNext({ ocrData: ocrResult });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Hệ thống AI đang xử lý</h2>
                <p>Vui lòng không đóng trình duyệt trong quá trình này. Việc nhận diện mất khoảng 5-10 giây.</p>
            </div>

            <div className={styles.contentGrid}>
                {/* CỘT TRÁI: DANH SÁCH TIẾN TRÌNH */}
                <div className={styles.leftColumn}>
                    <div className={styles.progressBox}>
                        <div className={styles.progressHeader}>
                            <h3>Tiến trình xử lý</h3>
                            <span className={styles.percent}>{progress}%</span>
                        </div>

                        <div className={styles.progressBarBg}>
                            <div
                                className={`${styles.progressBarFill} ${error ? styles.errorFill : ''}`}
                                style={{
                                    width: `${progress}%`,
                                    backgroundColor: error ? '#E53E3E' : '#3182ce'
                                }}
                            ></div>
                        </div>

                        <div className={styles.statusText}>
                            {error ? (
                                <FiAlertCircle color="#E53E3E" />
                            ) : isComplete ? (
                                <FiCheckCircle color="#38A169" />
                            ) : (
                                <FiLoader className={styles.spinning} />
                            )}
                            <span style={{ color: error ? '#E53E3E' : 'inherit' }}>{currentAction}</span>
                        </div>

                        {error && <div className={styles.errorMessage}>{error}</div>}
                    </div>

                    <ul className={styles.checklist}>
                        <li className={progress > 20 ? styles.checkDone : ''}>Kiểm tra tính toàn vẹn của ảnh</li>
                        <li className={progress > 45 ? styles.checkDone : ''}>Gửi dữ liệu qua kênh bảo mật</li>
                        <li className={progress > 70 ? styles.checkDone : ''}>Trích xuất dữ liệu quang học (OCR)</li>
                        <li className={isComplete ? styles.checkDone : ''}>Đóng gói và mã hóa dữ liệu</li>
                    </ul>
                </div>

                {/* CỘT PHẢI: HIỆU ỨNG QUÉT ẢNH TIA LASER */}
                <div className={styles.rightColumn}>
                    <div className={styles.scannerWrapper}>
                        {frontImagePreview ? (
                            <img src={frontImagePreview} alt="Scanning" className={styles.scanningImg} />
                        ) : (
                            <div className={styles.noImg}>Không tìm thấy ảnh</div>
                        )}

                        {!isComplete && !error && <div className={styles.laserBeam}></div>}

                        <div className={`${styles.corner} ${styles.topLeft}`}></div>
                        <div className={`${styles.corner} ${styles.topRight}`}></div>
                        <div className={`${styles.corner} ${styles.bottomLeft}`}></div>
                        <div className={`${styles.corner} ${styles.bottomRight}`}></div>
                    </div>
                </div>
            </div>

            <div className={styles.actionGroup}>
                <button type="button" className={styles.backBtn} onClick={onPrev}>
                    Quay lại tải ảnh
                </button>
                <button
                    type="button"
                    className={styles.nextBtn}
                    onClick={handleNext}
                    disabled={!isComplete || error !== null}
                >
                    Xem kết quả OCR ›
                </button>
            </div>
        </div>
    );
};

export default Step3Detection;