import React, { useState, useEffect } from 'react';
import { FiEye, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { historyService } from '../../services/historyService';
import AuthenticationDetailModal from './AuthenticationDetailModal';
import styles from '../CustomerManagement/CustomerManagement.module.css';

const AuthenticationHistory = () => {
    // State lưu TOÀN BỘ dữ liệu lấy từ API
    const [fullDataList, setFullDataList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);

    // State quản lý tìm kiếm
    const [inputValue, setInputValue] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');

    const [statusFilter, setStatusFilter] = useState('ALL');
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState(null);

    // Kích hoạt tính năng tìm kiếm sau 0.5s ngừng gõ phím
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            setSearchKeyword(inputValue);
            setCurrentPage(0); // Về trang đầu tiên khi có kết quả mới
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [inputValue]);

    // GỌI API LẤY DỮ LIỆU
    const fetchHistory = async () => {
        setLoading(true);
        try {
            // Lấy lượng lớn dữ liệu (VD: 1000 bản ghi) để Frontend tự do lọc
            const params = {
                page: 0,
                size: 1000,
                paged: true
            };
            if (statusFilter !== 'ALL') {
                params.status = statusFilter;
            }

            const response = await historyService.getAllHistory(params);

            let dataList = [];
            if (response && (response.success === true || response.code === 200)) {
                if (response.data && response.data.content) {
                    dataList = response.data.content;
                } else {
                    dataList = response.data || [];
                }
            } else if (response && response.content) {
                dataList = response.content;
            } else if (Array.isArray(response)) {
                dataList = response;
            }

            setFullDataList(dataList);
        } catch (error) {
            console.error('Lỗi khi tải lịch sử xác thực:', error);
            setFullDataList([]);
        } finally {
            setLoading(false);
        }
    };

    // Chỉ gọi lại API khi đổi trạng thái (ALL/Khớp/Không Khớp)
    // KHÔNG gọi lại API khi gõ tìm kiếm nữa
    useEffect(() => {
        fetchHistory();
    }, [statusFilter]);

    // HÀM FORMAT HIỂN THỊ
    const getStatusBadgeClass = (status) => {
        const s = status?.toUpperCase() || '';
        if (s === 'VERIFIED' || s === 'SUCCESS' || s === 'MATCHED') return styles.badgeVerified;
        if (s === 'PENDING') return styles.badgePending;
        if (s === 'FAILED' || s === 'REJECTED' || s === 'NOT_MATCHED') return styles.badgeFailed;
        return styles.badgePending;
    };

    const formatDateTime = (dateVal) => {
        if (!dateVal) return 'N/A';
        let date;
        if (Array.isArray(dateVal)) {
            date = new Date(dateVal[0], dateVal[1] - 1, dateVal[2], dateVal[3] || 0, dateVal[4] || 0, dateVal[5] || 0);
        } else {
            let dateStr = typeof dateVal === 'string' ? dateVal.replace(' ', 'T') : dateVal;
            date = new Date(dateStr);
        }
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleString('vi-VN', {
            hour: '2-digit', minute: '2-digit',
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    // ====================================================================
    // BỘ LỌC MA THUẬT: NHẬP GÌ RA ĐÓ (LỌC TRỰC TIẾP TRÊN FRONTEND)
    // ====================================================================
    const filteredData = fullDataList.filter(item => {
        if (!searchKeyword) return true;

        const kw = searchKeyword.toLowerCase().trim();

        // Dựng lại chính xác các chữ sẽ hiển thị ra màn hình
        const idStr = `#${item.id || item.verification_id}`;
        const cccd = item.cccdNumber || item.customer?.cccdNumber || item.customer?.cccdInformation?.cccdNumber || 'N/A';
        const timeStr = formatDateTime(item.verifyTime);

        let score = item.similarityScore;
        let displayScore = (score !== undefined && score !== null) ? (score <= 1 ? score * 100 : score) : null;
        const scoreStr = displayScore !== null ? `${Number(displayScore).toFixed(2)}%` : 'N/A';

        const status = item.result || item.verificationResult || 'N/A';
        const statusStr = status === 'MATCHED' ? 'khớp' : status === 'NOT_MATCHED' ? 'không khớp' : status.toLowerCase();

        // So khớp từ khóa với tất cả các trường
        return idStr.toLowerCase().includes(kw) ||
            cccd.toLowerCase().includes(kw) ||
            timeStr.toLowerCase().includes(kw) ||
            scoreStr.toLowerCase().includes(kw) ||
            statusStr.includes(kw);
    });

    // ====================================================================
    // PHÂN TRANG CỤC BỘ (Tính toán trang hiện tại dựa trên dữ liệu đã lọc)
    // ====================================================================
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
    const currentDisplayData = filteredData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const renderPagination = () => {
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(0, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(0, endPage - maxVisible + 1);
        }

        if (startPage > 0) {
            pages.push(<button key="first" className={styles.pageBtn} onClick={() => setCurrentPage(0)}>1</button>);
            if (startPage > 1) pages.push(<span key="dots-start" className={styles.dots}>...</span>);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button key={i} className={`${styles.pageBtn} ${currentPage === i ? styles.activePage : ''}`} onClick={() => setCurrentPage(i)}>
                    {i + 1}
                </button>
            );
        }

        if (endPage < totalPages - 1) {
            if (endPage < totalPages - 2) pages.push(<span key="dots-end" className={styles.dots}>...</span>);
            pages.push(<button key="last" className={styles.pageBtn} onClick={() => setCurrentPage(totalPages - 1)}>{totalPages}</button>);
        }

        return (
            <div className={styles.pagination}>
                <button className={`${styles.pageBtn} ${currentPage === 0 ? styles.disabledBtn : ''}`} onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0}>
                    <FiChevronLeft />
                </button>
                {pages}
                <button className={`${styles.pageBtn} ${currentPage === totalPages - 1 || totalPages === 0 ? styles.disabledBtn : ''}`} onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))} disabled={currentPage === totalPages - 1 || totalPages === 0}>
                    <FiChevronRight />
                </button>
            </div>
        );
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.mainCard}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Lịch sử xác thực</h2>
                    <p className={styles.subtitle}>Theo dõi các giao dịch eKYC, nhận diện OCR và đối chiếu khuôn mặt.</p>
                </div>

                <div className={styles.toolbar}>
                    <div className={styles.searchBox}>
                        <FiSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Tìm kiếm mã giao dịch, CCCD..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                    <select
                        className={styles.filterBtn}
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(0); }}
                        style={{ outline: 'none' }}
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="MATCHED">Khớp (Matched)</option>
                        <option value="NOT_MATCHED">Không khớp (Not Matched)</option>
                    </select>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                        <thead>
                        <tr>
                            <th>Mã GD (ID)</th>
                            <th>Số CCCD</th>
                            <th>Thời gian</th>
                            <th>Điểm Face Match</th>
                            <th>Trạng thái</th>
                            <th className={styles.actionHeader}>Chi tiết</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className={styles.emptyState}>Đang tải dữ liệu...</td></tr>
                        ) : currentDisplayData.length === 0 ? (
                            <tr><td colSpan="6" className={styles.emptyState}>Không có lịch sử xác thực nào.</td></tr>
                        ) : (
                            // ========================================================
                            // ĐÃ SỬA: Hiển thị từ mảng currentDisplayData (đã lọc & phân trang)
                            // ========================================================
                            currentDisplayData.map((item) => {
                                const cccd = item.cccdNumber || item.customer?.cccdNumber || item.customer?.cccdInformation?.cccdNumber || 'N/A';
                                const time = item.verifyTime;
                                let score = item.similarityScore;
                                let displayScore = (score !== undefined && score !== null) ? (score <= 1 ? score * 100 : score) : null;
                                const status = item.result || item.verificationResult || 'N/A';

                                return (
                                    <tr key={item.id || item.verification_id}>
                                        <td style={{ fontWeight: 600 }}>#{item.id || item.verification_id}</td>
                                        <td>{cccd}</td>
                                        <td>{formatDateTime(time)}</td>
                                        <td>
                                            {displayScore !== null ? (
                                                <span style={{ color: displayScore >= 50 ? '#16A34A' : '#DC2626', fontWeight: 600 }}>
                                                    {Number(displayScore).toFixed(2)}%
                                                </span>
                                            ) : 'N/A'}
                                        </td>
                                        <td>
                                            <span className={`${styles.badge} ${getStatusBadgeClass(status)}`}>
                                                {status === 'MATCHED' ? 'Khớp' : status === 'NOT_MATCHED' ? 'Không khớp' : status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.actionGroup}>
                                                <button
                                                    className={styles.iconBtn}
                                                    title="Xem chi tiết"
                                                    onClick={async () => {
                                                        try {
                                                            const historyId = item.id || item.verification_id;
                                                            const res = await historyService.getHistoryById(historyId);
                                                            const detailData = res.data || res;
                                                            setSelectedHistory(detailData);
                                                            setViewModalOpen(true);
                                                        } catch (error) {
                                                            console.error("Lỗi lấy chi tiết:", error);
                                                            alert("Không thể tải chi tiết lịch sử!");
                                                        }
                                                    }}
                                                >
                                                    <FiEye />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>

                {renderPagination()}
            </div>

            {viewModalOpen && (
                <AuthenticationDetailModal
                    historyData={selectedHistory}
                    onClose={() => setViewModalOpen(false)}
                />
            )}
        </div>
    );
};

export default AuthenticationHistory;