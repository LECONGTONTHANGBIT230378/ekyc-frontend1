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
        expiryDate: '',
        dob: '',
        fullName: '',
        gender: '',
        nationality: '' // ĐÃ THÊM: Quản lý lỗi Quốc tịch
    });

    const validateIdNumber = (value) => {
        const regex = /^\d{12}$/;
        if (!value || !value.trim()) return 'Vui lòng nhập số CCCD.';
        if (!regex.test(value.trim())) return 'Số CCCD không hợp lệ. Vui lòng nhập đúng 12 chữ số.';
        return '';
    };

    const validateFullName = (value) => {
        if (!value || !value.trim()) return 'Vui lòng nhập họ và tên.';
        if (/\d/.test(value)) return 'Họ và tên không được chứa chữ số.';
        return '';
    };

    // ====================================================================
    // ĐÃ THÊM: HÀM VALIDATE QUỐC TỊCH (KHÔNG CHỨA SỐ)
    // ====================================================================
    const validateNationality = (value) => {
        if (!value || !value.trim()) return 'Vui lòng nhập quốc tịch.';
        if (/\d/.test(value)) return 'Quốc tịch không được chứa chữ số.';
        return '';
    };

    const validateDob = (value) => {
        if (!value || !value.trim()) return 'Vui lòng nhập ngày sinh.';

        const parts = value.trim().split('/');
        if (parts.length !== 3) return 'Định dạng ngày không hợp lệ (DD/MM/YYYY).';

        const dayStr = parts[0];
        const monthStr = parts[1];
        const yearStr = parts[2];

        if (yearStr.length !== 4) return 'Năm sinh phải bao gồm đúng 4 chữ số.';

        const day = parseInt(dayStr, 10);
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);

        if (isNaN(day) || isNaN(month) || isNaN(year)) return 'Ngày tháng năm không hợp lệ.';

        if (month < 1 || month > 12) return 'Tháng sinh không được lớn hơn 12.';
        if (day < 1 || day > 31) return 'Ngày sinh không được lớn hơn 31.';

        const dobDate = new Date(year, month - 1, day);
        if (dobDate.getFullYear() !== year || dobDate.getMonth() !== month - 1 || dobDate.getDate() !== day) {
            return 'Ngày sinh này không tồn tại trên lịch.';
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dobDate > today) {
            return 'Ngày sinh không được vượt quá ngày hiện tại (ở tương lai).';
        }

        return '';
    };

    const validateGender = (value) => {
        if (!value || !value.trim()) return 'Vui lòng nhập giới tính.';

        const normalized = value.trim().toLowerCase();
        if (normalized !== 'nam' && normalized !== 'nữ') {
            return 'Giới tính chỉ được nhập "Nam" hoặc "Nữ".';
        }
        return '';
    };

    const validateExpiryDate = (value) => {
        if (!value || !value.trim()) return 'Vui lòng nhập ngày hết hạn.';

        const parts = value.trim().split('/');
        if (parts.length !== 3) return 'Định dạng ngày không hợp lệ (DD/MM/YYYY).';

        const dayStr = parts[0];
        const monthStr = parts[1];
        const yearStr = parts[2];

        if (yearStr.length !== 4) return 'Năm hết hạn phải bao gồm đúng 4 chữ số.';

        const day = parseInt(dayStr, 10);
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);

        if (isNaN(day) || isNaN(month) || isNaN(year)) return 'Ngày tháng năm không hợp lệ.';

        if (month < 1 || month > 12) return 'Tháng không được lớn hơn 12.';
        if (day < 1 || day > 31) return 'Ngày không được lớn hơn 31.';

        const expiry = new Date(year, month - 1, day);
        if (expiry.getFullYear() !== year || expiry.getMonth() !== month - 1 || expiry.getDate() !== day) {
            return 'Ngày hết hạn này không tồn tại trên lịch.';
        }

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
        const initialFullName = latestSaved.fullName || latestApi.fullName || latestApi.full_name || '';
        const initialDob = latestSaved.dob || latestApi.birthday || latestApi.dateOfBirth || latestApi.dob || '';
        const initialGender = latestSaved.gender || latestApi.gender || '';
        const initialNationality = latestSaved.nationality || latestApi.nationality || 'Việt Nam'; // Đã thêm
        const initialExpiry = latestSaved.expiryDate || latestApi.expiryDate || latestApi.dateOfExpiry || latestApi.date_of_expiry || '';

        setOcrData({
            idNumber: initialId,
            fullName: initialFullName,
            dob: initialDob,
            gender: initialGender,
            nationality: initialNationality,
            expiryDate: initialExpiry,
            homeTown: latestSaved.homeTown || latestApi.placeOfOrigin || latestApi.hometown || latestApi.homeTown || '',
            address: latestSaved.address || latestApi.placeOfResidence || latestApi.residence || latestApi.address || ''
        });

        setErrors({
            idNumber: initialId ? validateIdNumber(initialId) : '',
            fullName: initialFullName ? validateFullName(initialFullName) : '',
            expiryDate: initialExpiry ? validateExpiryDate(initialExpiry) : '',
            dob: initialDob ? validateDob(initialDob) : '',
            gender: initialGender ? validateGender(initialGender) : '',
            nationality: initialNationality ? validateNationality(initialNationality) : '' // Validate ngay khi load
        });
    }, [initialData]);

    const handleBack = () => {
        onPrev({ finalOcrData: ocrData });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'idNumber') {
            if (/[^\d]/.test(value)) {
                e.target.value = ocrData.idNumber;
                return;
            }
        }
        else if (name === 'dob' || name === 'expiryDate') {
            if (/[^\d/]/.test(value)) {
                e.target.value = ocrData[name];
                return;
            }
        }

        setOcrData({ ...ocrData, [name]: value });

        // Real-time validation
        if (name === 'idNumber') {
            setErrors(prev => ({ ...prev, idNumber: validateIdNumber(value) }));
        }
        if (name === 'fullName') {
            setErrors(prev => ({ ...prev, fullName: validateFullName(value) }));
        }
        if (name === 'nationality') {
            setErrors(prev => ({ ...prev, nationality: validateNationality(value) })); // Gọi hàm validate khi gõ
        }
        if (name === 'expiryDate') {
            setErrors(prev => ({ ...prev, expiryDate: validateExpiryDate(value) }));
        }
        if (name === 'dob') {
            setErrors(prev => ({ ...prev, dob: validateDob(value) }));
        }
        if (name === 'gender') {
            setErrors(prev => ({ ...prev, gender: validateGender(value) }));
        }
    };

    const isFormComplete = Object.values(ocrData).every(val => val !== null && val !== undefined && val.toString().trim() !== '');

    // ĐÃ SỬA: Thêm errors.nationality vào list check
    const hasErrors = !!errors.idNumber || !!errors.fullName || !!errors.expiryDate || !!errors.dob || !!errors.gender || !!errors.nationality;

    const isNextDisabled = !isFormComplete || hasErrors;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isNextDisabled) {
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

                            <InputField
                                label="Họ và tên"
                                name="fullName"
                                value={ocrData.fullName}
                                onChange={handleChange}
                                required
                                error={errors.fullName}
                            />

                            <InputField
                                label="Ngày sinh"
                                name="dob"
                                value={ocrData.dob}
                                onChange={handleChange}
                                required
                                error={errors.dob}
                            />

                            <InputField
                                label="Giới tính"
                                name="gender"
                                value={ocrData.gender}
                                onChange={handleChange}
                                required
                                error={errors.gender}
                            />

                            {/* ĐÃ SỬA: Truyền prop error vào trường Quốc tịch */}
                            <InputField
                                label="Quốc tịch"
                                name="nationality"
                                value={ocrData.nationality}
                                onChange={handleChange}
                                required
                                error={errors.nationality}
                            />

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
                        disabled={isNextDisabled}
                        style={{
                            opacity: isNextDisabled ? 0.6 : 1,
                            cursor: isNextDisabled ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Tiếp tục tải Selfie ›
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step4OcrResult;