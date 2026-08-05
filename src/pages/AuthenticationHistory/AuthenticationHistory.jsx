import React, { useState } from 'react';
import { FiSearch, FiEye, FiFilter, FiChevronLeft, FiChevronRight, FiClock } from 'react-icons/fi';
import styles from './AuthenticationHistory.module.css';

// Import Modal từ component vừa tạo
import AuthenticationDetailModal from './AuthenticationDetailModal';

// Dữ liệu mẫu
const getHistoryData = () => {
    const methods = ['Khuôn mặt & CCCD', 'Mật khẩu OTP', 'Vân tay'];
    const data = [];
    for (let i = 1; i <= 45; i++) {
        const isSuccess = Math.random() > 0.3;
        const randomDay = Math.floor(10 + Math.random() * 6);

        data.push({
            txnId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
            customerName: `Khách hàng ${i}`,
            time: `${randomDay}/07/2026 ${Math.floor(10 + Math.random() * 10)}:${Math.floor(10 + Math.random() * 49)}`,
            method: methods[i % 3],
            status: isSuccess ? 'success' : 'failed',
            ipAddress: `192.168.1.${Math.floor(1 + Math.random() * 254)}`
        });
    }
    return data;
};

const removeVietnameseTones = (str) => {
    if (!str) return "";
    return str.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
};

const formatToDDMMYYYY = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
};

const AuthenticationHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterDate, setFilterDate] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [histories] = useState(getHistoryData());

    // State quản lý Modal
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    // Hàm mở/đóng Modal
    const handleViewDetails = (record) => {
        setSelectedRecord(record);
        setIsViewModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsViewModalOpen(false);
        setSelectedRecord(null);
    };

    // Lọc dữ liệu
    const filteredHistories = histories.filter(record => {
        const keyword = removeVietnameseTones(searchTerm);
        const name = removeVietnameseTones(record.customerName);
        const txnId = removeVietnameseTones(record.txnId);

        const matchesSearch = name.includes(keyword) || txnId.includes(keyword);
        const matchesStatus = filterStatus === 'all' || record.status === filterStatus;

        const targetDate = formatToDDMMYYYY(filterDate);
        const matchesDate = filterDate === '' || record.time.startsWith(targetDate);

        return matchesSearch && matchesStatus && matchesDate;
    });

    const totalPages = Math.ceil(filteredHistories.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentHistories = filteredHistories.slice(indexOfFirstItem, indexOfLastItem);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleSelectFilter = (status) => {
        setFilterStatus(status);
        setIsFilterOpen(false);
        setCurrentPage(1);
    };

    const handleDateChange = (e) => {
        setFilterDate(e.target.value);
        setCurrentPage(1);
    };

    const getPaginationNumbers = () => {
        const total = totalPages;
        const current = currentPage;
        if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
        if (current <= 3) return [1, 2, 3, 4, '...', total];
        if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
        return [1, '...', current - 1, current, current + 1, '...', total];
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.mainCard}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Lịch sử xác thực</h2>
                    <p className={styles.subtitle}>Theo dõi và kiểm tra các phiên xác thực danh tính (eKYC) của khách hàng trên hệ thống.</p>
                </div>

                <div className={styles.toolbar}>
                    <div className={styles.searchBox}>
                        <FiSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo mã giao dịch hoặc tên khách hàng..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <input
                            type="date"
                            className={styles.dateInput}
                            value={filterDate}
                            onChange={handleDateChange}
                        />

                        <div className={styles.filterWrapper}>
                            <button className={styles.filterBtn} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                                <FiFilter style={{ marginRight: '8px' }} />
                                {filterStatus === 'all' ? 'Tất cả trạng thái' : filterStatus === 'success' ? 'Thành công' : 'Thất bại'}
                            </button>

                            {isFilterOpen && (
                                <div className={styles.filterDropdown}>
                                    <div className={`${styles.filterOption} ${filterStatus === 'all' ? styles.activeFilter : ''}`} onClick={() => handleSelectFilter('all')}>Tất cả</div>
                                    <div className={`${styles.filterOption} ${filterStatus === 'success' ? styles.activeFilter : ''}`} onClick={() => handleSelectFilter('success')}>Thành công</div>
                                    <div className={`${styles.filterOption} ${filterStatus === 'failed' ? styles.activeFilter : ''}`} onClick={() => handleSelectFilter('failed')}>Thất bại</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                        <thead>
                        <tr>
                            <th>Mã GD</th>
                            <th>Thời gian</th>
                            <th>Khách hàng</th>
                            <th>Phương thức</th>
                            <th>IP Truy cập</th>
                            <th>Trạng thái</th>
                            <th className={styles.actionHeader}>Chi tiết</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentHistories.length > 0 ? (
                            currentHistories.map((record, index) => (
                                <tr key={index}>
                                    <td style={{ fontWeight: 600, color: '#1A1A1A' }}>{record.txnId}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <FiClock color="#888" /> {record.time}
                                        </div>
                                    </td>
                                    <td>{record.customerName}</td>
                                    <td>{record.method}</td>
                                    <td>{record.ipAddress}</td>
                                    <td>
                                        {record.status === 'success' ? (
                                            <span className={`${styles.badge} ${styles.badgeSuccess}`}>Thành công</span>
                                        ) : (
                                            <span className={`${styles.badge} ${styles.badgeFailed}`}>Thất bại</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className={styles.actionGroup}>
                                            <button
                                                className={styles.iconBtn}
                                                title="Xem chi tiết log"
                                                onClick={() => handleViewDetails(record)}
                                            >
                                                <FiEye />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className={styles.emptyState}>Không tìm thấy lịch sử giao dịch nào.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            className={`${styles.pageBtn} ${currentPage === 1 ? styles.disabledBtn : ''}`}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <FiChevronLeft size={18} />
                        </button>

                        {getPaginationNumbers().map((item, index) => (
                            item === '...' ? (
                                <span key={`dots-${index}`} className={styles.dots}>...</span>
                            ) : (
                                <button
                                    key={item}
                                    className={`${styles.pageBtn} ${currentPage === item ? styles.activePage : ''}`}
                                    onClick={() => setCurrentPage(item)}
                                >
                                    {item}
                                </button>
                            )
                        ))}

                        <button
                            className={`${styles.pageBtn} ${currentPage === totalPages ? styles.disabledBtn : ''}`}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <FiChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* Render Component Modal vừa tách */}
            <AuthenticationDetailModal
                isOpen={isViewModalOpen}
                onClose={handleCloseModal}
                record={selectedRecord}
            />
        </div>
    );
};

export default AuthenticationHistory;