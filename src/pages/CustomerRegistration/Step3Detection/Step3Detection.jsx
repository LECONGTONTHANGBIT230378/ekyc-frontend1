import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiLoader } from 'react-icons/fi';
import styles from './Step3Detection.module.css';

const Step3Detection = ({ onNext, onPrev, initialData }) => {
    const [progress, setProgress] = useState(0);
    const [currentAction, setCurrentAction] = useState('Khởi tạo engine AI...');
    const [isComplete, setIsComplete] = useState(false);

    // Lấy ảnh mặt trước từ dữ liệu Bước 2 đã lưu
    const frontImage = initialData?.cccdImages?.front;

    // Hiệu ứng giả lập tiến trình quét AI
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setIsComplete(true);
                    setCurrentAction('Nhận diện hoàn tất!');
                    return 100;
                }

                // Thay đổi dòng text trạng thái theo % tiến độ
                if (prev === 20) setCurrentAction('Đang kiểm tra chất lượng ảnh (độ mờ, chói lóa)...');
                if (prev === 45) setCurrentAction('Đang tìm kiếm và cắt khung CCCD...');
                if (prev === 70) setCurrentAction('Đang chạy mô hình OCR trích xuất văn bản...');
                if (prev === 90) setCurrentAction('Đang kiểm tra tính hợp lệ của dữ liệu...');

                return prev + 2; // Tăng dần 2%
            });
        }, 100); // Tốc độ chạy giả lập

        return () => clearInterval(timer);
    }, []);

    const handleNext = () => {
        // Ở bước này không sinh ra data form mới, chỉ chuyển tiếp
        onNext({});
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
                                className={styles.progressBarFill}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        <div className={styles.statusText}>
                            {isComplete ? <FiCheckCircle color="#38A169" /> : <FiLoader className={styles.spinning} />}
                            <span>{currentAction}</span>
                        </div>
                    </div>

                    <ul className={styles.checklist}>
                        <li className={progress > 20 ? styles.checkDone : ''}>Kiểm tra tính toàn vẹn của ảnh</li>
                        <li className={progress > 45 ? styles.checkDone : ''}>Phát hiện gian lận (Anti-spoofing)</li>
                        <li className={progress > 70 ? styles.checkDone : ''}>Trích xuất dữ liệu quang học (OCR)</li>
                        <li className={progress >= 100 ? styles.checkDone : ''}>Đóng gói và mã hóa dữ liệu</li>
                    </ul>
                </div>

                {/* CỘT PHẢI: HIỆU ỨNG QUÉT ẢNH TIA LASER */}
                <div className={styles.rightColumn}>
                    <div className={styles.scannerWrapper}>
                        {frontImage ? (
                            <img src={frontImage} alt="Scanning" className={styles.scanningImg} />
                        ) : (
                            <div className={styles.noImg}>Không tìm thấy ảnh</div>
                        )}

                        {/* Tia laser chạy lên xuống (Chỉ chạy khi chưa 100%) */}
                        {!isComplete && <div className={styles.laserBeam}></div>}

                        {/* Khung nhắm góc */}
                        <div className={`${styles.corner} ${styles.topLeft}`}></div>
                        <div className={`${styles.corner} ${styles.topRight}`}></div>
                        <div className={`${styles.corner} ${styles.bottomLeft}`}></div>
                        <div className={`${styles.corner} ${styles.bottomRight}`}></div>
                    </div>
                </div>
            </div>

            <div className={styles.actionGroup}>
                <button type="button" className={styles.backBtn} onClick={onPrev} disabled={!isComplete}>
                    Quay lại tải ảnh
                </button>
                <button
                    type="button"
                    className={styles.nextBtn}
                    onClick={handleNext}
                    disabled={!isComplete}
                >
                    Xem kết quả OCR ›
                </button>
            </div>
        </div>
    );
};

export default Step3Detection;