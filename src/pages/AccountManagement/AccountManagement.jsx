import React, { useState } from 'react';
import { FiSearch, FiFilter, FiEdit, FiTrash2, FiPlus, FiChevronLeft, FiChevronRight, FiX, FiCheckCircle } from 'react-icons/fi';
import { userService } from '../../services/userService';
import AccountModal from './AccountModal';
import styles from './AccountManagement.module.css';

const removeVietnameseTones = (str) => {
    if (!str) return "";
    return str.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
};

const AccountManagement = () => {
    // KHỞI TẠO MẢNG RỖNG - KHÔNG SỬ DỤNG DỮ LIỆU MẪU (ĐÃ FIX LỖI getAccountData)
    const [accounts, setAccounts] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // CÁC STATE QUẢN LÝ MODAL
    const [modal, setModal] = useState({ isOpen: false, type: 'add', data: null });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
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

    // XỬ LÝ MỞ / ĐÓNG MODAL
    const openAddModal = () => { setModal({ isOpen: true, type: 'add', data: null }); setErrorMessage(''); };
    const openEditModal = (account) => { setModal({ isOpen: true, type: 'edit', data: account }); setErrorMessage(''); };
    const closeModal = () => { setModal({ isOpen: false, type: 'add', data: null }); setErrorMessage(''); };

    // ==========================================
    // XỬ LÝ LƯU (THÊM BẰNG API / SỬA ẢO)
    // ==========================================
    const handleSaveAccount = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        const formData = new FormData(e.target);
        const fullName = formData.get('fullName');
        const email = formData.get('email');
        const password = formData.get('password');
        const roleUI = formData.get('role');
        const statusUI = formData.get('status') || 'active';

        if (modal.type === 'add') {
            const payload = {
                username: email.split('@')[0],
                fullName: fullName,
                email: email,
                password: password,
                role: roleUI === 'Admin' ? 'ADMIN' : 'STAFF'
            };

            try {
                // Gọi API tạo tài khoản Backend
                const res = await userService.createAccount(payload);
                if (res.success) {
                    const newAccount = {
                        id: `NV-00${accounts.length + 1}`,
                        name: fullName,
                        email: email,
                        role: roleUI,
                        status: 'active'
                    };
                    setAccounts([newAccount, ...accounts]);
                    setSuccessMessage("Đã thêm tài khoản nhân sự mới vào hệ thống thành công!");
                    closeModal();
                }
            } catch (error) {
                setErrorMessage(error.response?.data?.message || "Lỗi kết nối Backend. Vui lòng kiểm tra lại!");
            }
        } else {
            const updatedAccounts = accounts.map(acc => {
                if (acc.id === modal.data.id) {
                    return { ...acc, name: fullName, role: roleUI, status: statusUI };
                }
                return acc;
            });
            setAccounts(updatedAccounts);
            setSuccessMessage("Đã cập nhật phân quyền và trạng thái thành công!");
            closeModal();
        }
    };

    // ==========================================
    // XỬ LÝ XÓA TÀI KHOẢN TRÊN GIAO DIỆN
    // ==========================================
    const handleDeleteClick = (account) => {
        setDeleteModal({ isOpen: true, account });
    };

    const confirmDelete = () => {
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
                                <td colSpan="6" className={styles.emptyState}>Không tìm thấy nhân viên nào. Hãy thêm tài khoản mới.</td>
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

            {/* SỬ DỤNG COMPONENT MODAL THÊM / SỬA */}
            <AccountModal
                isOpen={modal.isOpen}
                type={modal.type}
                data={modal.data}
                onClose={closeModal}
                onSave={handleSaveAccount}
                errorMessage={errorMessage}
            />

            {/* MODAL CẢNH BÁO XÓA TÀI KHOẢN */}
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

const inlineStyles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
    modalContent: { backgroundColor: '#ffffff', borderRadius: '16px', padding: '40px 32px', width: '90%', maxWidth: '520px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' },
    closeIconBtn: { position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    iconWrapper: { width: '68px', height: '68px', borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' },
    title: { margin: '0 0 12px 0', fontSize: '22px', color: '#111827', fontWeight: 600 },
    message: { margin: '0 0 32px 0', fontSize: '15px', color: '#4b5563', lineHeight: '1.6' },
    buttonGroup: { display: 'flex', gap: '16px', width: '100%' },
    cancelBtn: { flex: 1, padding: '12px 0', backgroundColor: '#ffffff', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '15px' },
    deleteBtn: { flex: 1, padding: '12px 0', backgroundColor: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '15px' }
};

export default AccountManagement;