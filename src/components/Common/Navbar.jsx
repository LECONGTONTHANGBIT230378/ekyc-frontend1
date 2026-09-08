import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import styles from './Navbar.module.css';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const getPageTitle = () => {
        if (location.pathname.includes('dashboard')) return 'Tổng quan';
        if (location.pathname.includes('registration')) return 'Đăng ký khách hàng';
        if (location.pathname.includes('customers')) return 'Quản lý khách hàng';
        return 'Hệ thống';
    };

    // ==========================================
    // ĐÃ SỬA: Hàm xử lý đăng xuất chuẩn
    // ==========================================
    const handleLogout = () => {
        // Xóa toàn bộ Token và Role của tab hiện tại
        sessionStorage.clear();

        // Điều hướng về trang đăng nhập
        navigate('/login', { replace: true });
    };

    return (
        <header className={styles.navbar}>
            <div className={styles.titleGroup}>
                <span className={styles.supTitle}>MỤC</span>
                <h1 className={styles.mainTitle}>{getPageTitle()}</h1>
            </div>

            <div className={styles.actions}>
                {/* Gọi hàm handleLogout khi bấm */}
                <button className={styles.logoutBtn} onClick={handleLogout}>
                    <FiLogOut /> Đăng xuất
                </button>
            </div>
        </header>
    );
};

export default Navbar;