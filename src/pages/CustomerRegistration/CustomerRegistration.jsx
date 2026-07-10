import React, { useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import styles from './CustomerRegistration.module.css';

// Import Bước 1 và Bước 2
import Step1Info from './Step1Info/Step1Info';
import Step2Upload from './Step2Upload/Step2Upload';
import Step3Detection from './Step3Detection/Step3Detection';
import Step4OcrResult from './Step4OcrResult/Step4OcrResult';
import Step5Selfie from './Step5Selfie/Step5Selfie';
import Step6FaceMatch from './Step6FaceMatch/Step6FaceMatch';
import Step7Success from './Step7Success/Step7Success';
const STEPS = [
    'Thông tin',
    'Tải CCCD',
    'Nhận diện',
    'Kết quả OCR',
    'Tải Selfie',
    'So khớp',
    'Hoàn tất'
];

const CustomerRegistration = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({}); // Lưu trữ data xuyên suốt 7 bước

    // Chuyển sang bước tiếp theo
    const handleNextStep = (stepData) => {
        setFormData(prev => ({ ...prev, ...stepData }));
        setCurrentStep(prev => prev + 1);
    };

    // Lùi lại bước trước
    const handlePrevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    // Điều hướng hiển thị Bước
    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                // Truyền lại dữ liệu nếu người dùng quay lại bước 1
                return <Step1Info onNext={handleNextStep} initialData={formData?.combinedData} />;

            case 2:
                // 1. Lấy dữ liệu từ Bước 1
                const step1Data = formData?.combinedData || {};

                // 2. Lấy dữ liệu Bước 2 (Nếu người dùng đã up ở B2 rồi lùi lại)
                const step2Data = formData?.cccdImages || {};

                // 3. GỘP DỮ LIỆU: Lấy mặt trước và mặt sau từ Bước 1 truyền vào Bước 2
                const combinedImages = {
                    front: step2Data.front || step1Data.frontImage || null,
                    back: step2Data.back || step1Data.backImage || null
                };

                return (
                    <Step2Upload
                        onNext={handleNextStep}
                        onPrev={handlePrevStep}
                        initialData={combinedImages}
                    />
                );
            case 3:
                // 2. MỞ KHÓA BƯỚC 3, CHÚ Ý: truyền toàn bộ formData xuống để lấy được ảnh
                return <Step3Detection onNext={handleNextStep} onPrev={handlePrevStep} initialData={formData} />;
            case 4:
                // 2. MỞ KHÓA BƯỚC 4
                return <Step4OcrResult onNext={handleNextStep} onPrev={handlePrevStep} initialData={formData} />;
            case 5:
                // 2. MỞ KHÓA BƯỚC 5 VÀ TRUYỀN DATA
                return <Step5Selfie onNext={handleNextStep} onPrev={handlePrevStep} initialData={formData} />;
            case 6:
                // 2. MỞ KHÓA BƯỚC 6 VÀ TRUYỀN DATA ẢNH
                return <Step6FaceMatch onNext={handleNextStep} onPrev={handlePrevStep} initialData={formData} />;
            case 7:
                // CHÚ Ý CHỖ NÀY: Phải có mặt onPrev={handlePrevStep} thì nút mới hoạt động
                return <Step7Success onPrev={handlePrevStep} initialData={formData} />;
            default:
                return (
                    <div className={styles.comingSoon}>
                        <h3>Bước {currentStep} đang được xây dựng...</h3>
                        <button onClick={handlePrevStep} className={styles.backBtn}>Quay lại</button>
                    </div>
                );
        }
    };

    return (
        <div className={styles.pageContainer}>
            {/* THANH TIẾN TRÌNH (STEPPER) */}
            <div className={styles.stepperWrapper}>
                <div className={styles.stepperContainer}>
                    {STEPS.map((step, index) => {
                        const stepNumber = index + 1;
                        const isActive = stepNumber === currentStep;
                        const isCompleted = stepNumber < currentStep;

                        return (
                            <div key={index} className={`${styles.stepItem} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}>
                                <div className={styles.stepCircle}>
                                    {isCompleted ? <FiCheck strokeWidth={3} /> : stepNumber}
                                </div>
                                <span className={styles.stepLabel}>{step}</span>
                                {index < STEPS.length - 1 && <div className={styles.stepLine}></div>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* NỘI DUNG TỪNG BƯỚC */}
            <div className={styles.stepContent}>
                {renderCurrentStep()}
            </div>
        </div>
    );
};

export default CustomerRegistration;