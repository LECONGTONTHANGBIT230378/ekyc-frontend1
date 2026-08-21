import React, { useState, useEffect } from 'react';
import InputField from '../../../components/Form/InputField.jsx';
import styles from './Step4OcrResult.module.css';

const Step4OcrResult = ({ onNext, onPrev, initialData }) => {
    // Lấy ảnh gốc mặt trước từ Bước 2
    const frontImage = initialData?.cccdImages?.front;

    // Lấy dữ liệu OCR từ API Bước 3 trả về
    const apiData = initialData?.ocrData || {};
    const savedData = initialData?.finalOcrData || {};

    const [ocrData, setOcrData] = useState({
        // Ưu tiên 1: Dữ liệu đã sửa. Ưu tiên 2: Dữ liệu AI. Ưu tiên 3: Rỗng
        idNumber: savedData.idNumber || apiData.cccdNumber || apiData.cccd_number || apiData.idNumber || '',
        fullName: savedData.fullName || apiData.fullName || apiData.full_name || '',
        dob: savedData.dob || apiData.birthday || apiData.dateOfBirth || apiData.dob || '',
        gender: savedData.gender || apiData.gender || '',
        nationality: savedData.nationality || apiData.nationality || 'Việt Nam',
        expiryDate: savedData.expiryDate || apiData.expiryDate || apiData.dateOfExpiry || apiData.date_of_expiry || '',
        homeTown: savedData.homeTown || apiData.placeOfOrigin || apiData.hometown || apiData.homeTown || '',
        address: savedData.address || apiData.placeOfResidence || apiData.residence || apiData.address || ''
    });

    useEffect(() => {
        // Mỗi khi initialData cập nhật, đồng bộ lại State theo đúng nguyên tắc ưu tiên trên
        const latestSaved = initialData?.finalOcrData || {};
        const latestApi = initialData?.ocrData || {};

        setOcrData({
            idNumber: latestSaved.idNumber || latestApi.cccdNumber || latestApi.cccd_number || latestApi.idNumber || '',
            fullName: latestSaved.fullName || latestApi.fullName || latestApi.full_name || '',
            dob: latestSaved.dob || latestApi.birthday || latestApi.dateOfBirth || latestApi.dob || '',
            gender: latestSaved.gender || latestApi.gender || '',
            nationality: latestSaved.nationality || latestApi.nationality || 'Việt Nam',
            expiryDate: latestSaved.expiryDate || latestApi.expiryDate || latestApi.dateOfExpiry || latestApi.date_of_expiry || '',
            homeTown: latestSaved.homeTown || latestApi.placeOfOrigin || latestApi.hometown || latestApi.homeTown || '',
            address: latestSaved.address || latestApi.placeOfResidence || latestApi.residence || latestApi.address || ''
        });
    }, [initialData]);

    // Đồng thời, gắn thêm tính năng bảo lưu vào nút Quay Lại (đóng gói finalOcrData)
    const handleBack = () => {
        onPrev({ finalOcrData: ocrData });
    };

    const handleChange = (e) => {
        setOcrData({ ...ocrData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext({ finalOcrData: ocrData });
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

                            {/* ĐÃ THÊM: Input Ngày hết hạn thay thế cho thẻ div rỗng */}
                            <InputField label="Ngày hết hạn" name="expiryDate" value={ocrData.expiryDate} onChange={handleChange} required />

                            <div className={styles.fullWidth}>
                                <InputField label="Quê quán" name="homeTown" value={ocrData.homeTown} onChange={handleChange} required />
                            </div>
                            <div className={styles.fullWidth}>
                                <InputField label="Nơi thường trú" name="address" value={ocrData.address} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI: ẢNH GIẤY TỜ GỐC */}
                    <div className={styles.rightColumn} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h3 className={styles.sectionTitle}>Ảnh đối chiếu</h3>
                        <div className={styles.imageCard}>
                            <span className={styles.imageLabel}>Mặt trước</span>
                            {frontImage ? (
                                <img src={frontImage} alt="Mặt trước CCCD" className={styles.previewImg} />
                            ) : (
                                <div className={styles.noImage}>Chưa có ảnh mặt trước</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.actionGroup}>
                    <button type="button" className={styles.backBtn} onClick={handleBack}>Quay lại</button>
                    <button type="submit" className={styles.nextBtn}>Tiếp tục tải Selfie ›</button>
                </div>
            </form>
        </div>
    );
};

export default Step4OcrResult;