import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiEdit, FiTrash2, FiPlus, FiChevronLeft, FiChevronRight, FiX, FiCheckCircle } from 'react-icons/fi';
import { userService } from '../../services/userService';
import AccountModal from './AccountModal';
import styles from './AccountManagement.module.css';

const removeVietnameseTones = (str) => {
    if (!str) return "";
    return str.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
};

const AccountManagement = () => {
    const [accounts, setAccounts] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    const [modal, setModal] = useState({ isOpen: false, type: 'add', data: null });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, account: null });

    const fetchAccounts = async () => {
        try {
            const res = await userService.getAllUsers();
            if (res && (res.code === 200 || res.success === true)) {
                const userList = res.data?.content || res.data || [];

                const mappedData = userList.map(user => ({
                    id: user.id,
                    name: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    role: user.role === 'ADMIN' ? 'Admin' : 'Nhân viên',
                    status: 'active'
                }));
                setAccounts(mappedData);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách tài khoản:", error);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const filteredAccounts = accounts.filter(acc => {
        const keyword = removeVietnameseTones(searchTerm);
        const name = removeVietnameseTones(acc.name);
        const email = removeVietnameseTones(acc.email);
        const idStr = removeVietnameseTones(acc.id?.toString());

        const matchesSearch = name.includes(keyword) || email.includes(keyword) || idStr.includes(keyword);
        const matchesRole = filterRole === 'all' || acc.role === filterRole;

        return matchesSearch && matchesRole;
    });

    const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage) || 1;
    const currentAccounts = filteredAccounts.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const openAddModal = () => { setModal({ isOpen: true, type: 'add', data: null }); setErrorMessage(''); };
    const openEditModal = (account) => { setModal({ isOpen: true, type: 'edit', data: account }); setErrorMessage(''); };
    const closeModal = () => { setModal({ isOpen: false, type: 'add', data: null }); setErrorMessage(''); };

    const handleSaveAccount = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        // Lấy dữ liệu an toàn bằng FormData
        const formData = new FormData(e.target);
        const fullName = formData.get('fullName');
        const email = formData.get('email') || (modal.type === 'edit' ? modal.data.email : '');
        const phone = formData.get('phone') || (modal.type === 'edit' ? modal.data.phone : '');
        const password = formData.get('password');
        const roleUI = formData.get('role');

        const payload = {
            username: email,
            fullName: fullName,
            email: email,
            phone: phone,
            password: password,
            role: roleUI === 'Admin' ? 'ADMIN' : 'STAFF'
        };

        try {
            if (modal.type === 'add') {
                const res = await userService.createAccount(payload);
                if (res.code === 200 || res.success) {
                    setSuccessMessage("Đã thêm tài khoản nhân sự mới vào hệ thống thành công!");
                    fetchAccounts();
                    closeModal();
                } else {
                    setErrorMessage(res.message || "Tạo tài khoản thất bại.");
                }
            } else {
                const res = await userService.updateUser(modal.data.id, payload);
                if (res.code === 200 || res.success) {
                    setSuccessMessage("Đã cập nhật thông tin tài khoản thành công!");
                    fetchAccounts();
                    closeModal();
                } else {
                    setErrorMessage(res.message || "Cập nhật tài khoản thất bại.");
                }
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Lỗi kết nối Backend. Vui lòng kiểm tra lại!");
        }
    };

    const handleDeleteClick = (account) => {
        setDeleteModal({ isOpen: true, account });
    };

    const confirmDelete = async () => {
        try {
            await userService.deleteUser(deleteModal.account.id);
            setSuccessMessage(`Đã xóa tài khoản ${deleteModal.account.name} thành công!`);
            fetchAccounts();
        } catch (error) {
            console.error("Lỗi xóa tài khoản", error);
            alert(error.response?.data?.message || "Không thể xóa tài khoản. Vui lòng thử lại!");
        } finally {
            setDeleteModal({ isOpen: false, account: null });
        }
    };

    const closeDeleteModal = () => setDeleteModal({ isOpen: false, account: null });
    const closeSuccessModal = () => setSuccessMessage('');

    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const DOTS = '...';

        const getPageRange = () => {
            const totalPageNumbersToShow = 5;

            if (totalPages <= totalPageNumbersToShow) {
                return Array.from({ length: totalPages }, (_, i) => i);
            }

            const leftSiblingIndex = Math.max(currentPage - 1, 0);
            const rightSiblingIndex = Math.min(currentPage + 1, totalPages - 1);

            const shouldShowLeftDots = leftSiblingIndex > 1;
            const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

            const firstPageIndex = 0;
            const lastPageIndex = totalPages - 1;

            if (!shouldShowLeftDots && shouldShowRightDots) {
                let leftItemCount = Math.max(2, currentPage + 2);
                let leftRange = Array.from({ length: leftItemCount }, (_, i) => i);
                return [...leftRange, DOTS, lastPageIndex];
            }

            if (shouldShowLeftDots && !shouldShowRightDots) {
                let rightItemCount = Math.max(3, totalPages - currentPage + 1);
                let rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i);
                return [firstPageIndex, DOTS, ...rightRange];
            }

            if (shouldShowLeftDots && shouldShowRightDots) {
                let middleRange = [leftSiblingIndex, currentPage, rightSiblingIndex];
                return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
            }
        };

        const paginationRange = getPageRange();

        return (
            <div className={styles.pagination}>
                <button
                    className={`${styles.pageBtn} ${currentPage === 0 ? styles.disabledBtn : ''}`}
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                >
                    <FiChevronLeft size={18} />
                </button>

                {paginationRange.map((pageNumber, index) => {
                    if (pageNumber === DOTS) {
                        return <span key={`dots-${index}`} className={styles.dots} style={{ color: '#94A3B8', padding: '0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', userSelect: 'none', letterSpacing: '2px', fontWeight: '700' }}>...</span>;
                    }
                    return (
                        <button
                            key={pageNumber}
                            className={`${styles.pageBtn} ${currentPage === pageNumber ? styles.activePage : ''}`}
                            onClick={() => setCurrentPage(pageNumber)}
                        >
                            {pageNumber + 1}
                        </button>
                    );
                })}

                <button
                    className={`${styles.pageBtn} ${currentPage === totalPages - 1 || totalPages === 0 ? styles.disabledBtn : ''}`}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage === totalPages - 1 || totalPages === 0}
                >
                    <FiChevronRight size={18} />
                </button>
            </div>
        );
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.mainCard}>
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>Quản lý tài khoản nội bộ</h2>
                        <p className={styles.subtitle}>Danh sách nhân viên, cấp phát tài khoản và phân quyền hệ thống.</p>
                    </div>
                    <button className={styles.btnAdd} onClick={openAddModal}>
                        <FiPlus size={18} />
                        Thêm tài khoản
                    </button>
                </div>

                <div className={styles.toolbar}>
                    <div className={styles.searchBox}>
                        <FiSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Tìm theo ID, tên hoặc email..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.filterWrapper}>
                        <button className={styles.filterBtn} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                            <FiFilter style={{ marginRight: '8px' }} />
                            {filterRole === 'all' ? 'Tất cả vai trò' : filterRole}
                        </button>

                        {isFilterOpen && (
                            <div className={styles.filterDropdown}>
                                <div className={`${styles.filterOption} ${filterRole === 'all' ? styles.activeFilter : ''}`} onClick={() => { setFilterRole('all'); setIsFilterOpen(false); }}>Tất cả vai trò</div>
                                <div className={`${styles.filterOption} ${filterRole === 'Admin' ? styles.activeFilter : ''}`} onClick={() => { setFilterRole('Admin'); setIsFilterOpen(false); }}>Admin</div>
                                <div className={`${styles.filterOption} ${filterRole === 'Nhân viên' ? styles.activeFilter : ''}`} onClick={() => { setFilterRole('Nhân viên'); setIsFilterOpen(false); }}>Nhân viên</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ và tên</th>
                            <th>Email đăng nhập</th>
                            <th>Phân quyền (Role)</th>
                            <th>Trạng thái</th>
                            <th className={styles.actionHeader}>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentAccounts.length > 0 ? (
                            currentAccounts.map((acc, index) => (
                                <tr key={index}>
                                    <td style={{ fontWeight: 600 }}>#{acc.id}</td>
                                    <td>{acc.name}</td>
                                    <td style={{ color: '#666' }}>{acc.email}</td>
                                    <td>
                                        <span className={`${styles.roleBadge} ${acc.role === 'Admin' ? styles.roleAdmin : styles.roleStaff}`}>
                                            {acc.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles.statusActive}`}>Hoạt động</span>
                                    </td>
                                    <td>
                                        <div className={styles.actionGroup}>
                                            <button className={styles.iconBtn} title="Chỉnh sửa & Phân quyền" onClick={() => openEditModal(acc)}>
                                                <FiEdit />
                                            </button>
                                            <button className={styles.iconBtnTrash} title="Xóa tài khoản" onClick={() => handleDeleteClick(acc)}>
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className={styles.emptyState}>Không tìm thấy nhân viên nào.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {renderPagination()}
            </div>

            <AccountModal
                isOpen={modal.isOpen}
                type={modal.type}
                data={modal.data}
                onClose={closeModal}
                onSave={handleSaveAccount}
                errorMessage={errorMessage}
                accounts={accounts}
            />

            {/* ĐÃ SỬA: Đổi inlineStyles thành CSS class module */}
            {deleteModal.isOpen && (
                <div className={styles.deleteOverlay} onClick={closeDeleteModal}>
                    <div className={styles.deleteModalContent} onClick={(e) => e.stopPropagation()}>
                        <button onClick={closeDeleteModal} className={styles.closeIconBtn}>
                            <FiX size={24} />
                        </button>

                        <div className={styles.iconWrapper}>
                            <FiTrash2 size={32} color="#dc2626" />
                        </div>

                        <h3 className={styles.deleteTitle}>Xác nhận xóa</h3>
                        <p className={styles.deleteMessage}>
                            Bạn có chắc chắn muốn xóa tài khoản <strong>{deleteModal.account?.name}</strong> không? Hành động này không thể hoàn tác.
                        </p>

                        <div className={styles.buttonGroup}>
                            <button onClick={closeDeleteModal} className={styles.cancelBtn}>
                                Hủy bỏ
                            </button>
                            <button onClick={confirmDelete} className={styles.deleteBtn}>
                                Xóa tài khoản
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {successMessage && (
                <div className={styles.successModalOverlay} onClick={closeSuccessModal}>
                    <div className={styles.successModalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.successModalIconBox}>
                            <FiCheckCircle size={32} />
                        </div>
                        <h3 className={styles.successModalTitle}>Thành công</h3>
                        <p className={styles.successModalText}>{successMessage}</p>
                        <button className={styles.btnPrimaryFull} onClick={closeSuccessModal}>
                            Đã hiểu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountManagement;