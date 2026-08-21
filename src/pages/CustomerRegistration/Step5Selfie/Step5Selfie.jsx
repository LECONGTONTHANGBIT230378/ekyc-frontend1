import React, { useState, useRef, useEffect } from 'react';
import { FiCamera, FiCheck } from 'react-icons/fi';
import ImageUpload from '../../../components/Form/ImageUpload.jsx';
import styles from './Step5Selfie.module.css';

const Step5Selfie = ({ onNext, onPrev, initialData }) => {
    const [selfieData, setSelfieData] = useState({
        selfiePreview: initialData?.selfieImages?.selfiePreview || null,
        selfieFile: initialData?.selfieImages?.selfieFile || null,
    });

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (initialData?.selfieImages) {
            setSelfieData({
                selfiePreview: initialData.selfieImages.selfiePreview || null,
                selfieFile: initialData.selfieImages.selfieFile || null,
            });
        }
    }, [initialData]);

    const dataURLtoFile = (dataurl, filename) => {
        let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            setIsCameraOpen(true);
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            }, 100);
        } catch (err) {
            alert("Không thể truy cập Camera. Vui lòng kiểm tra quyền trên trình duyệt.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageUrl = canvas.toDataURL('image/jpeg');
            const capturedFile = dataURLtoFile(imageUrl, 'selfie_captured.jpg');

            setSelfieData({
                selfiePreview: imageUrl,
                selfieFile: capturedFile
            });

            stopCamera();
        }
    };

    const handleUpload = (url, file) => {
        setSelfieData({
            selfiePreview: url,
            selfieFile: file
        });
    };

    const handleRemove = () => {
        setSelfieData({
            selfiePreview: null,
            selfieFile: null
        });
    };

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    // ====================================================================
    // 💡 ĐÃ THÊM: Đóng gói ảnh Selfie để mang theo khi ấn "Quay lại"
    // ====================================================================
    const handleBack = () => {
        onPrev({ selfieImages: selfieData });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext({ selfieImages: selfieData });
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.formWrapper}>
                <div className={styles.contentGrid}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Trang tải ảnh selfie</h3>
                        <div className={styles.uploadSection}>
                            <ImageUpload
                                label="Tải ảnh lên"
                                hint="Kéo thả hoặc chọn ảnh PNG/JPG tối đa 10MB"
                                image={selfieData.selfiePreview}
                                onUpload={(url, file) => handleUpload(url, file)}
                                onRemove={handleRemove}
                            />
                        </div>

                        <div className={styles.cameraSection}>
                            <div className={styles.videoBox}>
                                {isCameraOpen ? (
                                    <>
                                        <video ref={videoRef} autoPlay playsInline className={styles.videoStream} />
                                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                                    </>
                                ) : (
                                    <div className={styles.videoPlaceholder}>
                                        <FiCamera size={32} color="#fff" />
                                    </div>
                                )}
                            </div>

                            <div className={styles.cameraControls}>
                                <ul className={styles.checklist}>
                                    <li><FiCheck /> Có khuôn mặt</li>
                                    <li><FiCheck /> Khuôn mặt rõ</li>
                                    <li><FiCheck /> Đủ sáng</li>
                                </ul>

                                {isCameraOpen ? (
                                    <div className={styles.actionBtns}>
                                        <button type="button" className={styles.captureBtn} onClick={capturePhoto}>Chụp ảnh</button>
                                        <button type="button" className={styles.cancelBtn} onClick={stopCamera}>Hủy</button>
                                    </div>
                                ) : (
                                    <button type="button" className={styles.openCameraBtn} onClick={startCamera}>
                                        Mở camera
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className={styles.bottomAction}>
                            {/* 💡 ĐÃ SỬA: Gọi hàm handleBack thay vì onPrev */}
                            <button type="button" className={styles.backBtn} onClick={handleBack}>
                                Quay lại
                            </button>

                            <button
                                type="submit"
                                className={styles.nextBtn}
                                disabled={!selfieData.selfieFile}
                            >
                                So sánh khuôn mặt
                            </button>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Xem trước selfie</h3>
                        <div className={styles.previewBox}>
                            {selfieData.selfiePreview ? (
                                <img src={selfieData.selfiePreview} alt="Selfie Preview" className={styles.previewImage} />
                            ) : (
                                <div className={styles.placeholderSelfie}>
                                    <div className={styles.fakeFace}></div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
};

export default Step5Selfie;