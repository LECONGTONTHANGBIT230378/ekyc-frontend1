import React, { useState, useEffect } from 'react';
import { FiEye, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { historyService } from '../../services/historyService';
import AuthenticationDetailModal from './AuthenticationDetailModal';
import styles from '../CustomerManagement/CustomerManagement.module.css';

const AuthenticationHistory = () => {
    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState(null);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                size: 10,
                keyword: searchKeyword,
                paged: true // ĐÃ THÊM: Bắt buộc truyền lên để Backend trả về dạng Phân trang (Pageable)
            };
            if (statusFilter !== 'ALL') {
                params.status = statusFilter;
            }

            const response = await historyService.getAllHistory(params);

            // BÓC TÁCH DỮ LIỆU THÔNG MINH BAO PHỦ MỌI TRƯỜNG HỢP
            let dataList = [];
            let total = 1;

            if (response && (response.success === true || response.code === 200)) {
                if (response.data && response.data.content) { // Dạng Phân trang Page<T>
                    dataList = response.data.content;
                    total = response.data.totalPages || 1;
                } else { // Dạng Danh sách List<T>
                    dataList = response.data || [];
                }
            } else if (response && response.content) {
                dataList = response.content;
                total = response.totalPages || 1;
            } else if (Array.isArray(response)) {
                dataList = response;
            }

            setHistoryList(dataList);
            setTotalPages(total);
        } catch (error) {
            console.error('Lỗi khi tải lịch sử xác thực:', error);
            setHistoryList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [currentPage, searchKeyword, statusFilter]);

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
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && setCurrentPage(0)}
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
                        ) : historyList.length === 0 ? (
                            <tr><td colSpan="6" className={styles.emptyState}>Không có lịch sử xác thực nào.</td></tr>
                        ) : (
                            historyList.map((item) => {
                                // MAPPING DỮ LIỆU
                                const cccd = item.customer?.cccdNumber || item.customer?.cccdInformation?.cccdNumber || 'N/A';
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
                                                <span style={{ color: displayScore >= 80 ? '#16A34A' : '#DC2626', fontWeight: 600 }}>
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