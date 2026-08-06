import React, { useState, useMemo, useRef, useEffect } from 'react';
import styles from './CustomerManagement.module.css';
import {
    FiSearch, FiFilter, FiEye, FiTrash2,
    FiChevronLeft, FiChevronRight, FiX
} from 'react-icons/fi';

// 1. DỮ LIỆU MẪU (Mở rộng thêm email, sđt, ngày tạo để hiển thị trong Modal)
const mockData = [
    { id: '001', name: 'Nguyễn Văn A', cccd: '079123456842', role: 'Khách hàng', status: 'Đã xác thực', phone: '0901234567', email: 'nguyenvana@gmail.com', createdAt: '10/08/2026' },
    { id: '002', name: 'Trần Minh', cccd: '036987654112', role: 'Đại lý', status: 'Đang chờ', phone: '0912345678', email: 'tranminh@gmail.com', createdAt: '11/08/2026' },
    { id: '003', name: 'Lê Thu', cccd: '045456789903', role: 'Khách hàng', status: 'Thất bại', phone: '0987654321', email: 'lethu@gmail.com', createdAt: '09/08/2026' },
    { id: '004', name: 'Phạm Văn Dũng', cccd: '012321654333', role: 'Khách hàng', status: 'Đã xác thực', phone: '0933334444', email: 'phamvandung@gmail.com', createdAt: '08/08/2026' },
    { id: '005', name: 'Hoàng Thị Yến', cccd: '034789123555', role: 'Quản trị viên', status: 'Đã xác thực', phone: '0977778888', email: 'hoangyen@gmail.com', createdAt: '07/08/2026' },
];

const FILTER_OPTIONS = ['Tất cả', 'Đã xác thực', 'Đang chờ', 'Thất bại'];

const CustomerManagement = () => {
    // STATE: Quản lý Tìm kiếm & Lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tất cả');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // STATE: Quản lý Modals
    const [viewModal, setViewModal] = useState({ isOpen: false, data: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, data: null });

    // Xử lý click ra ngoài để đóng Filter Dropdown
    const filterRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Logic Lọc & Tìm kiếm dữ liệu
    const filteredData = useMemo(() => {
        return mockData.filter(item => {
            const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.cccd.includes(searchTerm) ||
                item.id.includes(searchTerm);
            const matchFilter = statusFilter === 'Tất cả' || item.status === statusFilter;
            return matchSearch && matchFilter;
        });
    }, [searchTerm, statusFilter]);

    // Helpers UI
    const getStatusBadge = (status) => {
        let badgeClass = '';
        if (status === 'Đã xác thực') badgeClass = styles.badgeVerified;
        else if (status === 'Đang chờ') badgeClass = styles.badgePending;
        else if (status === 'Thất bại') badgeClass = styles.badgeFailed;
        return <span className={`${styles.badge} ${badgeClass}`}>{status}</span>;
    };

    const getInitials = (name) => {
        const parts = name.trim().split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        return name.charAt(0).toUpperCase();
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.mainCard}>

                {/* 1. HEADER */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Quản lý khách hàng</h2>
                    <p className={styles.subtitle}>Tìm kiếm, lọc, xem chi tiết, chỉnh sửa, xóa, thêm tài khoản và phân quyền.</p>
                </div>

                {/* 2. TOOLBAR (Tìm kiếm & Lọc) */}
                <div className={styles.toolbar}>
                    <div className={styles.searchBox}>
                        <FiSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Tìm kiếm theo mã, tên, CCCD..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterWrapper} ref={filterRef}>
                        <button
                            className={styles.filterBtn}
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <FiFilter style={{ marginRight: '8px' }} />
                            {statusFilter === 'Tất cả' ? 'Lọc trạng thái' : statusFilter}
                        </button>

                        {isFilterOpen && (
                            <div className={styles.filterDropdown}>
                                {FILTER_OPTIONS.map(option => (
                                    <div
                                        key={option}
                                        className={`${styles.filterOption} ${statusFilter === option ? styles.activeFilter : ''}`}
                                        onClick={() => {
                                            setStatusFilter(option);
                                            setIsFilterOpen(false);
                                        }}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. BẢNG DỮ LIỆU */}
                <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                        <thead>
                        <tr>
                            <th>Mã</th>
                            <th>Họ và tên</th>
                            <th>Số CCCD</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th className={styles.actionHeader}>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.id}</td>
                                    <td><strong>{row.name}</strong></td>
                                    <td>{row.cccd}</td>
                                    <td>{row.role}</td>
                                    <td>{getStatusBadge(row.status)}</td>
                                    <td>
                                        <div className={styles.actionGroup}>
                                            <button
                                                className={styles.iconBtn}
                                                title="Xem hồ sơ"
                                                onClick={() => setViewModal({ isOpen: true, data: row })}
                                            >
                                                <FiEye />
                                            </button>
                                            <button
                                                className={styles.iconBtn}
                                                style={{ color: '#EF4444' }} // Ghi đè màu đỏ cho nút xóa
                                                title="Xóa"
                                                onClick={() => setDeleteModal({ isOpen: true, data: row })}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className={styles.emptyState}>Không tìm thấy dữ liệu phù hợp.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* 4. PHÂN TRANG */}
                <div className={styles.pagination}>
                    <button className={`${styles.pageBtn} ${styles.disabledBtn}`} disabled><FiChevronLeft /></button>
                    <button className={`${styles.pageBtn} ${styles.activePage}`}>1</button>
                    <button className={styles.pageBtn}>2</button>
                    <button className={styles.pageBtn}>3</button>
                    <span className={styles.dots}>...</span>
                    <button className={styles.pageBtn}>12</button>
                    <button className={styles.pageBtn}><FiChevronRight /></button>
                </div>
            </div>

            {/* ================= MODAL XEM CHI TIẾT ================= */}
            {viewModal.isOpen && viewModal.data && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>Hồ sơ định danh</h3>
                            <button className={styles.closeBtn} onClick={() => setViewModal({ isOpen: false, data: null })}>
                                <FiX />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.profileSection}>
                                <div className={styles.avatarPlaceholder}>
                                    {getInitials(viewModal.data.name)}
                                </div>
                                <div className={styles.profileTitle}>
                                    <h2 className={styles.customerName}>{viewModal.data.name}</h2>
                                    <div className={styles.statusWrapper}>
                                        {getStatusBadge(viewModal.data.status)}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.infoBox}>
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Số CCCD</span>
                                        <span className={styles.infoValue}>{viewModal.data.cccd}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Vai trò</span>
                                        <span className={styles.infoValue}>{viewModal.data.role}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Số điện thoại</span>
                                        <span className={styles.infoValue}>{viewModal.data.phone}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Email</span>
                                        <span className={styles.infoValue}>{viewModal.data.email}</span>
                                    </div>
                                    <div className={styles.infoItemFull}>
                                        <span className={styles.infoLabel}>Ngày tạo hồ sơ</span>
                                        <span className={styles.infoValue}>{viewModal.data.createdAt}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.btnPrimary} onClick={() => setViewModal({ isOpen: false, data: null })}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= MODAL XÓA ================= */}
            {deleteModal.isOpen && deleteModal.data && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent} style={{ width: '400px' }}>
                        <div className={styles.modalHeader}>
                            <h3>Xác nhận xóa</h3>
                            <button className={styles.closeBtn} onClick={() => setDeleteModal({ isOpen: false, data: null })}>
                                <FiX />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <p style={{ margin: 0, fontSize: '15px', color: '#475569', lineHeight: '1.5' }}>
                                Bạn có chắc chắn muốn xóa hồ sơ của khách hàng <strong>{deleteModal.data.name}</strong> không? Hành động này không thể hoàn tác.
                            </p>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.btnCancel} onClick={() => setDeleteModal({ isOpen: false, data: null })}>
                                Hủy bỏ
                            </button>
                            <button className={styles.btnDelete} onClick={() => {
                                // Thực hiện logic xóa API ở đây
                                alert(`Đã xóa khách hàng: ${deleteModal.data.name}`);
                                setDeleteModal({ isOpen: false, data: null });
                            }}>
                                Xác nhận xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CustomerManagement;