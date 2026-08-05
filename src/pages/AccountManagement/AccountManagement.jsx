import React, { useState } from 'react';
import { FiSearch, FiFilter, FiEdit, FiTrash2, FiPlus, FiChevronLeft, FiChevronRight, FiX, FiCheckCircle } from 'react-icons/fi';
import styles from './AccountManagement.module.css';

const getAccountData = () => [
    { id: 'NV-001', name: 'Nguyễn Văn Quản Trị', email: 'admin.nguyen@cmcu.edu.vn', role: 'Admin', status: 'active' },
    { id: 'NV-002', name: 'Trần Minh Nhân', email: 'nhan.tran@cmcu.edu.vn', role: 'Nhân viên', status: 'active' },
    { id: 'NV-003', name: 'Lê Thu Hương', email: 'huong.le@cmcu.edu.vn', role: 'Nhân viên', status: 'inactive' },
    { id: 'NV-004', name: 'Phạm Tuấn Anh', email: 'anh.pham@cmcu.edu.vn', role: 'Admin', status: 'active' },
    { id: 'NV-005', name: 'Hoàng Mai Phương', email: 'phuong.hoang@cmcu.edu.vn', role: 'Nhân viên', status: 'active' },
    { id: 'NV-006', name: 'Vũ Đức Đạt', email: 'dat.vu@cmcu.edu.vn', role: 'Nhân viên', status: 'active' },
];

const removeVietnameseTones = (str) => {
    if (!str) return "";
    return str.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
};

const AccountManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [accounts, setAccounts] = useState(getAccountData());

    // CÁC STATE QUẢN LÝ MODAL
    const [modal, setModal] = useState({ isOpen: false, type: 'add', data: null });
    const [successMessage, setSuccessMessage] = useState('');

    // STATE QUẢN LÝ MODAL XÓA
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, account: null });

    const filteredAccounts = accounts.filter(acc => {
        const keyword = removeVietnameseTones(searchTerm);
        const name = removeVietnameseTones(acc.name);
        const email = removeVietnameseTones(acc.email);
        const id = removeVietnameseTones(acc.id);

        const matchesSearch = name.includes(keyword) || email.includes(keyword) || id.includes(keyword);
        const matchesRole = filterRole === 'all' || acc.role === filterRole;

        return matchesSearch && matchesRole;
    });

    const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
    const currentAccounts = filteredAccounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // XỬ LÝ MODAL THÊM / SỬA
    const openAddModal = () => setModal({ isOpen: true, type: 'add', data: null });
    const openEditModal = (account) => setModal({ isOpen: true, type: 'edit', data: account });
    const closeModal = () => setModal({ isOpen: false, type: 'add', data: null });

    const handleSaveAccount = (e) => {
        e.preventDefault();
        const message = modal.type === 'add'
            ? "Đã thêm tài khoản nhân sự mới vào hệ thống thành công!"
            : "Đã cập nhật phân quyền và trạng thái thành công!";
        setSuccessMessage(message);
        closeModal();
    };

    // XỬ LÝ CHỨC NĂNG XÓA
    const handleDeleteClick = (account) => {
        setDeleteModal({ isOpen: true, account });
    };

    const confirmDelete = () => {
        // Lọc bỏ tài khoản đang chọn xóa ra khỏi mảng
        setAccounts(accounts.filter(acc => acc.id !== deleteModal.account.id));
        setSuccessMessage(`Đã xóa tài khoản ${deleteModal.account.name} thành công!`);
        setDeleteModal({ isOpen: false, account: null });
    };

    const closeDeleteModal = () => setDeleteModal({ isOpen: false, account: null });
    const closeSuccessModal = () => setSuccessMessage('');

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
                            placeholder="Tìm theo mã NV, tên hoặc email..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
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
                            <th>Mã NV</th>
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
                                    <td style={{ fontWeight: 600 }}>{acc.id}</td>
                                    <td>{acc.name}</td>
                                    <td style={{ color: '#666' }}>{acc.email}</td>
                                    <td>
                                            <span className={`${styles.roleBadge} ${acc.role === 'Admin' ? styles.roleAdmin : styles.roleStaff}`}>
                                                {acc.role}
                                            </span>
                                    </td>
                                    <td>
                                        {acc.status === 'active' ? (
                                            <span className={`${styles.statusBadge} ${styles.statusActive}`}>Hoạt động</span>
                                        ) : (
                                            <span className={`${styles.statusBadge} ${styles.statusInactive}`}>Đã khóa</span>
                                        )}
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

                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button className={`${styles.pageBtn} ${currentPage === 1 ? styles.disabledBtn : ''}`} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                            <FiChevronLeft size={18} />
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button key={index + 1} className={`${styles.pageBtn} ${currentPage === index + 1 ? styles.activePage : ''}`} onClick={() => setCurrentPage(index + 1)}>
                                {index + 1}
                            </button>
                        ))}
                        <button className={`${styles.pageBtn} ${currentPage === totalPages ? styles.disabledBtn : ''}`} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                            <FiChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* MODAL FORM THÊM / SỬA TÀI KHOẢN */}
            {modal.isOpen && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>{modal.type === 'add' ? 'Thêm tài khoản nhân sự' : 'Cập nhật phân quyền'}</h3>
                            <button className={styles.closeBtn} onClick={closeModal}><FiX /></button>
                        </div>
                        <form onSubmit={handleSaveAccount}>
                            <div className={styles.modalBody}>
                                <div className={styles.formGroup}>
                                    <label>Họ và tên nhân viên</label>
                                    <input type="text" className={styles.inputField} placeholder="Nhập họ và tên" defaultValue={modal.data?.name} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Email đăng nhập</label>
                                    <input type="email" className={styles.inputField} placeholder="ví dụ: nv.a@cmcu.edu.vn" defaultValue={modal.data?.email} required disabled={modal.type === 'edit'} />
                                </div>
                                {modal.type === 'add' && (
                                    <div className={styles.formGroup}>
                                        <label>Mật khẩu khởi tạo</label>
                                        <input type="password" className={styles.inputField} placeholder="Nhập mật khẩu mặc định" required />
                                    </div>
                                )}
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Phân quyền (Role)</label>
                                        <select className={styles.selectField} defaultValue={modal.data?.role || 'Nhân viên'}>
                                            <option value="Nhân viên">Nhân viên</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </div>
                                    {modal.type === 'edit' && (
                                        <div className={styles.formGroup}>
                                            <label>Trạng thái</label>
                                            <select className={styles.selectField} defaultValue={modal.data?.status || 'active'}>
                                                <option value="active">Hoạt động</option>
                                                <option value="inactive">Khóa tài khoản</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.btnCancel} onClick={closeModal}>Hủy bỏ</button>
                                <button type="submit" className={styles.btnPrimary}>
                                    {modal.type === 'add' ? 'Tạo tài khoản' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL CẢNH BÁO XÓA TÀI KHOẢN (ĐÃ TĂNG KÍCH THƯỚC) */}
            {deleteModal.isOpen && (
                <div style={inlineStyles.overlay} onClick={closeDeleteModal}>
                    <div style={inlineStyles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button onClick={closeDeleteModal} style={inlineStyles.closeIconBtn}>
                            <FiX size={24} />
                        </button>

                        <div style={inlineStyles.iconWrapper}>
                            <FiTrash2 size={32} color="#dc2626" />
                        </div>

                        <h3 style={inlineStyles.title}>Xác nhận xóa</h3>
                        <p style={inlineStyles.message}>
                            Bạn có chắc chắn muốn xóa tài khoản <strong>{deleteModal.account?.name}</strong> không? Hành động này không thể hoàn tác.
                        </p>

                        <div style={inlineStyles.buttonGroup}>
                            <button onClick={closeDeleteModal} style={inlineStyles.cancelBtn}>
                                Hủy bỏ
                            </button>
                            <button onClick={confirmDelete} style={inlineStyles.deleteBtn}>
                                Xóa tài khoản
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL THÔNG BÁO LƯU THÀNH CÔNG */}
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

// === INLINE STYLES CHO MODAL XÓA (ĐÃ TĂNG KÍCH THƯỚC) ===
const inlineStyles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '40px 32px',
        width: '90%',
        maxWidth: '520px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        position: 'relative'
    },
    closeIconBtn: {
        position: 'absolute', top: '20px', right: '20px',
        background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    iconWrapper: {
        width: '68px', height: '68px',
        borderRadius: '50%',
        backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '24px'
    },
    title: {
        margin: '0 0 12px 0',
        fontSize: '22px',
        color: '#111827',
        fontWeight: 600
    },
    message: {
        margin: '0 0 32px 0',
        fontSize: '15px',
        color: '#4b5563',
        lineHeight: '1.6'
    },
    buttonGroup: {
        display: 'flex',
        gap: '16px',
        width: '100%'
    },
    cancelBtn: {
        flex: 1,
        padding: '12px 0',
        backgroundColor: '#ffffff', color: '#374151',
        border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '15px'
    },
    deleteBtn: {
        flex: 1,
        padding: '12px 0',
        backgroundColor: '#dc2626', color: '#ffffff',
        border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '15px'
    }
};

export default AccountManagement;