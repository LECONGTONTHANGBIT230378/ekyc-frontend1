import React, { useState } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import styles from './CustomerManagement.module.css';

const CustomerToolbar = ({ searchTerm, onSearchChange, filterStatus, onFilterChange }) => {
    // Chuyển state đóng/mở menu lọc sang đây để Component tự quản lý
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Xử lý khi người dùng click chọn 1 bộ lọc
    const handleSelectFilter = (status) => {
        onFilterChange(status); // Gửi dữ liệu về cho file cha (CustomerManagement)
        setIsFilterOpen(false); // Đóng menu
    };

    return (
        <div className={styles.toolbar}>
            <div className={styles.searchBox}>
                <FiSearch className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo mã, tên, CCCD hoặc số điện thoại..."
                    value={searchTerm}
                    onChange={onSearchChange}
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.filterWrapper}>
                <button className={styles.filterBtn} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                    <FiFilter style={{ marginRight: '8px' }} /> Lọc trạng thái
                </button>

                {isFilterOpen && (
                    <div className={styles.filterDropdown}>
                        <div
                            className={`${styles.filterOption} ${filterStatus === 'all' ? styles.activeFilter : ''}`}
                            onClick={() => handleSelectFilter('all')}
                        >
                            Tất cả trạng thái
                        </div>
                        <div
                            className={`${styles.filterOption} ${filterStatus === 'verified' ? styles.activeFilter : ''}`}
                            onClick={() => handleSelectFilter('verified')}
                        >
                            Đã xác thực
                        </div>
                        <div
                            className={`${styles.filterOption} ${filterStatus === 'pending' ? styles.activeFilter : ''}`}
                            onClick={() => handleSelectFilter('pending')}
                        >
                            Đang chờ
                        </div>
                        <div
                            className={`${styles.filterOption} ${filterStatus === 'failed' ? styles.activeFilter : ''}`}
                            onClick={() => handleSelectFilter('failed')}
                        >
                            Thất bại
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerToolbar;