import React, { useState, useEffect } from 'react';
import InputField from '../../../components/Form/InputField.jsx';
import styles from './Step4OcrResult.module.css';

const Step4OcrResult = ({ onNext, onPrev, initialData }) => {
    const frontImage = initialData?.cccdImages?.front;

    const apiData = initialData?.ocrData || {};
    const savedData = initialData?.finalOcrData || {};

    const [ocrData, setOcrData] = useState({
        idNumber: savedData.idNumber || apiData.cccdNumber || apiData.cccd_number || apiData.idNumber || '',
        fullName: savedData.fullName || apiData.fullName || apiData.full_name || '',
        dob: savedData.dob || apiData.birthday || apiData.dateOfBirth || apiData.dob || '',
        gender: savedData.gender || apiData.gender || '',
        nationality: savedData.nationality || apiData.nationality || 'Việt Nam',
        expiryDate: savedData.expiryDate || apiData.expiryDate || apiData.dateOfExpiry || apiData.date_of_expiry || '',
        homeTown: savedData.homeTown || apiData.placeOfOrigin || apiData.hometown || apiData.homeTown || '',
        address: savedData.address || apiData.placeOfResidence || apiData.residence || apiData.address || ''
    });

    const [errors, setErrors] = useState({
        idNumber: '',
        expiryDate: ''
    });

    const validateIdNumber = (value) => {
        const regex = /^\d{12}$/;
        if (!value || !value.trim()) return 'Vui lòng nhập số CCCD.';
        if (!regex.test(value.trim())) return 'Số CCCD không hợp lệ. Vui lòng nhập đúng 12 chữ số.';
        return '';
    };

    const validateExpiryDate = (value) => {
        if (!value || !value.trim()) return 'Vui lòng nhập ngày hết hạn.';

        const parts = value.trim().split('/');
        if (parts.length !== 3) return 'Định dạng ngày không hợp lệ (DD/MM/YYYY).';

        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);

        const expiry = new Date(year, month, day);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (expiry < today) {
            return 'Căn cước công dân đã hết hạn sử dụng.';
        }
        return '';
    };

    useEffect(() => {
        const latestSaved = initialData?.finalOcrData || {};
        const latestApi = initialData?.ocrData || {};

        const initialId = latestSaved.idNumber || latestApi.cccdNumber || latestApi.cccd_number || latestApi.idNumber || '';
        const initialExpiry = latestSaved.expiryDate || latestApi.expiryDate || latestApi.dateOfExpiry || latestApi.date_of_expiry || '';

        setOcrData({
            idNumber: initialId,
            fullName: latestSaved.fullName || latestApi.fullName || latestApi.full_name || '',
            dob: latestSaved.dob || latestApi.birthday || latestApi.dateOfBirth || latestApi.dob || '',
            gender: latestSaved.gender || latestApi.gender || '',
            nationality: latestSaved.nationality || latestApi.nationality || 'Việt Nam',
            expiryDate: initialExpiry,
            homeTown: latestSaved.homeTown || latestApi.placeOfOrigin || latestApi.hometown || latestApi.homeTown || '',
            address: latestSaved.address || latestApi.placeOfResidence || latestApi.residence || latestApi.address || ''
        });

        setErrors({
            idNumber: initialId ? validateIdNumber(initialId) : '',
            expiryDate: initialExpiry ? validateExpiryDate(initialExpiry) : ''
        });
    }, [initialData]);

    const handleBack = () => {
        onPrev({ finalOcrData: ocrData });
    };

    // ====================================================================
    // ĐÃ SỬA: Cưỡng chế DOM khôi phục giá trị cũ nếu phát hiện nhập chữ
    // ====================================================================
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'idNumber') {
            // Nếu có chữ cái
            if (/[^\d]/.test(value)) {
                // Ép giao diện (DOM) hiển thị lại chính xác dãy số cũ
                e.target.value = ocrData.idNumber;
                return; // Chặn hệ thống lại, coi như phím chưa từng được gõ
            }
        }
        else if (name === 'dob' || name === 'expiryDate') {
            // Nếu có chữ cái (chỉ chấp nhận số và dấu gạch chéo)
            if (/[^\d/]/.test(value)) {
                e.target.value = ocrData[name];
                return;
            }
        }

        setOcrData({ ...ocrData, [name]: value });

        if (name === 'idNumber') {
            setErrors(prev => ({ ...prev, idNumber: validateIdNumber(value) }));
        }
        if (name === 'expiryDate') {
            setErrors(prev => ({ ...prev, expiryDate: validateExpiryDate(value) }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const idError = validateIdNumber(ocrData.idNumber);
        const expiryError = validateExpiryDate(ocrData.expiryDate);

        if (idError || expiryError) {
            setErrors({
                ...errors,
                idNumber: idError,
                expiryDate: expiryError
            });
            return;
        }

        onNext({ finalOcrData: ocrData });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Kết quả nhận diện OCR</h2>
                <p>Vui lòng kiểm tra và đối chiếu thông tin được trích xuất với ảnh giấy tờ gốc. Bạn có thể chỉnh sửa nếu hệ thống nhận diện chưa chính xác.</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.formWrapper} noValidate>
                <div className={styles.contentGrid}>

                    <div className={styles.leftColumn}>
                        <h3 className={styles.sectionTitle}>Thông tin văn bản</h3>
                        <div className={styles.formGrid}>

                            <InputField
                                label="Số CCCD"
                                name="idNumber"
                                value={ocrData.idNumber}
                                onChange={handleChange}
                                required
                                error={errors.idNumber}
                            />

                            <InputField label="Họ và tên" name="fullName" value={ocrData.fullName} onChange={handleChange} required />
                            <InputField label="Ngày sinh" name="dob" value={ocrData.dob} onChange={handleChange} required />
                            <InputField label="Giới tính" name="gender" value={ocrData.gender} onChange={handleChange} required />
                            <InputField label="Quốc tịch" name="nationality" value={ocrData.nationality} onChange={handleChange} required />

                            <InputField
                                label="Ngày hết hạn"
                                name="expiryDate"
                                value={ocrData.expiryDate}
                                onChange={handleChange}
                                required
                                error={errors.expiryDate}
                            />

                            <div className={styles.fullWidth}>
                                <InputField label="Quê quán" name="homeTown" value={ocrData.homeTown} onChange={handleChange} required />
                            </div>
                            <div className={styles.fullWidth}>
                                <InputField label="Nơi thường trú" name="address" value={ocrData.address} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

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
                    <button
                        type="submit"
                        className={styles.nextBtn}
                        disabled={!!errors.idNumber || !!errors.expiryDate}
                    >
                        Tiếp tục tải Selfie ›
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step4OcrResult;