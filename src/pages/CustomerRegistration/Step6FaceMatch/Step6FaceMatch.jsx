import React, { useState, useEffect } from 'react';
import { ekycService } from '../../../services/ekycService';
import styles from './Step6FaceMatch.module.css';

const Step6FaceMatch = ({ onNext, onPrev, initialData }) => {
    const [isMatching, setIsMatching] = useState(true);
    const [matchScore, setMatchScore] = useState(0);
    // BỔ SUNG: Thêm State để lưu kết luận Khớp/Không khớp từ Backend
    const [isMatch, setIsMatch] = useState(false);
    const [error, setError] = useState(null);
    const [rawResult, setRawResult] = useState(null);

    // Lấy ảnh preview để hiển thị trên UI
    const cccdImage = initialData?.cccdImages?.front;
    const selfieImage = initialData?.selfieImages?.selfiePreview;

    useEffect(() => {
        let isMounted = true;

        const verifyWithAI = async () => {
            try {
                // 1. Lấy File vật lý và dữ liệu chữ từ các bước trước
                const frontFile = initialData?.cccdImages?.frontFile;
                const selfieFile = initialData?.selfieImages?.selfieFile;
                const ocrData = initialData?.finalOcrData || {};

                if (!frontFile || !selfieFile) {
                    setError("Hệ thống không tìm thấy tệp ảnh gốc. Vui lòng quay lại các bước trước.");
                    setIsMatching(false);
                    return;
                }

                // 2. TẠO JSON ĐÚNG CHUẨN BACKEND
                const cccdDataJson = {
                    cccdNumber: ocrData.idNumber || '',
                    fullName: ocrData.fullName || '',
                    dateOfBirth: ocrData.dob || '',
                    gender: ocrData.gender || '',
                    nationality: ocrData.nationality || '',
                    placeOfOrigin: ocrData.homeTown || '',
                    placeOfResidence: ocrData.address || ''
                };

                // 3. Gọi API xác thực khuôn mặt
                const response = await ekycService.verifyFace(frontFile, selfieFile, cccdDataJson);

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

                    // 4. LẤY KẾT LUẬN TỪ BACKEND
                    // Ưu tiên lấy biến result (Boolean) do AI quyết định. Nếu BE thiếu, mới dùng tạm logic >= 80
                    let finalMatchStatus = false;
                    if (resultData.result !== undefined) {
                        finalMatchStatus = resultData.result;
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

                    let errorMsg = err.response?.data?.message || 'Mất kết nối đến hệ thống AI hoặc lỗi dữ liệu.';

                    if (errorMsg.includes("Duplicate entry") || errorMsg.includes("cccd_information")) {
                        errorMsg = "Căn cước công dân này đã tồn tại trong hệ thống. Vui lòng quay lại Bước 4 để kiểm tra hoặc sử dụng giấy tờ khác.";
                    }

                    setError(errorMsg);
                    setIsMatching(false);
                }
            }
        };

        verifyWithAI();

        return () => {
            isMounted = false;
        };
    }, []);

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

            {/* THẺ KẾT QUẢ / TRẠNG THÁI */}
            {isMatching ? (
                <div className={styles.loadingBanner}>
                    <div className={styles.spinner}></div>
                    <p>Hệ thống AI đang tiến hành đối chiếu khuôn mặt...</p>
                </div>
            ) : error ? (
                <div className={styles.resultBanner} style={{ backgroundColor: '#FEF2F2', borderColor: '#F87171' }}>
                    <p style={{ color: '#DC2626', margin: 0, fontWeight: 600, fontSize: '14px', textAlign: 'center' }}>{error}</p>
                </div>
            ) : (
                <div className={styles.resultBanner}>
                    <span className={styles.resultLabel}>Điểm tương đồng</span>
                    <div className={styles.resultScore}>{matchScore}%</div>
                    {/* Sử dụng biến isMatch từ Backend để hiển thị kết quả chính xác */}
                    <div className={styles.badge} style={{ backgroundColor: isMatch ? '#10B981' : '#EF4444' }}>
                        {isMatch ? 'KHỚP' : 'KHÔNG KHỚP'}
                    </div>
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