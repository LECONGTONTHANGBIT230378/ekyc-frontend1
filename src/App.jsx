import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import CustomerRegistration from './pages/CustomerRegistration/CustomerRegistration';
import CustomerManagement from './pages/CustomerManagement/CustomerManagement';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import AuthenticationHistory from './pages/AuthenticationHistory/AuthenticationHistory';
import Reports from './pages/Reports/Reports';
import AccountSettings from './pages/AccountSettings/AccountSettings';
import AccountManagement from './pages/AccountManagement/AccountManagement';

import Sidebar from './components/Common/Sidebar';
import Navbar from './components/Common/Navbar';

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

// COMPONENT BẢO VỆ ĐƯỜNG DẪN
// COMPONENT BẢO VỆ ĐƯỜNG DẪN (ĐÃ CHỐNG LẶP VÔ HẠN)
const ProtectedRoute = ({ children, allowedRoles }) => {
    const rawRole = localStorage.getItem('role') || 'EMPLOYEE';
    const upperRole = String(rawRole).toUpperCase();
    const normalizedRole = upperRole.includes('ADMIN') ? 'ADMIN' : 'EMPLOYEE';

    // ĐÃ SỬA: Gắn thêm state chứa câu thông báo khi bị đẩy về trang /login
    if (!localStorage.getItem('token')) {
        return <Navigate
            to="/login"
            state={{ errorMsg: 'Bạn cần đăng nhập tài khoản mới có thể vào hệ thống.' }}
            replace
        />;
    }

    if (!allowedRoles.includes(normalizedRole)) {
        return <Navigate to={normalizedRole === 'ADMIN' ? "/dashboard" : "/registration"} replace />;
    }

    return children;
};

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            {/* CÁC TRANG CỦA ADMIN (Chỉ ADMIN mới vào được) */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><MainLayout><Reports title="Báo cáo" /></MainLayout></ProtectedRoute>} />
            <Route path="/accounts" element={<ProtectedRoute allowedRoles={['ADMIN']}><MainLayout><AccountManagement title="Quản lý tài khoản" /></MainLayout></ProtectedRoute>} />

            {/* CÁC TRANG DÙNG CHUNG (Cả ADMIN và EMPLOYEE đều vào được) */}
            <Route path="/registration" element={<ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}><MainLayout><CustomerRegistration /></MainLayout></ProtectedRoute>} />
            <Route path="/customers" element={<ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}><MainLayout><CustomerManagement /></MainLayout></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}><MainLayout><AuthenticationHistory /></MainLayout></ProtectedRoute>} />
        </Routes>
    );
}

export default App;