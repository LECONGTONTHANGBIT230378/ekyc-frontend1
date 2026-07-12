import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 1. Import các trang
import CustomerRegistration from './pages/CustomerRegistration/CustomerRegistration';
import CustomerManagement from './pages/CustomerManagement/CustomerManagement';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import AuthenticationHistory from './pages/AuthenticationHistory/AuthenticationHistory';
import Reports from './pages/Reports/Reports';

// Import Layout
import Sidebar from './components/Common/Sidebar';
import Navbar from './components/Common/Navbar';

// 2. Tạo bộ khung (Layout) bọc ngoài các trang quản trị
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

// 3. Component tạm thời cho các trang chưa phát triển
const PlaceholderPage = ({ title }) => (
    <div style={{ padding: '40px', fontSize: '20px', color: '#666' }}>
        <h2>{title}</h2>
        <p>Giao diện đang trong quá trình phát triển...</p>
    </div>
);

function App() {
    return (
        <Routes>
            {/* Tự động nhảy sang trang login khi vào web */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Trang đăng nhập độc lập */}
            <Route path="/login" element={<Login />} />

            {/* CÁC TRANG CÓ SIDEBAR KHỚP 100% VỚI MENU */}

            {/* 1. Tổng quan */}
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />

            {/* 2. Đăng ký khách hàng */}
            <Route path="/registration" element={<MainLayout><CustomerRegistration /></MainLayout>} />

            {/* 3. Quản lý khách hàng */}
            <Route path="/customers" element={<MainLayout><CustomerManagement /></MainLayout>} />

            {/* 4. Lịch sử xác thực (ĐÃ SỬA LỖI Ở ĐÂY) */}
            <Route path="/history" element={<MainLayout><AuthenticationHistory /></MainLayout>} />

            {/* 5. Báo cáo */}
            <Route path="/reports" element={<MainLayout><Reports title="Báo cáo" /></MainLayout>} />

            {/* 6. Tài khoản */}
            <Route path="/settings" element={<MainLayout><PlaceholderPage title="Cài đặt tài khoản" /></MainLayout>} />

        </Routes>
    );
}

export default App;