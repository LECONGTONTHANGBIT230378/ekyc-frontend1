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

            // Logic đồng bộ ảnh từ Bước 1 sang Bước 2 (Giữ nguyên)
            if (stepData.combinedData) {
                newData.cccdImages = {
                    front: stepData.combinedData.frontImage || null,
                    frontFile: stepData.combinedData.frontFile || null
                };
            }

            // ====================================================================
            // ĐÃ THÊM: LOGIC "DỌN RÁC" KHI THAY ĐỔI ẢNH CĂN CƯỚC MỚI
            // ====================================================================
            const oldFrontFile = prev.cccdImages?.frontFile;
            const newFrontFile = newData.cccdImages?.frontFile;

            // Nếu hệ thống phát hiện File ảnh CCCD mới nộp lên KHÁC với File cũ trong bộ nhớ
            if (oldFrontFile && newFrontFile && oldFrontFile !== newFrontFile) {
                console.log("Phát hiện CCCD mới! Đang tiến hành xóa dữ liệu cũ...");

                // Tiêu diệt toàn bộ tàn tích của bộ hồ sơ cũ
                delete newData.ocrData;       // Xóa kết quả quét AI (Bước 3)
                delete newData.finalOcrData;  // Xóa kết quả gõ tay (Bước 4)
                delete newData.selfieImages;  // Xóa ảnh khuôn mặt (Bước 5)
            }

            return newData;
        });
        setCurrentStep(prev => prev + 1);
    };

    const handlePrevStep = (stepData) => {
        // KIỂM TRA BẢO MẬT: Đảm bảo stepData là 1 Object mang dữ liệu (tránh nhận nhầm sự kiện click chuột)
        if (stepData && typeof stepData === 'object' && !stepData.nativeEvent) {
            setFormData(prev => {
                const newData = { ...prev, ...stepData };

                // ====================================================================
                // ĐỒNG BỘ NGƯỢC: Nếu lùi từ Bước 2 về Bước 1, phải cập nhật lại
                // ảnh cho combinedData (vì Bước 1 đang dùng biến combinedData để hiển thị)
                // ====================================================================
                if (stepData.cccdImages) {
                    newData.combinedData = {
                        ...(prev.combinedData || {}),
                        frontImage: stepData.cccdImages.front,
                        frontFile: stepData.cccdImages.frontFile
                    };
                }

                return newData;
            });
        }

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