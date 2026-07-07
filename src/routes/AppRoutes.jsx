import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard'; // Nhớ import trang Dashboard
import Sidebar from '../components/Common/Sidebar';
import Navbar from '../components/Common/Navbar';

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

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            {/* Route bọc Layout cho Dashboard */}
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        </Routes>
    );
};

export default AppRoutes;