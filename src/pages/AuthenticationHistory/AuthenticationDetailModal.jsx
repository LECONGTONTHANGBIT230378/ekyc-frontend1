import React from 'react';
import { FiX, FiUser } from 'react-icons/fi';

const AuthenticationDetailModal = ({ isOpen, onClose, record }) => {
    if (!isOpen || !record) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modalContent}>

                {/* === HEADER === */}
                <div style={styles.header}>
                    <h3 style={styles.title}>Chi tiết giao dịch</h3>
                    <button onClick={onClose} style={styles.closeBtn}>
                        <FiX size={20} />
                    </button>
                </div>

                {/* === BODY === */}
                <div style={styles.body}>

                    {/* Khu vực Avatar và Tên khách hàng */}
                    <div style={styles.profileSection}>
                        <div style={styles.avatar}>
                            <FiUser size={32} color="#9ca3af" />
                        </div>
                        <div style={styles.profileInfo}>
                            <div style={styles.customerName}>{record.customerName}</div>
                            <div style={styles.statusBadge}>
                                {record.status === 'success' ? 'Thành công' : 'Thất bại'}
                            </div>
                        </div>
                    </div>

                    {/* Khung chứa các thông tin chi tiết (Chia 2 cột) */}
                    <div style={styles.detailsBox}>
                        <div style={styles.gridContainer}>

                            <div style={styles.gridItem}>
                                <div style={styles.label}>Mã giao dịch</div>
                                <div style={styles.value}>{record.txnId}</div>
                            </div>

                            <div style={styles.gridItem}>
                                <div style={styles.label}>Thời gian</div>
                                <div style={styles.value}>{record.time}</div>
                            </div>

                            <div style={styles.gridItem}>
                                <div style={styles.label}>Phương thức</div>
                                <div style={styles.value}>{record.method}</div>
                            </div>

                            <div style={styles.gridItem}>
                                <div style={styles.label}>Địa chỉ IP</div>
                                <div style={styles.value}>{record.ipAddress}</div>
                            </div>

                        </div>
                    </div>

                </div>

                {/* === FOOTER === */}
                <div style={styles.footer}>
                    <button onClick={onClose} style={styles.primaryBtn}>
                        Hoàn tất
                    </button>
                </div>

            </div>
        </div>
    );
};

// === HỆ THỐNG STYLE ĐỒNG BỘ THEO ẢNH THAM KHẢO ===
const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '560px', // Chiều rộng vừa phải, cân đối như trong ảnh
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column'
    },
    // -- Header --
    header: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 24px',
        borderBottom: '1px solid #f3f4f6' // Vạch kẻ ngang mờ
    },
    title: {
        margin: 0, fontSize: '16px', color: '#111827', fontWeight: 600
    },
    closeBtn: {
        background: 'transparent', border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: '#6b7280'
    },
    // -- Body --
    body: {
        padding: '0 24px 24px 24px'
    },
    // Khu vực Profile (Avatar + Tên)
    profileSection: {
        display: 'flex', alignItems: 'center', gap: '20px',
        padding: '24px 0 20px 0'
    },
    avatar: {
        width: '64px', height: '64px', borderRadius: '50%',
        backgroundColor: '#f3f4f6', // Nền xám nhạt cho avatar
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    profileInfo: {
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px'
    },
    customerName: {
        fontSize: '20px', fontWeight: 700, color: '#111827'
    },
    statusBadge: {
        padding: '4px 12px',
        borderRadius: '16px',
        border: '1px solid #d1d5db', // Viền mảnh bọc quanh text
        backgroundColor: '#ffffff',
        color: '#4b5563',
        fontSize: '12px',
        fontWeight: 500
    },
    // Khung dữ liệu (Grid box)
    detailsBox: {
        backgroundColor: '#fcfcfc', // Màu nền hơi ngả kem/xám cực nhẹ giống ảnh
        border: '1px solid #f0f0f0',
        borderRadius: '12px',
        padding: '24px'
    },
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr', // Chia 2 cột đều nhau
        rowGap: '24px',
        columnGap: '24px'
    },
    gridItem: {
        display: 'flex', flexDirection: 'column', gap: '6px'
    },
    label: {
        fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px'
    },
    value: {
        fontSize: '15px', color: '#111827', fontWeight: 500
    },
    // -- Footer --
    footer: {
        padding: '16px 24px',
        borderTop: '1px solid #f3f4f6', // Vạch kẻ ngang mờ
        display: 'flex', justifyContent: 'flex-end'
    },
    primaryBtn: {
        padding: '10px 24px',
        backgroundColor: '#1f2937', // Nút màu đen/xám đậm giống ảnh
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '14px'
    }
};

export default AuthenticationDetailModal;