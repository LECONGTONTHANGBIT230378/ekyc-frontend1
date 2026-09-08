import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi'; // Thêm icon cảnh báo

import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import Sidebar from '../components/Common/Sidebar';
import Navbar from '../components/Common/Navbar';
import AuthenticationHistory from '../pages/AuthenticationHistory/AuthenticationHistory';

// Import thêm các trang khác của bạn (Giả sử đường dẫn của bạn như sau)
import CustomerRegistration from '../pages/CustomerRegistration/CustomerRegistration';
import CustomerManagement from '../pages/CustomerManagement/CustomerManagement';
import AccountManagement from '../pages/AccountManagement/AccountManagement';
import Reports from '../pages/Reports/Reports';

// Khung Layout cho các trang bên trong
const MainLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <main style={{ padding: '0', flex: 1 }}>{children}</main>
            </div>
        </div>
    );
};

// ====================================================================
// ĐÃ SỬA: PROTECTED ROUTE HIỂN THỊ MODAL BẮT BUỘC ĐĂNG NHẬP
// ====================================================================
const ProtectedRoute = ({ children, allowedRoles }) => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');

    // 1. Nếu chưa có token -> Hiển thị màn hình mờ và Modal yêu cầu đăng nhập
    if (!token) {
        return (
            <div style={modalStyles.overlay}>
                <div style={modalStyles.modal}>
                    <div style={modalStyles.iconBox}>
                        <FiAlertTriangle size={32} />
                    </div>
                    <h3 style={modalStyles.title}>Yêu cầu đăng nhập</h3>
                    <p style={modalStyles.text}>
                        Phiên làm việc không tồn tại. Vui lòng đăng nhập tài khoản để truy cập vào hệ thống.
                    </p>
                    <button
                        style={modalStyles.button}
                        onClick={() => navigate('/login', { replace: true })}
                    >
                        Tiếp tục đăng nhập
                    </button>
                </div>
            </div>
        );
    }

    // 2. Nếu có token nhưng sai quyền (VD: Nhân viên mò vào trang Admin)
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/registration" replace />;
    }

    // 3. Hợp lệ -> Cho phép hiển thị trang
    return children;
};

// CSS Inline cho Modal để bạn không cần tạo thêm file CSS
const modalStyles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(5px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 9999, fontFamily: 'inherit'
    },
    modal: {
        backgroundColor: '#fff', padding: '32px', borderRadius: '16px',
        width: '380px', maxWidth: '90%', textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    iconBox: {
        width: '64px', height: '64px', backgroundColor: '#FEF2F2',
        color: '#EF4444', borderRadius: '50%', display: 'flex',
        justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px auto'
    },
    title: { margin: '0 0 12px 0', fontSize: '20px', color: '#111827', fontWeight: 'bold' },
    text: { margin: '0 0 24px 0', fontSize: '14px', color: '#6B7280', lineHeight: 1.5 },
    button: {
        width: '100%', padding: '12px', backgroundColor: '#1d3557', // Màu xanh Veritas
        color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px',
        fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
    }
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            {/* CÁC TRANG NGHIỆP VỤ BẮT BUỘC PHẢI BỌC BỞI <ProtectedRoute> */}

            <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <MainLayout><Dashboard /></MainLayout>
                </ProtectedRoute>
            } />

            <Route path="/registration" element={
                <ProtectedRoute>
                    <MainLayout><CustomerRegistration /></MainLayout>
                </ProtectedRoute>
            } />

            <Route path="/customers" element={
                <ProtectedRoute>
                    <MainLayout><CustomerManagement /></MainLayout>
                </ProtectedRoute>
            } />

            <Route path="/history" element={
                <ProtectedRoute>
                    <MainLayout><AuthenticationHistory /></MainLayout>
                </ProtectedRoute>
            } />

            <Route path="/reports" element={
                <ProtectedRoute>
                    <MainLayout><Reports /></MainLayout>
                </ProtectedRoute>
            } />

            <Route path="/accounts" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <MainLayout><AccountManagement /></MainLayout>
                </ProtectedRoute>
            } />

        </Routes>
    );
};

export default AppRoutes;