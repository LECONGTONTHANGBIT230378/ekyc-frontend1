import React, { useState, useEffect } from 'react';
import { FiEye, FiEdit, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { customerService } from '../../services/customerService';
import CustomerToolbar from './CustomerToolbar';
import CustomerViewModal from './CustomerViewModal';
import CustomerEditModal from './CustomerEditModal';
import CustomerDeleteModal from './CustomerDeleteModal';
import styles from './CustomerManagement.module.css';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState('');

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                size: 10,
                keyword: searchKeyword
            };

            const response = await customerService.getAllCustomers(params);

            if (response && (response.success === true || response.code === 200)) {
                setCustomers(response.data || []);
                setTotalPages(1);
            } else if (Array.isArray(response)) {
                setCustomers(response);
                setTotalPages(1);
            } else {
                setCustomers([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách khách hàng:', error);
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [currentPage, searchKeyword]);

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
                    <h2 className={styles.title}>Quản lý khách hàng</h2>
                    <p className={styles.subtitle}>Xem và quản lý thông tin liên hệ, hồ sơ của khách hàng.</p>
                </div>

                <CustomerToolbar
                    onSearch={(keyword) => { setSearchKeyword(keyword); setCurrentPage(0); }}
                />

                <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ và tên</th>
                            <th>Số CCCD</th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                            <th className={styles.actionHeader}>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className={styles.emptyState}>Đang tải dữ liệu...</td>
                            </tr>
                        ) : customers.length === 0 ? (
                            <tr>
                                <td colSpan="6" className={styles.emptyState}>Không tìm thấy khách hàng nào.</td>
                            </tr>
                        ) : (
                            customers.map((customer) => (
                                <tr key={customer.id}>
                                    <td style={{ fontWeight: 600 }}>#{customer.id}</td>
                                    <td style={{ fontWeight: 500 }}>{customer.fullName || 'Chưa cập nhật'}</td>
                                    <td>{customer.cccdNumber || 'N/A'}</td>
                                    <td>{customer.phone || 'Chưa cập nhật'}</td>
                                    <td>{customer.email || 'Chưa cập nhật'}</td>
                                    <td>
                                        <div className={styles.actionGroup}>
                                            <button
                                                className={styles.iconBtn}
                                                title="Xem chi tiết"
                                                onClick={() => { setSelectedCustomer(customer); setViewModalOpen(true); }}
                                            >
                                                <FiEye />
                                            </button>

                                            <button
                                                className={styles.iconBtn}
                                                title="Chỉnh sửa hồ sơ"
                                                onClick={() => { setSelectedCustomer(customer); setEditModalOpen(true); }}
                                            >
                                                <FiEdit />
                                            </button>

                                            <button
                                                className={styles.iconBtnTrash}
                                                title="Xóa hồ sơ"
                                                onClick={() => { setSelectedCustomer(customer); setDeleteModalOpen(true); }}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {renderPagination()}
            </div>

            {viewModalOpen && (
                <CustomerViewModal
                    customer={selectedCustomer}
                    onClose={() => setViewModalOpen(false)}
                />
            )}

            {editModalOpen && (
                <CustomerEditModal
                    customer={selectedCustomer}
                    onClose={() => setEditModalOpen(false)}
                    onSuccess={() => {
                        setEditModalOpen(false);
                        fetchCustomers();
                    }}
                />
            )}

            {deleteModalOpen && (
                <CustomerDeleteModal
                    customerId={selectedCustomer?.id}
                    customerName={selectedCustomer?.fullName}
                    onConfirm={async () => {
                        try {
                            await customerService.deleteCustomer(selectedCustomer.id);
                            setDeleteModalOpen(false);
                            fetchCustomers();
                        } catch (err) {
                            console.error("Lỗi khi xóa khách hàng", err);
                            alert("Không thể xóa khách hàng. Vui lòng thử lại.");
                        }
                    }}
                    onClose={() => setDeleteModalOpen(false)}
                />
            )}
        </div>
    );
};

export default CustomerManagement;