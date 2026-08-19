import React, { useState, useEffect } from 'react';
import InputField from '../../../components/Form/InputField.jsx';
import styles from './Step4OcrResult.module.css';

const Step4OcrResult = ({ onNext, onPrev, initialData }) => {
    // Lấy ảnh gốc mặt trước từ Bước 2
    const frontImage = initialData?.cccdImages?.front;

    // Lấy dữ liệu OCR từ API Bước 3 trả về
    const apiData = initialData?.ocrData || {};

    // Khởi tạo state chứa các trường dữ liệu, bao phủ các biến thể tên biến từ Backend
    const [ocrData, setOcrData] = useState({
        idNumber: apiData.cccdNumber || apiData.cccd_number || apiData.idNumber || '',
        fullName: apiData.fullName || apiData.full_name || '',
        dob: apiData.birthday || apiData.dateOfBirth || apiData.dob || '',
        gender: apiData.gender || '',
        nationality: apiData.nationality || 'Việt Nam',
        // ĐÃ THÊM: Ngày hết hạn
        expiryDate: apiData.expiryDate || apiData.dateOfExpiry || apiData.date_of_expiry || '',
        homeTown: apiData.placeOfOrigin || apiData.hometown || apiData.homeTown || '',
        address: apiData.placeOfResidence || apiData.residence || apiData.address || ''
    });

    // Đồng bộ lại form khi dữ liệu API load xong
    useEffect(() => {
        if (initialData?.ocrData) {
            setOcrData({
                idNumber: apiData.cccdNumber || apiData.cccd_number || apiData.idNumber || '',
                fullName: apiData.fullName || apiData.full_name || '',
                dob: apiData.birthday || apiData.dateOfBirth || apiData.dob || '',
                gender: apiData.gender || '',
                nationality: apiData.nationality || 'Việt Nam',
                // ĐÃ THÊM: Ngày hết hạn
                expiryDate: apiData.expiryDate || apiData.dateOfExpiry || apiData.date_of_expiry || '',
                homeTown: apiData.placeOfOrigin || apiData.hometown || apiData.homeTown || '',
                address: apiData.placeOfResidence || apiData.residence || apiData.address || ''
            });

            // Dòng này giúp bạn debug: Bật F12 -> Console để xem chính xác Backend trả về chữ gì
            console.log("Dữ liệu OCR từ Backend trả về:", apiData);
        }
    }, [initialData]);

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
                    <button type="button" className={styles.backBtn} onClick={onPrev}>Quay lại</button>
                    <button type="submit" className={styles.nextBtn}>Tiếp tục tải Selfie ›</button>
                </div>
            </form>
        </div>
    );
};

export default Step4OcrResult;