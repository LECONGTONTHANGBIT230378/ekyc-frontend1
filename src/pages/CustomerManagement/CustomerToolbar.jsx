import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import styles from './CustomerManagement.module.css';

const CustomerToolbar = ({ onSearch }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch(inputValue);
        }
    };

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
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
};

export default CustomerToolbar;