import React, { useState, useRef, useEffect } from 'react';
import { FiCamera, FiCheck } from 'react-icons/fi';
import ImageUpload from '../../../components/Form/ImageUpload.jsx';
import styles from './Step5Selfie.module.css';

const Step5Selfie = ({ onNext, onPrev, initialData }) => {
    // Trạng thái lưu ảnh (Tải lên hoặc Chụp đều lưu chung vào đây)
    const [selfie, setSelfie] = useState(initialData?.selfieImage || null);

    // Trạng thái điều khiển Camera
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Hàm bật Camera
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            setIsCameraOpen(true);
            // Gắn luồng video vào thẻ <video> ngay khi render xong
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            }, 100);
        } catch (err) {
            alert("Không thể truy cập Camera. Vui lòng kiểm tra quyền trên trình duyệt.");
        }
    };

    // Hàm tắt Camera
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
    };

    // Hàm chụp ảnh
    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            // Đặt kích thước canvas bằng với khung hình video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');

            // BỔ SUNG: Lật ngược ảnh trước khi vẽ lên canvas để không bị ngược chiều
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);

            // Vẽ frame hiện tại lên canvas và xuất ra dạng URL Base64
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageUrl = canvas.toDataURL('image/jpeg');

            setSelfie(imageUrl); // Lưu ảnh vào State
            stopCamera();        // Chụp xong thì tắt Camera
        }
    };

    // Tắt camera nếu người dùng rời khỏi trang
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext({ selfieImage: selfie });
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.formWrapper}>
                <div className={styles.contentGrid}>

                    {/* CỘT TRÁI: KHU VỰC THAO TÁC (TẢI/CHỤP ẢNH) */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Trang tải ảnh selfie</h3>

                        {/* Vùng tải ảnh (Cách 1) */}
                        <div className={styles.uploadSection}>
                            <ImageUpload
                                label="Camera / Tải ảnh"
                                hint="Kéo thả hoặc chọn ảnh PNG/JPG tối đa 10MB"
                                image={selfie}
                                onUpload={(url) => setSelfie(url)}
                                onRemove={() => setSelfie(null)}
                            />
                        </div>

                        {/* Vùng chụp ảnh Camera (Cách 2) */}
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

                        {/* Nút điều hướng đã được cập nhật */}
                        <div className={styles.bottomAction}>
                            <button type="button" className={styles.backBtn} onClick={onPrev}>
                                Quay lại
                            </button>

                            <button
                                type="submit"
                                className={styles.nextBtn}
                                disabled={!selfie}
                            >
                                So sánh khuôn mặt
                            </button>
                        </div>
                    </div>

                    {/* CỘT PHẢI: XEM TRƯỚC KẾT QUẢ */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Xem trước selfie</h3>
                        <div className={styles.previewBox}>
                            {selfie ? (
                                <img src={selfie} alt="Selfie Preview" className={styles.previewImage} />
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