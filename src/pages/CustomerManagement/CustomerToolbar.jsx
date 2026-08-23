import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import styles from './CustomerManagement.module.css';

const CustomerToolbar = ({ onSearch }) => {
    const [inputValue, setInputValue] = useState('');

    // ====================================================================
    // ĐÃ THÊM: Kỹ thuật Debounce (Trì hoãn thực thi) để tự động tìm kiếm
    // ====================================================================
    useEffect(() => {
        // Đặt một bộ đếm thời gian 500ms (0.5 giây)
        const delaySearch = setTimeout(() => {
            onSearch(inputValue);
        }, 500);

        // Cleanup function: Nếu người dùng tiếp tục gõ trước khi hết 0.5s,
        // nó sẽ hủy bộ đếm cũ đi và bắt đầu đếm lại từ đầu.
        return () => clearTimeout(delaySearch);

    }, [inputValue, onSearch]);
    // useEffect sẽ tự động chạy lại mỗi khi inputValue thay đổi (tức là mỗi khi gõ phím)

    return (
        <div className={styles.toolbar}>
            <div className={styles.searchBox}>
                <FiSearch className={styles.searchIcon} />
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Tìm kiếm theo mã, tên, CCCD, số điện thoại..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    // ĐÃ XÓA: Bỏ onKeyDown={handleKeyDown} vì không cần ấn Enter nữa
                />
            </div>
        </div>
    );
};

export default CustomerToolbar;