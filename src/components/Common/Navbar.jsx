import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiMoon, FiLogOut } from 'react-icons/fi';
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

    return (
        <header className={styles.navbar}>
            <div className={styles.titleGroup}>
                <span className={styles.supTitle}>MỤC</span>
                <h1 className={styles.mainTitle}>{getPageTitle()}</h1>
            </div>

            <div className={styles.actions}>
                <button className={styles.iconBtn}><FiMoon /></button>
                <button className={styles.logoutBtn} onClick={() => navigate('/login')}>
                    <FiLogOut /> Đăng xuất
                </button>
            </div>
        </header>
    );
};

export default Navbar;