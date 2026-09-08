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
                keyword: searchKeyword
            };

            const response = await customerService.getAllCustomers(params);

            let dataList = [];
            if (response && (response.success === true || response.code === 200)) {
                dataList = response.data || [];
            } else if (Array.isArray(response)) {
                dataList = response;
            }

            setCustomers(dataList);
            setTotalPages(Math.ceil(dataList.length / 10) || 1);

        } catch (error) {
            console.error('Lỗi khi tải danh sách khách hàng:', error);
            setCustomers([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
        setCurrentPage(0);
    }, [searchKeyword]);

    const indexOfLastItem = (currentPage + 1) * 10;
    const indexOfFirstItem = currentPage * 10;
    const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem);

    // ====================================================================
    // THUẬT TOÁN PHÂN TRANG MỚI: TỰ ĐỘNG CANH DẤU "..." ĐÚNG YÊU CẦU
    // ====================================================================
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
                    <FiChevronLeft />
                </button>

                {paginationRange.map((pageNumber, index) => {
                    if (pageNumber === DOTS) {
                        return <span key={`dots-${index}`} className={styles.dots}>...</span>;
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
                    className={`${styles.pageBtn} ${currentPage === totalPages - 1 ? styles.disabledBtn : ''}`}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage === totalPages - 1}
                >
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
                    onSearch={(keyword) => setSearchKeyword(keyword)}
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
                        ) : currentCustomers.length === 0 ? (
                            <tr>
                                <td colSpan="6" className={styles.emptyState}>Không tìm thấy khách hàng nào.</td>
                            </tr>
                        ) : (
                            currentCustomers.map((customer) => (
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