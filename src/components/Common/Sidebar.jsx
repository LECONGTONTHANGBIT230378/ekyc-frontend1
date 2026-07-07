import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiPieChart, FiUserPlus, FiUsers, FiClock, FiFileText, FiSettings } from 'react-icons/fi';
import styles from './Sidebar.module.css';

const menuItems = [
    { path: '/dashboard', name: 'Tổng Quan', icon: <FiPieChart /> },
    { path: '/registration', name: 'Đăng ký khách hàng', icon: <FiUserPlus /> },
    { path: '/customers', name: 'Quản lý khách hàng', icon: <FiUsers /> },
    { path: '/history', name: 'Lịch sử xác thực', icon: <FiClock /> },
    { path: '/reports', name: 'Báo cáo', icon: <FiFileText /> },
    { path: '/settings', name: 'Tài khoản', icon: <FiSettings /> },
];

const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoWrapper}>
                <div className={styles.logoIcon}>V</div>
                <div className={styles.logoText}>
                    <h2>Veritas</h2>
                    <span>HỒ SƠ ĐỊNH DANH</span>
                </div>
            </div>

            <nav className={styles.navMenu}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                        }
                    >
                        <span className={styles.icon}>{item.icon}</span>
                        <span className={styles.name}>{item.name}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;