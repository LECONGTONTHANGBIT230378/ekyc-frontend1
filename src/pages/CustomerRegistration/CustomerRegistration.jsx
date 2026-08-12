import React, { useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import styles from './CustomerRegistration.module.css';

// Import các component bước
import Step1Info from './Step1Info/Step1Info';
import Step2Upload from './Step2Upload/Step2Upload';
import Step3Detection from './Step3Detection/Step3Detection';
import Step4OcrResult from './Step4OcrResult/Step4OcrResult';
import Step5Selfie from './Step5Selfie/Step5Selfie';
import Step6FaceMatch from './Step6FaceMatch/Step6FaceMatch';
import Step7Success from './Step7Success/Step7Success';

const STEPS = [
    'Thông tin', 'Tải CCCD', 'Nhận diện', 'Kết quả OCR',
    'Tải Selfie', 'So khớp', 'Hoàn tất'
];

const CustomerRegistration = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({});

    const handleNextStep = (stepData) => {
        setFormData(prev => ({ ...prev, ...stepData }));
        setCurrentStep(prev => prev + 1);
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1Info onNext={handleNextStep} initialData={formData?.combinedData} />;
            case 2:
                const step1Data = formData?.combinedData || {};
                const step2Data = formData?.cccdImages || {};

                // Đã loại bỏ mặt sau, chỉ giữ lại mặt trước (front preview) và file gốc (frontFile)
                const combinedImages = {
                    front: step2Data.front || step1Data.frontImage || null,
                    frontFile: step2Data.frontFile || step1Data.frontFile || null
                };

                return (
                    <Step2Upload
                        onNext={handleNextStep}
                        onPrev={handlePrevStep}
                        initialData={combinedImages}
                    />
                );
            case 3:
                return <Step3Detection onNext={handleNextStep} onPrev={handlePrevStep} initialData={formData} />;
            case 4:
                return <Step4OcrResult onNext={handleNextStep} onPrev={handlePrevStep} initialData={formData} />;
            case 5:
                return <Step5Selfie onNext={handleNextStep} onPrev={handlePrevStep} initialData={formData} />;
            case 6:
                return <Step6FaceMatch onNext={handleNextStep} onPrev={handlePrevStep} initialData={formData} />;
            case 7:
                return <Step7Success onPrev={handlePrevStep} initialData={formData} />;
            default:
                return (
                    <div className={styles.comingSoon}>
                        <h3>Bước {currentStep} đang được xử lý...</h3>
                        <button onClick={handlePrevStep} className={styles.backBtn}>Quay lại</button>
                    </div>
                );
        }
    };

    return (
        /* Chỉ giữ lại Khung bọc trang và Stepper, sử dụng đúng class trong CSS của bạn */
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