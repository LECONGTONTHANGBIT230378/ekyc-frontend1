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

    const timerRef = useRef(null);

    useEffect(() => {
        let isSubscribed = true;

        // Hàm phân tích và bắt lỗi thông minh
        const handleSmartError = (errorString, defaultMsg) => {
            if (!isSubscribed) return;

            const errorStrLower = errorString.toLowerCase();

            if (errorString.includes('CARD_DETECTION_FAILED') || errorString.includes('Không phát hiện được') || errorString.includes('không hợp lệ')) {
                setModalContent({
                    title: 'Không tìm thấy Căn cước công dân',
                    message: 'Hệ thống không nhận diện được thẻ hợp lệ trong ảnh. Vui lòng đảm bảo bạn đang tải lên đúng mặt trước của thẻ CCCD/CMND.'
                });
                setShowModal(true);
                setError('Không phát hiện được CCCD.');
            }
                // ====================================================================
                // ĐÃ THÊM: Modal phát hiện nhiều thẻ
            // ====================================================================
            else if (errorString.includes('MULTIPLE_CARDS') || errorStrLower.includes('nhiều thẻ') || errorStrLower.includes('nhiều cccd')) {
                setModalContent({
                    title: 'Phát hiện nhiều Căn cước công dân',
                    message: 'Hệ thống phát hiện có nhiều hơn 1 thẻ Căn cước công dân trong khung hình. Vui lòng dọn dẹp mặt nền và chỉ chụp duy nhất 1 thẻ để hệ thống xử lý chính xác.'
                });
                setShowModal(true);
                setError('Tồn tại nhiều thẻ CCCD trong ảnh.');
            }
                // ====================================================================
                // ĐÃ THÊM: Modal ảnh bị chói lóa
            // ====================================================================
            else if (errorString.includes('IMAGE_GLARED') || errorString.includes('GLARE') || errorStrLower.includes('chói') || errorStrLower.includes('lóa')) {
                setModalContent({
                    title: 'Ảnh chụp bị chói sáng',
                    message: 'Ảnh thẻ CCCD của bạn đang bị chói/lóa bóng đèn làm lấp thông tin quan trọng. Vui lòng đổi góc chụp hoặc tắt đèn flash và thử lại.'
                });
                setShowModal(true);
                setError('Ảnh CCCD bị chói/lóa.');
            }
            else if (errorString.includes('IMAGE_BLURRY') || errorString.includes('BLURRY') || errorStrLower.includes('mờ')) {
                setModalContent({
                    title: 'Ảnh chụp bị mờ',
                    message: 'Ảnh thẻ của bạn quá mờ khiến AI không thể đọc được chữ. Vui lòng lau sạch ống kính, giữ chắc tay và chụp lại ở nơi đủ sáng.'
                });
                setShowModal(true);
                setError('Ảnh CCCD bị mờ.');
            }
            else if (errorStrLower.includes('hết hạn') || errorString.includes('EXPIRED') || errorStrLower.includes('het han')) {
                setModalContent({
                    title: 'Căn cước công dân hết hạn',
                    message: 'Thẻ Căn cước công dân của bạn đã hết hạn sử dụng. Vui lòng sử dụng thẻ CCCD/CMND bản gốc còn hiệu lực để tiếp tục quá trình đăng ký.'
                });
                setShowModal(true);
                setError('Thẻ CCCD đã hết hạn sử dụng.');
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

            timerRef.current = setInterval(() => {
                if (!isSubscribed) return;
                setProgress((prev) => {
                    if (prev >= 90) return 90;
                    if (prev === 20) setCurrentAction('Đang kiểm tra chất lượng ảnh (độ mờ, chói lóa)...');
                    if (prev === 45) setCurrentAction('Đang kết nối AI Server và cắt khung CCCD...');
                    if (prev === 70) setCurrentAction('Đang chạy mô hình OCR trích xuất văn bản...');
                    return prev + 5;
                });
            }, 400);

            try {
                const apiResponse = await ekycService.detectOcr(frontFile);

                if (!isSubscribed) return;

                clearInterval(timerRef.current);

                if (apiResponse.success) {
                    setOcrResult(apiResponse.data);
                    setProgress(100);
                    setIsComplete(true);
                    setCurrentAction(apiResponse.message || 'Nhận diện hoàn tất!');
                } else {
                    const respStr = JSON.stringify(apiResponse);
                    handleSmartError(respStr + " " + (apiResponse.message || ''), apiResponse.message);
                }
            } catch (err) {
                if (!isSubscribed) return;

                clearInterval(timerRef.current);

                console.error("Lỗi gọi API OCR:", err);
                const errorStr = typeof err.response?.data === 'object'
                    ? JSON.stringify(err.response?.data)
                    : (err.message || '');

                const defaultMsg = err.response?.data?.message || 'Có lỗi xảy ra khi kết nối với máy chủ.';
                handleSmartError(errorStr + " " + defaultMsg, defaultMsg);
            }
        };

        processAI();

        return () => {
            isSubscribed = false;
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [frontFile]);

    const handleNext = () => {
        onNext({ ocrData: ocrResult });
    };

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