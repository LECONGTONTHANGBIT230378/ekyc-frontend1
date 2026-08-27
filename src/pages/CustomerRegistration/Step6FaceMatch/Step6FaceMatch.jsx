import React, { useState, useEffect, useRef } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertTriangle } from 'react-icons/fi';
import { ekycService } from '../../../services/ekycService';
import styles from './Step6FaceMatch.module.css';

const Step6FaceMatch = ({ onNext, onPrev, initialData }) => {
    const [isMatching, setIsMatching] = useState(true);
    const [matchScore, setMatchScore] = useState(0);
    const [isMatch, setIsMatch] = useState(false);
    const [error, setError] = useState(null);
    const [rawResult, setRawResult] = useState(null);

    // SỬA LẠI: Dùng 1 state duy nhất để quản lý các loại Modal cảnh báo
    const [modalType, setModalType] = useState(null); // 'MULTIPLE_FACES' | 'NO_FACE' | null

    const apiPromise = useRef(null);

    const cccdImage = initialData?.finalOcrData?.faceImage
        || initialData?.finalOcrData?.croppedFace
        || initialData?.finalOcrData?.face_image_url
        || initialData?.finalOcrData?.avatar
        || initialData?.cccdImages?.front;

    const selfieImage = initialData?.selfieImages?.selfiePreview;

    useEffect(() => {
        let isMounted = true;

        const executeVerifyAPI = async () => {
            const frontFile = initialData?.cccdImages?.frontFile;
            const selfieFile = initialData?.selfieImages?.selfieFile;

            const cccdNumber = initialData?.finalOcrData?.idNumber || initialData?.finalOcrData?.cccdNumber || '';

            if (!frontFile || !selfieFile) {
                throw new Error("Hệ thống không tìm thấy tệp ảnh gốc. Vui lòng quay lại các bước trước.");
            }

            return await ekycService.verifyFace(frontFile, selfieFile, cccdNumber);
        };

        if (!apiPromise.current) {
            apiPromise.current = executeVerifyAPI();
        }

        apiPromise.current
            .then((response) => {
                if (!isMounted) return;
                setIsMatching(false);

                const actualData = response?.data?.data || response?.data || response || {};
                setRawResult(actualData);
                console.log("Dữ liệu AI trả về thực tế:", actualData);

                const possibleScoreKeys = ['similarityscore', 'similarity_score', 'similarity', 'score', 'matchscore', 'match_score', 'confidence'];

                const findScore = (obj) => {
                    if (!obj || typeof obj !== 'object') return null;

                    for (let k of Object.keys(obj)) {
                        const lowerKey = k.toLowerCase();
                        if (possibleScoreKeys.includes(lowerKey)) {
                            const cleanVal = String(obj[k]).replace('%', '').trim();
                            const parsed = parseFloat(cleanVal);
                            if (!isNaN(parsed)) return parsed;
                        }
                    }

                    for (let k of Object.keys(obj)) {
                        if (typeof obj[k] === 'object') {
                            const nestedVal = findScore(obj[k]);
                            if (nestedVal !== null) return nestedVal;
                        }
                    }
                    return null;
                };

                let rawScore = findScore(actualData);
                let score = rawScore !== null ? parseFloat(rawScore) : 0;

                if (score > 0 && score <= 1) {
                    score = score * 100;
                }
                setMatchScore(score.toFixed(2));
                setIsMatch(score >= 60);
            })
            .catch((err) => {
                if (!isMounted) return;
                setIsMatching(false);

                // Lấy thông báo lỗi thô từ Backend trả về
                const errorMsg = err.response?.data?.message || err.message || 'Mất kết nối đến hệ thống AI.';

                // KIỂM TRA MÃ LỖI ĐỂ HIỂN THỊ MODAL TƯƠNG ỨNG
                if (errorMsg.includes('MULTIPLE_WEBCAM_FACES')) {
                    setModalType('MULTIPLE_FACES');
                } else if (errorMsg.includes('WEBCAM_FACE_NOT_FOUND')) {
                    setModalType('NO_FACE');
                } else {
                    setError(errorMsg);
                }
            });

        return () => {
            isMounted = false;
            apiPromise.current = null;
        };
    }, [initialData]);

    const handleNext = () => {
        onNext({
            faceMatchResult: matchScore,
            verificationResult: rawResult
        });
    };

    return (
        <div className={styles.container}>
            {/* HIỂN THỊ KHUNG MODAL NẾU CÓ LỖI CHỤP ẢNH */}
            {modalType && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalIcon}>
                            <FiAlertTriangle size={42} />
                        </div>

                        {/* NỘI DUNG THAY ĐỔI THEO LỖI */}
                        {modalType === 'MULTIPLE_FACES' ? (
                            <>
                                <h3>Phát hiện nhiều khuôn mặt</h3>
                                <p>Ảnh chụp selfie của bạn đang có nhiều hơn một người. Vui lòng đảm bảo <b>chỉ có duy nhất bạn</b> xuất hiện trong khung hình để hệ thống đối chiếu chính xác.</p>
                            </>
                        ) : (
                            <>
                                <h3>Không tìm thấy khuôn mặt</h3>
                                <p>Hệ thống không nhận diện được khuôn mặt trong ảnh selfie. Vui lòng đảm bảo môi trường <b>đủ sáng</b>, không bị che khuất và <b>nhìn thẳng</b> vào camera.</p>
                            </>
                        )}

                        <div className={styles.modalAction}>
                            <button className={styles.retryBtnModal} onClick={onPrev}>
                                Chụp lại ảnh Selfie
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.header}>
                <h2>Trang xác thực khuôn mặt</h2>
                <p>So sánh khuôn mặt trên CCCD với ảnh selfie.</p>
            </div>

            <div className={styles.comparisonArea}>
                <div className={styles.imageCard}>
                    {cccdImage ? (
                        <img src={cccdImage} alt="Khuôn mặt CCCD" className={styles.previewImage} />
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

                <div className={styles.vsText}>so với</div>

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

            {isMatching ? (
                <div className={styles.loadingBanner}>
                    <div className={styles.spinner}></div>
                    <p>Hệ thống AI đang tiến hành phân tích và đối chiếu khuôn mặt...</p>
                </div>
            ) : error ? (
                <div className={styles.errorBanner}>
                    <div className={styles.errorIconWrapper}>
                        <FiAlertTriangle size={28} />
                    </div>
                    <div className={styles.errorContent}>
                        <h4 className={styles.errorTitle}>Xác thực thất bại</h4>
                        <p className={styles.errorDesc}>{error}</p>
                    </div>
                </div>
            ) : !modalType && (
                <div className={`${styles.resultBanner} ${isMatch ? styles.matchSuccess : styles.matchFailed}`}>
                    <div className={styles.resultHeader}>
                        {isMatch ? <FiCheckCircle size={32} /> : <FiXCircle size={32} />}
                        <span className={styles.resultTitle}>
                            {isMatch ? 'XÁC THỰC THÀNH CÔNG' : 'KHUÔN MẶT KHÔNG TRÙNG KHỚP'}
                        </span>
                    </div>

                    <div className={styles.scoreWrapper}>
                        <span className={styles.resultLabel}>Điểm tương đồng:</span>
                        <span className={styles.resultScore}>{matchScore}%</span>
                    </div>

                    {!isMatch && (
                        <div className={styles.suggestionBox}>
                            <strong>Lưu ý:</strong> Hệ thống nhận thấy rủi ro sai lệch khuôn mặt cao. Vui lòng quay lại Bước 5 để chụp ảnh rõ nét hơn, đảm bảo đủ sáng và không đeo kính râm/khẩu trang.
                        </div>
                    )}
                </div>
            )}

            <div className={styles.actionGroup}>
                <button type="button" className={styles.backBtn} onClick={onPrev} disabled={isMatching}>
                    Quay lại
                </button>
                <button
                    type="button"
                    className={styles.nextBtn}
                    onClick={handleNext}
                    disabled={isMatching || error || !isMatch || modalType !== null}
                >
                    Hoàn tất hồ sơ ›
                </button>
            </div>
        </div>
    );
};

export default Step6FaceMatch;