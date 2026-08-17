import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertTriangle } from 'react-icons/fi'; // Import bộ Icon mới
import { ekycService } from '../../../services/ekycService';
import styles from './Step6FaceMatch.module.css';

const Step6FaceMatch = ({ onNext, onPrev, initialData }) => {
    const [isMatching, setIsMatching] = useState(true);
    const [matchScore, setMatchScore] = useState(0);
    const [isMatch, setIsMatch] = useState(false);
    const [error, setError] = useState(null);
    const [rawResult, setRawResult] = useState(null);

    // =========================================================================
    // LẤY ẢNH KHUÔN MẶT ĐÃ CẮT TỪ OCR THAY VÌ LẤY TOÀN BỘ THẺ CCCD
    // =========================================================================
    const cccdImage = initialData?.finalOcrData?.faceImage
        || initialData?.finalOcrData?.croppedFace
        || initialData?.finalOcrData?.face_image_url
        || initialData?.finalOcrData?.avatar
        || initialData?.cccdImages?.front; // Fallback: Nếu không tìm thấy mặt cắt thì mới dùng thẻ CCCD

    const selfieImage = initialData?.selfieImages?.selfiePreview;

    useEffect(() => {
        let isMounted = true;

        const verifyWithAI = async () => {
            try {
                // Lấy File vật lý và dữ liệu chữ từ các bước trước
                const frontFile = initialData?.cccdImages?.frontFile;
                const selfieFile = initialData?.selfieImages?.selfieFile;
                const ocrData = initialData?.finalOcrData || {};

                if (!frontFile || !selfieFile) {
                    setError("Hệ thống không tìm thấy tệp ảnh gốc. Vui lòng quay lại các bước trước.");
                    setIsMatching(false);
                    return;
                }

                // TẠO JSON ĐÚNG CHUẨN BACKEND
                const cccdDataJson = {
                    cccdNumber: ocrData.idNumber || '',
                    fullName: ocrData.fullName || '',
                    dateOfBirth: ocrData.dob || '',
                    gender: ocrData.gender || '',
                    nationality: ocrData.nationality || '',
                    placeOfOrigin: ocrData.homeTown || '',
                    placeOfResidence: ocrData.address || ''
                };

                // LẤY ID KHÁCH HÀNG TỪ BƯỚC 1
                const customerId = initialData?.combinedData?.dbId || initialData?.customerId;

                if (!customerId) {
                    setError("Lỗi: Không tìm thấy ID khách hàng từ Bước 1. Vui lòng làm lại từ đầu.");
                    setIsMatching(false);
                    return;
                }

                // GỌI API XÁC THỰC KHUÔN MẶT
                const response = await ekycService.verifyFace(frontFile, selfieFile, cccdDataJson, customerId);

                if (isMounted) {
                    setIsMatching(false);

                    const resultData = response.data || response;
                    setRawResult(resultData);

                    let score = resultData.similarity_score || resultData.similarityScore || 0;

                    // Xử lý hiển thị %
                    if (score <= 1 && score > 0) {
                        score = score * 100;
                    }
                    setMatchScore(score.toFixed(2));

                    // LẤY KẾT LUẬN TỪ BACKEND
                    let finalMatchStatus = false;
                    if (resultData.result !== undefined) {
                        finalMatchStatus = resultData.result === 'MATCHED' || resultData.result === true;
                    } else if (resultData.isMatch !== undefined) {
                        finalMatchStatus = resultData.isMatch;
                    } else {
                        finalMatchStatus = score >= 80;
                    }
                    setIsMatch(finalMatchStatus);
                }

            } catch (err) {
                if (isMounted) {
                    console.error("Lỗi xác thực khuôn mặt:", err);

                    // Bắt chính xác câu thông báo lỗi từ Backend Spring Boot
                    let errorMsg = err.response?.data?.message || err.message || 'Mất kết nối đến hệ thống AI hoặc lỗi dữ liệu.';

                    if (errorMsg.includes("Duplicate entry") || errorMsg.includes("cccd_information")) {
                        errorMsg = "Căn cước công dân này đã được đăng ký trong hệ thống. Vui lòng sử dụng giấy tờ khác.";
                    }
                    else if (errorMsg.includes("MULTIPLE_WEBCAM_FACES") || errorMsg.includes("đúng một khuôn mặt") || errorMsg.includes("faceCount")) {
                        errorMsg = "Phát hiện có nhiều hơn 1 khuôn mặt trong khung hình. Bạn vui lòng quay lại Bước 5 chụp lại ảnh chỉ có một mình bạn nhé.";
                    }

                    // Hiển thị trực tiếp lỗi ra UI
                    setError(errorMsg);
                    setIsMatching(false);
                }
            }
        };

        verifyWithAI();

        return () => {
            isMounted = false;
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

            {/* KHU VỰC SO SÁNH */}
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

            {/* ========================================================================= */}
            {/* KHU VỰC THÔNG BÁO MỚI SỬ DỤNG CSS BANNER VÀ ICON                          */}
            {/* ========================================================================= */}
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

                    {/* Hộp gợi ý nếu khuôn mặt không khớp */}
                    {!isMatch && (
                        <div className={styles.suggestionBox}>
                            <strong>Lưu ý:</strong> Hệ thống nhận thấy rủi ro sai lệch khuôn mặt cao. Vui lòng quay lại Bước 5 để chụp ảnh rõ nét hơn, đảm bảo đủ sáng và không đeo kính râm/khẩu trang.
                        </div>
                    )}
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
                    disabled={isMatching || error}
                >
                    Hoàn tất hồ sơ ›
                </button>
            </div>
        </div>
    );
};

export default Step6FaceMatch;