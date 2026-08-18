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
        setFormData(prev => {
            const newData = { ...prev, ...stepData };

            // FIX LỖI ĐỒNG BỘ ẢNH:
            // Nếu stepData có chứa combinedData (tức là người dùng vừa bấm "Tiếp tục" từ Bước 1)
            // Ta sẽ ghi đè lại dữ liệu ảnh của Bước 2 bằng ảnh mới nhất từ Bước 1
            if (stepData.combinedData) {
                newData.cccdImages = {
                    front: stepData.combinedData.frontImage || null,
                    frontFile: stepData.combinedData.frontFile || null
                };
            }

            return newData;
        });
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
                // Do đã đồng bộ ở handleNextStep, ta chỉ cần lấy thẳng từ cccdImages
                const step2Data = formData?.cccdImages || {};

                const combinedImages = {
                    front: step2Data.front || null,
                    frontFile: step2Data.frontFile || null
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
        <div className={styles.pageContainer}>
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

            <div className={styles.stepContent}>
                {renderCurrentStep()}
            </div>
        </div>
    );
};

export default CustomerRegistration;