import React, { useState, useEffect, useRef } from 'react';
import { FiCheckCircle, FiLoader, FiAlertCircle, FiXCircle } from 'react-icons/fi';
import styles from './Step3Detection.module.css';
import { ekycService } from '../../../services/ekycService';

const Step3Detection = ({ onNext, onPrev, initialData }) => {
    const [progress, setProgress] = useState(0);
    const [currentAction, setCurrentAction] = useState('Khởi tạo engine AI...');
    const [isComplete, setIsComplete] = useState(false);
    const [error, setError] = useState(null);
    const [ocrResult, setOcrResult] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });

    const frontImagePreview = initialData?.cccdImages?.front;
    const frontFile = initialData?.cccdImages?.frontFile;

    // Sử dụng useRef để lưu trữ ID của bộ đếm thời gian, giúp ta có thể "giết" nó bất cứ lúc nào
    const timerRef = useRef(null);

    useEffect(() => {
        let isSubscribed = true;

        // Hàm phân tích và bắt lỗi thông minh
        const handleSmartError = (errorString, defaultMsg) => {
            if (!isSubscribed) return;

            if (errorString.includes('CARD_DETECTION_FAILED') || errorString.includes('Không phát hiện được')) {
                setModalContent({
                    title: 'Không tìm thấy Căn cước công dân',
                    message: 'Hệ thống không nhận diện được thẻ trong ảnh. Vui lòng đảm bảo chụp đầy đủ 4 góc của thẻ, không bị tay hoặc vật khác che khuất.'
                });
                setShowModal(true);
                setError('Không phát hiện được CCCD.');
            }
            else if (errorString.includes('IMAGE_BLURRY') || errorString.includes('BLURRY') || errorString.includes('mờ')) {
                setModalContent({
                    title: 'Ảnh chụp bị mờ',
                    message: 'Ảnh thẻ của bạn quá mờ hoặc lóa sáng khiến AI không thể đọc được chữ. Vui lòng lau sạch ống kính và chụp lại ở nơi đủ sáng.'
                });
                setShowModal(true);
                setError('Ảnh CCCD bị mờ/lóa.');
            }
            else {
                setError(defaultMsg || 'Hệ thống AI không thể nhận diện được thẻ.');
            }
            setCurrentAction('Nhận diện thất bại!');
        };

        const processAI = async () => {
            if (!frontFile) {
                if (isSubscribed) {
                    setError('Không tìm thấy tệp ảnh gốc. Vui lòng quay lại Bước 2.');
                    setCurrentAction('Lỗi dữ liệu đầu vào!');
                }
                return;
            }

            // 1. BẮT ĐẦU THANH TIẾN TRÌNH
            timerRef.current = setInterval(() => {
                if (!isSubscribed) return;
                setProgress((prev) => {
                    if (prev >= 90) return 90; // Dừng ở 90% đợi API
                    if (prev === 20) setCurrentAction('Đang kiểm tra chất lượng ảnh (độ mờ, chói lóa)...');
                    if (prev === 45) setCurrentAction('Đang kết nối AI Server và cắt khung CCCD...');
                    if (prev === 70) setCurrentAction('Đang chạy mô hình OCR trích xuất văn bản...');
                    return prev + 5;
                });
            }, 400);

            try {
                // 2. GỌI API
                const apiResponse = await ekycService.detectOcr(frontFile);

                if (!isSubscribed) return;

                // 3. NẾU CÓ KẾT QUẢ (THÀNH CÔNG HOẶC LỖI TỪ API), LẬP TỨC HỦY TIẾN TRÌNH
                clearInterval(timerRef.current);

                if (apiResponse.success) {
                    setOcrResult(apiResponse.data);
                    setProgress(100); // Ép lên 100%
                    setIsComplete(true);
                    setCurrentAction(apiResponse.message || 'Nhận diện hoàn tất!');
                } else {
                    const respStr = JSON.stringify(apiResponse);
                    handleSmartError(respStr, apiResponse.message);
                }
            } catch (err) {
                if (!isSubscribed) return;

                // 3. NẾU SERVER LỖI (VĂNG CATCH), CŨNG PHẢI HỦY TIẾN TRÌNH NGAY LẬP TỨC
                clearInterval(timerRef.current);

                console.error("Lỗi gọi API OCR:", err);
                const errorStr = typeof err.response?.data === 'object'
                    ? JSON.stringify(err.response?.data)
                    : (err.message || '');

                const defaultMsg = err.response?.data?.message || 'Có lỗi xảy ra khi kết nối với máy chủ.';
                handleSmartError(errorStr, defaultMsg);
            }
        };

        processAI();

        // Cleanup function: Chạy khi Component bị hủy (khi chuyển trang)
        return () => {
            isSubscribed = false;
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [frontFile]); // Dependency chỉ phụ thuộc vào ảnh, đảm bảo không bị gọi lại khi Modal hiện lên

    const handleNext = () => {
        onNext({ ocrData: ocrResult });
    };

    // GIAO DIỆN MODAL BÁO LỖI
    const ErrorModal = () => (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(3px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
            <div style={{
                backgroundColor: '#fff', padding: '30px', borderRadius: '12px',
                width: '400px', maxWidth: '90%', textAlign: 'center',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}>
                <FiXCircle size={60} color="#E53E3E" style={{ marginBottom: '15px' }} />
                <h3 style={{ margin: '0 0 10px 0', color: '#2D3748', fontSize: '20px' }}>
                    {modalContent.title}
                </h3>
                <p style={{ color: '#4A5568', lineHeight: '1.5', marginBottom: '25px' }}>
                    {modalContent.message}
                </p>
                <button
                    onClick={onPrev}
                    style={{
                        backgroundColor: '#3182ce', color: '#fff', border: 'none',
                        padding: '12px 24px', borderRadius: '6px', cursor: 'pointer',
                        fontSize: '16px', fontWeight: '500', width: '100%',
                        transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2b6cb0'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3182ce'}
                >
                    Quay lại tải ảnh
                </button>
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            {showModal && <ErrorModal />}

            <div className={styles.header}>
                <h2>Hệ thống AI đang xử lý</h2>
            </div>

            <div className={styles.contentGrid}>
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
                                    backgroundColor: error ? '#E53E3E' : '#3182ce',
                                    transition: 'width 0.3s ease'
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

                        {error && !showModal && <div className={styles.errorMessage}>{error}</div>}
                    </div>

                    <ul className={styles.checklist}>
                        <li className={progress > 20 ? styles.checkDone : ''}>Kiểm tra tính toàn vẹn của ảnh</li>
                        <li className={progress > 45 ? styles.checkDone : ''}>Gửi dữ liệu qua kênh bảo mật</li>
                        <li className={progress > 70 ? styles.checkDone : ''}>Trích xuất dữ liệu quang học (OCR)</li>
                        <li className={isComplete ? styles.checkDone : ''}>Đóng gói và mã hóa dữ liệu</li>
                    </ul>
                </div>

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