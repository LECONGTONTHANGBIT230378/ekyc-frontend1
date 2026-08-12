import React, { useState, useRef, useEffect } from 'react';
import { FiCamera, FiCheck } from 'react-icons/fi';
import ImageUpload from '../../../components/Form/ImageUpload.jsx';
import styles from './Step5Selfie.module.css';

const Step5Selfie = ({ onNext, onPrev, initialData }) => {
    // 💡 SỬA ĐỔI: Tách State để lưu cả URL (dùng hiển thị) và File gốc (dùng gửi API Bước 6)
    const [selfieData, setSelfieData] = useState({
        selfiePreview: initialData?.selfieImages?.selfiePreview || null,
        selfieFile: initialData?.selfieImages?.selfieFile || null,
    });

    // Trạng thái điều khiển Camera
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Đồng bộ lại UI nếu người dùng lùi/tiến bước
    useEffect(() => {
        if (initialData?.selfieImages) {
            setSelfieData({
                selfiePreview: initialData.selfieImages.selfiePreview || null,
                selfieFile: initialData.selfieImages.selfieFile || null,
            });
        }
    }, [initialData]);

    // 💡 HÀM MỚI: Chuyển đổi chuỗi Base64 (từ canvas chụp ảnh) thành đối tượng File vật lý
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

            // Lật ngược ảnh trước khi vẽ lên canvas để không bị ngược chiều
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);

            // Vẽ frame hiện tại lên canvas và xuất ra dạng URL Base64
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageUrl = canvas.toDataURL('image/jpeg');

            // 💡 CẬP NHẬT: Tạo ra File vật lý từ chuỗi Base64
            const capturedFile = dataURLtoFile(imageUrl, 'selfie_captured.jpg');

            // Lưu cả preview và file gốc vào State
            setSelfieData({
                selfiePreview: imageUrl,
                selfieFile: capturedFile
            });

            stopCamera(); // Chụp xong thì tắt Camera
        }
    };

    // Hàm xử lý nếu tải ảnh lên từ máy tính (qua component ImageUpload)
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
        // Đóng gói data chuyển sang Bước 6
        onNext({ selfieImages: selfieData });
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
                                label="Tải ảnh lên"
                                hint="Kéo thả hoặc chọn ảnh PNG/JPG tối đa 10MB"
                                image={selfieData.selfiePreview}
                                onUpload={(url, file) => handleUpload(url, file)}
                                onRemove={handleRemove}
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

                        {/* Nút điều hướng */}
                        <div className={styles.bottomAction}>
                            <button type="button" className={styles.backBtn} onClick={onPrev}>
                                Quay lại
                            </button>

                            <button
                                type="submit"
                                className={styles.nextBtn}
                                disabled={!selfieData.selfieFile} // Khóa nếu chưa có file vật lý
                            >
                                So sánh khuôn mặt
                            </button>
                        </div>
                    </div>

                    {/* CỘT PHẢI: XEM TRƯỚC KẾT QUẢ */}
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