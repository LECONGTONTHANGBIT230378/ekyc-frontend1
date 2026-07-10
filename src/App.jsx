import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CustomerRegistration from './pages/CustomerRegistration/CustomerRegistration';
// 1. Import các trang và component
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
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

function App() {
    return (
        <Routes>
            {/* Tự động nhảy sang trang login khi vào web */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Trang đăng nhập độc lập */}
            <Route path="/login" element={<Login />} />

            {/* BỎ CODE TẠM: Hiển thị Dashboard thật bọc trong MainLayout */}
            <Route
                path="/dashboard"
                element={
                    <MainLayout>
                        <Dashboard />
                    </MainLayout>
                }
            />

            <Route
                path="/registration"
                element={
                    <MainLayout>
                        <CustomerRegistration />
                    </MainLayout>
                }
            />
        </Routes>
    );
}

export default App;