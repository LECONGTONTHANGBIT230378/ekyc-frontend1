import React from 'react';
import { FiX, FiCheckCircle, FiXCircle } from 'react-icons/fi';
// Tái sử dụng style của module CustomerManagement
import styles from '../CustomerManagement/CustomerManagement.module.css';

const AuthenticationDetailModal = ({ historyData, onClose }) => {
    if (!historyData) return null;

    // Mapping dữ liệu từ Spring Boot (EkycHistory entity)
    const resultStatus = historyData.result || 'N/A';
    const isSuccess = resultStatus === 'MATCHED' || resultStatus === 'SUCCESS' || resultStatus === 'VERIFIED';

    // Xử lý điểm similarityScore (Nhân 100 nếu trả về dạng thập phân 0.x)
    let score = historyData.similarityScore;
    let displayScore = (score !== undefined && score !== null) ? (score <= 1 ? score * 100 : score).toFixed(2) : null;

    // Lấy thông tin quan hệ từ Customer và CccdInformation
    const customer = historyData.customer || {};
    const cccdInfo = customer.cccdInformation || {};

    return (
        <div className={styles.modalOverlay} onClick={onClose} style={{ zIndex: 1050 }}>
            <div className={styles.modalContent} style={{ width: '700px', maxWidth: '95%' }} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                        Chi tiết giao dịch #{historyData.id || historyData.verification_id}
                        {isSuccess ?
                            <FiCheckCircle style={{ color: '#16A34A', fontSize: '20px' }}/> :
                            <FiXCircle style={{ color: '#DC2626', fontSize: '20px' }}/>
                        }
                    </h3>
                    <button className={styles.closeBtn} onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '20px' }}>
                        <FiX />
                    </button>
                </div>

                <div className={styles.modalBody} style={{ maxHeight: '75vh', overflowY: 'auto', padding: '20px' }}>

                    {/* KHU VỰC ẢNH ĐỐI CHIẾU AI (NẾU CÓ) */}
                    {(historyData.faceImageUrl || cccdInfo.frontImageUrl) && (
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', justifyContent: 'center' }}>
                            {cccdInfo.frontImageUrl && (
                                <div style={{ textAlign: 'center', flex: 1 }}>
                                    <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '8px', fontWeight: 600 }}>ẢNH CĂN CƯỚC</p>
                                    <img src={cccdInfo.frontImageUrl} alt="CCCD" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                                </div>
                            )}
                            {historyData.faceImageUrl && (
                                <div style={{ textAlign: 'center', flex: 1 }}>
                                    <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '8px', fontWeight: 600 }}>ẢNH AI NHẬN DIỆN (SELFIE)</p>
                                    <img src={historyData.faceImageUrl} alt="Selfie Face" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                                </div>
                            )}
                        </div>
                    )}

                    {/* KHỐI KẾT QUẢ AI */}
                    <h4 style={{ fontSize: '16px', color: '#1E293B', marginBottom: '12px', borderBottom: '2px solid #F1F5F9', paddingBottom: '8px' }}>
                        Kết quả xác thực AI
                    </h4>
                    <div className={styles.infoBox} style={{ marginBottom: '24px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '13px', color: '#64748B' }}>Điểm khuôn mặt (Face Match)</span>
                                <span style={{ color: displayScore >= 80 ? '#16A34A' : '#DC2626', fontSize: '18px', fontWeight: 'bold' }}>
                                    {displayScore !== null ? `${displayScore}%` : 'Không xác định'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '13px', color: '#64748B' }}>Trạng thái hệ thống</span>
                                <span style={{ fontWeight: 600, color: isSuccess ? '#16A34A' : '#DC2626' }}>
                                    {resultStatus === 'MATCHED' ? 'Khớp hợp lệ' : resultStatus === 'NOT_MATCHED' ? 'Không trùng khớp' : resultStatus}
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
                                <span style={{ fontSize: '13px', color: '#64748B' }}>Thời gian thực hiện</span>
                                <span style={{ fontWeight: 500 }}>
                                    {historyData.verifyTime ? new Date(historyData.verifyTime.replace(' ', 'T')).toLocaleString('vi-VN') : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* KHỐI THÔNG TIN OCR & KHÁCH HÀNG */}
                    <h4 style={{ fontSize: '16px', color: '#1E293B', marginBottom: '12px', borderBottom: '2px solid #F1F5F9', paddingBottom: '8px' }}>
                        Dữ liệu bóc tách (OCR) & Khách hàng
                    </h4>
                    <div className={styles.infoBox} style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
                                <span style={{ fontSize: '13px', color: '#64748B' }}>Số CCCD</span>
                                <span style={{ fontWeight: 600, fontSize: '15px' }}>{cccdInfo.cccdNumber || customer.cccdNumber || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
                                <span style={{ fontSize: '13px', color: '#64748B' }}>Họ và tên</span>
                                <span style={{ fontWeight: 600, fontSize: '15px' }}>{cccdInfo.fullName || customer.fullName || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '13px', color: '#64748B' }}>Ngày sinh</span>
                                <span style={{ fontWeight: 500 }}>{cccdInfo.dateOfBirth || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '13px', color: '#64748B' }}>Giới tính</span>
                                <span style={{ fontWeight: 500 }}>{cccdInfo.gender || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
                                <span style={{ fontSize: '13px', color: '#64748B' }}>Nơi thường trú</span>
                                <span style={{ fontWeight: 500 }}>{cccdInfo.placeOfResidence || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div className={styles.modalFooter} style={{ padding: '16px 20px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        style={{ padding: '8px 24px', backgroundColor: '#3B82F6', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                        onClick={onClose}
                    >
                        Đóng cửa sổ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthenticationDetailModal;