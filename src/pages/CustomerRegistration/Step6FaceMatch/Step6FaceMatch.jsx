import React, { useState, useEffect, useRef } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertTriangle } from 'react-icons/fi';
import { ekycService } from '../../../services/ekycService';
import { customerService } from '../../../services/customerService';
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
            const step1Data = initialData?.combinedData || {};
            const frontFile = initialData?.cccdImages?.frontFile;
            const selfieFile = initialData?.selfieImages?.selfieFile;
            const ocrData = initialData?.finalOcrData || {};

            if (!frontFile || !selfieFile) {
                throw new Error("Hệ thống không tìm thấy tệp ảnh gốc. Vui lòng quay lại các bước trước.");
            }

            // 1. TẠO KHÁCH HÀNG (Tạm thời để lấy ID)
            const customerPayload = new FormData();
            customerPayload.append('fullName', step1Data.fullName);
            customerPayload.append('phone', step1Data.phone);
            if (step1Data.email) customerPayload.append('email', step1Data.email);
            if (frontFile) customerPayload.append('fileFront', frontFile);

            const customerRes = await customerService.createCustomer(customerPayload);
            const customerId = customerRes.data?.id || customerRes.id || customerRes.data?.customerId;

            if (!customerId) {
                throw new Error("Lỗi: Không thể khởi tạo dữ liệu khách hàng mới.");
            }

            if (initialData.combinedData) {
                initialData.combinedData.dbId = customerId;
            }

            // 2. GỌI API XÁC THỰC KHUÔN MẶT
            const cccdDataJson = {
                cccdNumber: ocrData.idNumber || '',
                fullName: ocrData.fullName || '',
                dateOfBirth: ocrData.dob || '',
                gender: ocrData.gender || '',
                nationality: ocrData.nationality || '',
                placeOfOrigin: ocrData.homeTown || '',
                placeOfResidence: ocrData.address || ''
            };

            try {
                const response = await ekycService.verifyFace(frontFile, selfieFile, cccdDataJson, customerId);
                // Trả về cả response và customerId để xử lý ở bước .then
                return { response, customerId };
            } catch (err) {
                // ROLLBACK: Xóa tài khoản rác nếu API eKYC ném lỗi (vd: trùng CCCD, ảnh mờ)
                await customerService.deleteCustomer(customerId).catch(e => console.error("Lỗi dọn rác:", e));
                throw err;
            }
        };

        if (!apiPromise.current) {
            apiPromise.current = executeVerifyAPI();
        }

        apiPromise.current
            .then(({ response, customerId }) => {
                if (!isMounted) return;
                setIsMatching(false);

                const resultData = response.data || response;
                setRawResult(resultData);

                let score = resultData.similarity_score || resultData.similarityScore || 0;
                if (score <= 1 && score > 0) score = score * 100;
                setMatchScore(score.toFixed(2));

                let finalMatchStatus = false;
                if (resultData.result !== undefined) {
                    finalMatchStatus = resultData.result === 'MATCHED' || resultData.result === true;
                } else if (resultData.isMatch !== undefined) {
                    finalMatchStatus = resultData.isMatch;
                } else {
                    finalMatchStatus = score >= 80;
                }

                setIsMatch(finalMatchStatus);

                // ROLLBACK: Nếu điểm quá thấp (Không khớp), Xóa tài khoản rác
                if (!finalMatchStatus) {
                    customerService.deleteCustomer(customerId).catch(e => console.error("Lỗi dọn rác:", e));
                }
            })
            .catch((err) => {
                if (!isMounted) return;
                setIsMatching(false);

                console.error("Lỗi xác thực khuôn mặt hoặc tạo hồ sơ:", err);
                let errorMsg = err.response?.data?.message || err.message || 'Mất kết nối đến hệ thống AI hoặc lỗi dữ liệu.';

                if (errorMsg.includes("Duplicate entry") || errorMsg.includes("cccd_information")) {
                    errorMsg = "Căn cước công dân này đã được đăng ký trong hệ thống. Vui lòng sử dụng giấy tờ khác.";
                } else if (errorMsg.includes("MULTIPLE_WEBCAM_FACES") || errorMsg.includes("đúng một khuôn mặt") || errorMsg.includes("faceCount")) {
                    errorMsg = "Phát hiện có nhiều hơn 1 khuôn mặt trong khung hình. Bạn vui lòng quay lại Bước 5 chụp lại ảnh chỉ có một mình bạn nhé.";
                }
                setError(errorMsg);
            });

        return () => {
            isMounted = false;
            // Xóa cache promise khi component unmount (ví dụ khi người dùng ấn nút "Quay lại")
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