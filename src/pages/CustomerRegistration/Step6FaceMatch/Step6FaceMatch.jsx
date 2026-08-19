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

            if (!frontFile || !selfieFile) {
                throw new Error("Hệ thống không tìm thấy tệp ảnh gốc. Vui lòng quay lại các bước trước.");
            }

            // GỌI AI ĐỐI SÁNH KHUÔN MẶT
            return await ekycService.verifyFace(frontFile, selfieFile);
        };

        if (!apiPromise.current) {
            apiPromise.current = executeVerifyAPI();
        }

        apiPromise.current
            .then((response) => {
                if (!isMounted) return;                setIsMatching(false);

                // Dữ liệu thực tế từ Backend
                const actualData = response?.data?.data || response?.data || response || {};
                setRawResult(actualData);
                console.log("Dữ liệu AI trả về thực tế:", actualData);

                // =========================================================================
                // THUẬT TOÁN TÌM KIẾM ĐIỂM SỐ NÂNG CẤP (Bao phủ mọi trường hợp)
                // =========================================================================
                const possibleScoreKeys = ['similarityscore', 'similarity_score', 'similarity', 'score', 'matchscore', 'match_score', 'confidence'];

                const findScore = (obj) => {
                    if (!obj || typeof obj !== 'object') return null;

                    // Ưu tiên tìm kiếm các key có khả năng chứa điểm số trước
                    for (let k of Object.keys(obj)) {
                        const lowerKey = k.toLowerCase();
                        if (possibleScoreKeys.includes(lowerKey)) {
                            // Cắt bỏ dấu % nếu AI trả về dạng chuỗi "82.23%"
                            const cleanVal = String(obj[k]).replace('%', '').trim();
                            const parsed = parseFloat(cleanVal);
                            if (!isNaN(parsed)) return parsed;
                        }
                    }

                    // Nếu không thấy, tiếp tục đệ quy vào các object con
                    for (let k of Object.keys(obj)) {
                        if (typeof obj[k] === 'object') {
                            const nestedVal = findScore(obj[k]);
                            if (nestedVal !== null) return nestedVal;
                        }
                    }
                    return null;
                };

                // THUẬT TOÁN TÌM KIẾM TRẠNG THÁI KHỚP
                const findMatchStatus = (obj) => {
                    if (!obj || typeof obj !== 'object') return null;
                    const keys = ['isMatch', 'is_match', 'match', 'matched', 'isMatched'];
                    for (let k of keys) {
                        if (obj[k] !== undefined && obj[k] !== null) {
                            return obj[k] === true || obj[k] === 'true' || obj[k] === 'MATCHED';
                        }
                    }
                    if (obj.result !== undefined && obj.result !== null) {
                        if (obj.result === 'MATCHED' || obj.result === true) return true;
                        if (obj.result === 'NOT_MATCHED' || obj.result === false) return false;
                    }
                    for (let k in obj) {
                        if (typeof obj[k] === 'object') {
                            const val = findMatchStatus(obj[k]);
                            if (val !== null) return val;
                        }
                    }
                    return null;
                };

                // 1. Lấy điểm số
                let rawScore = findScore(actualData);
                let score = rawScore !== null ? parseFloat(rawScore) : 0;

                // Nếu AI trả về hệ số 0 -> 1 (vd: 0.8223), nhân 100 thành 82.23%
                // Nếu AI trả về số lớn hơn 1 (vd: 82.23), giữ nguyên
                if (score > 0 && score <= 1) {
                    score = score * 100;
                }
                setMatchScore(score.toFixed(2));

                // 2. Lấy trạng thái Khớp
                let finalMatchStatus = findMatchStatus(actualData);

                // Nếu Backend không trả về biến báo trạng thái, tự tính dựa trên ngưỡng 50%
                if (finalMatchStatus === null) {
                    finalMatchStatus = score >= 50;
                }

                setIsMatch(finalMatchStatus);
            })
            .catch((err) => {
                if (!isMounted) return;
                setIsMatching(false);
                setError(err.response?.data?.message || err.message || 'Mất kết nối đến hệ thống AI.');
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
            ) : (
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
                    disabled={isMatching || error || !isMatch}
                >
                    Hoàn tất hồ sơ ›
                </button>
            </div>
        </div>
    );
};

export default Step6FaceMatch;