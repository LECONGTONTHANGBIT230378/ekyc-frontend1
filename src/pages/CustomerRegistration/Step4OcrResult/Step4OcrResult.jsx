import React, { useState } from 'react';
import InputField from '../../../components/Form/InputField.jsx';
import styles from './Step4OcrResult.module.css';

const Step4OcrResult = ({ onNext, onPrev, initialData }) => {
    // Trạng thái lưu trữ dữ liệu OCR.
    // Dữ liệu này giả lập AI đã đọc được từ Bước 3.
    const [ocrData, setOcrData] = useState({
        idNumber: initialData?.ocrData?.idNumber || '079099123456',
        fullName: initialData?.ocrData?.fullName || 'NGUYỄN VĂN A',
        dob: initialData?.ocrData?.dob || '01/01/1999',
        gender: initialData?.ocrData?.gender || 'Nam',
        nationality: initialData?.ocrData?.nationality || 'Việt Nam',
        homeTown: initialData?.ocrData?.homeTown || 'Ba Đình, Hà Nội',
        address: initialData?.ocrData?.address || 'Quận Ba Đình, TP Hà Nội'
    });

    // Lấy ảnh gốc từ Bước 2 truyền sang để hiển thị đối chiếu
    const frontImage = initialData?.cccdImages?.front;
    const backImage = initialData?.cccdImages?.back;

    const handleChange = (e) => {
        setOcrData({ ...ocrData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext({ finalOcrData: ocrData }); // Chuyển data OCR đã chỉnh sửa sang bước tiếp theo
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Kết quả nhận diện OCR</h2>
                <p>Vui lòng kiểm tra và đối chiếu thông tin được trích xuất với ảnh giấy tờ gốc. Bạn có thể chỉnh sửa nếu hệ thống nhận diện chưa chính xác.</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.formWrapper}>
                <div className={styles.contentGrid}>

                    {/* CỘT TRÁI: FORM THÔNG TIN TRÍCH XUẤT */}
                    <div className={styles.leftColumn}>
                        <h3 className={styles.sectionTitle}>Thông tin văn bản</h3>
                        <div className={styles.formGrid}>
                            <InputField label="Số CCCD" name="idNumber" value={ocrData.idNumber} onChange={handleChange} required />
                            <InputField label="Họ và tên" name="fullName" value={ocrData.fullName} onChange={handleChange} required />
                            <InputField label="Ngày sinh" name="dob" value={ocrData.dob} onChange={handleChange} required />
                            <InputField label="Giới tính" name="gender" value={ocrData.gender} onChange={handleChange} required />
                            <InputField label="Quốc tịch" name="nationality" value={ocrData.nationality} onChange={handleChange} required />

                            {/* Thẻ div rỗng để căn ô Input cho đẹp */}
                            <div></div>

                            <div className={styles.fullWidth}>
                                <InputField label="Quê quán" name="homeTown" value={ocrData.homeTown} onChange={handleChange} required />
                            </div>
                            <div className={styles.fullWidth}>
                                <InputField label="Nơi thường trú" name="address" value={ocrData.address} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI: ẢNH GIẤY TỜ GỐC */}
                    <div className={styles.rightColumn}>
                        <h3 className={styles.sectionTitle}>Ảnh đối chiếu</h3>
                        <div className={styles.imageCard}>
                            <span className={styles.imageLabel}>Mặt trước</span>
                            {frontImage ? (
                                <img src={frontImage} alt="Mặt trước CCCD" className={styles.previewImg} />
                            ) : (
                                <div className={styles.noImage}>Chưa có ảnh mặt trước</div>
                            )}
                        </div>

                        <div className={styles.imageCard}>
                            <span className={styles.imageLabel}>Mặt sau</span>
                            {backImage ? (
                                <img src={backImage} alt="Mặt sau CCCD" className={styles.previewImg} />
                            ) : (
                                <div className={styles.noImage}>Chưa có ảnh mặt sau</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.actionGroup}>
                    <button type="button" className={styles.backBtn} onClick={onPrev}>Quay lại</button>
                    <button type="submit" className={styles.nextBtn}>Tiếp tục tải Selfie ›</button>
                </div>
            </form>
        </div>
    );
};

export default Step4OcrResult;