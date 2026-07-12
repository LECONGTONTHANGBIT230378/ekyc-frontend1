import React, { useState } from 'react';
import { FiEye, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './CustomerManagement.module.css';

// Import các Components đã tách
import CustomerViewModal from './CustomerViewModal';
import CustomerDeleteModal from './CustomerDeleteModal';
import CustomerToolbar from './CustomerToolbar'; // Bổ sung import Toolbar mới

const getRealisticData = () => [
    { id: '001', name: 'Nguyễn Văn A', cccd: '079123456842', role: 'Khách hàng', status: 'verified', phone: '0901112222', dob: '12/05/1995', address: 'Hà Nội' },
    { id: '002', name: 'Trần Minh', cccd: '036987654112', role: 'Đại lý', status: 'pending', phone: '0983334444', dob: '24/08/1998', address: 'Hồ Chí Minh' },
    { id: '003', name: 'Lê Thu', cccd: '045456789903', role: 'Khách hàng', status: 'failed', phone: '0865556666', dob: '03/11/2001', address: 'Đà Nẵng' },
    { id: '004', name: 'Phạm Văn Dũng', cccd: '012321654333', role: 'Khách hàng', status: 'verified', phone: '0912223333', dob: '10/10/1990', address: 'Hải Phòng' },
    { id: '005', name: 'Hoàng Thị Yến', cccd: '034789123555', role: 'Quản trị viên', status: 'verified', phone: '0988777666', dob: '15/02/1985', address: 'Cần Thơ' },
    { id: '006', name: 'Vũ Văn Đạt', cccd: '056159753777', role: 'Khách hàng', status: 'pending', phone: '0866555444', dob: '05/06/1992', address: 'Nha Trang' },
    { id: '007', name: 'Đặng Tuấn', cccd: '078357159999', role: 'Khách hàng', status: 'failed', phone: '0909998888', dob: '20/12/2000', address: 'Vũng Tàu' },
    { id: '008', name: 'Ngô Hải', cccd: '089456123111', role: 'Đại lý', status: 'verified', phone: '0933332222', dob: '14/07/1996', address: 'Huế' },
    { id: '009', name: 'Lý Kiệt', cccd: '090123987222', role: 'Khách hàng', status: 'pending', phone: '0944445555', dob: '22/09/1999', address: 'Bắc Ninh' },
    { id: '010', name: 'Bùi Lan', cccd: '091789456333', role: 'Khách hàng', status: 'verified', phone: '0955556666', dob: '11/11/1994', address: 'Đồng Nai' },
    { id: '011', name: 'Đỗ Mai', cccd: '092147258444', role: 'Cộng tác viên', status: 'failed', phone: '0966667777', dob: '30/01/2002', address: 'Bình Dương' },
    { id: '012', name: 'Hồ Ngọc', cccd: '093258369555', role: 'Khách hàng', status: 'verified', phone: '0977778888', dob: '08/03/1997', address: 'Cà Mau' },
    { id: '013', name: 'Trương Oanh', cccd: '079111222888', role: 'Khách hàng', status: 'pending', phone: '0981112233', dob: '01/01/1993', address: 'Thanh Hóa' },
    { id: '014', name: 'Đinh Phương', cccd: '001222333777', role: 'Khách hàng', status: 'verified', phone: '0972223344', dob: '15/04/1988', address: 'Hà Nội' },
    { id: '015', name: 'Tô Quân', cccd: '034444555666', role: 'Đại lý', status: 'failed', phone: '0963334455', dob: '20/07/1995', address: 'Nghệ An' },
    { id: '016', name: 'Lương Rạng', cccd: '038555666555', role: 'Khách hàng', status: 'verified', phone: '0954445566', dob: '12/12/1991', address: 'Hà Tĩnh' },
    { id: '017', name: 'Tạ Sáng', cccd: '025666777444', role: 'Khách hàng', status: 'verified', phone: '0945556677', dob: '05/05/1989', address: 'Đà Nẵng' },
    { id: '018', name: 'Chu Thành', cccd: '046777888333', role: 'Cộng tác viên', status: 'pending', phone: '0936667788', dob: '19/08/2000', address: 'Hải Dương' },
    { id: '019', name: 'Đoàn Uyên', cccd: '052888999222', role: 'Khách hàng', status: 'verified', phone: '0927778899', dob: '23/10/1996', address: 'Hồ Chí Minh' },
    { id: '020', name: 'Trần Vinh', cccd: '066999000111', role: 'Khách hàng', status: 'failed', phone: '0918889900', dob: '30/03/1994', address: 'Quảng Ninh' },
    { id: '021', name: 'Nguyễn Xuân', cccd: '077000111000', role: 'Đại lý', status: 'verified', phone: '0909990011', dob: '14/02/1987', address: 'Cần Thơ' },
    { id: '022', name: 'Lê Yến', cccd: '088111222123', role: 'Khách hàng', status: 'pending', phone: '0891112222', dob: '09/09/1992', address: 'Bình Định' },
    { id: '023', name: 'Phạm Duy', cccd: '099222333456', role: 'Khách hàng', status: 'verified', phone: '0882223333', dob: '27/11/1998', address: 'Lâm Đồng' },
    { id: '024', name: 'Hoàng Anh', cccd: '011333444789', role: 'Khách hàng', status: 'verified', phone: '0873334444', dob: '16/06/1997', address: 'Gia Lai' },
    { id: '025', name: 'Ngô Bình', cccd: '022444555321', role: 'Cộng tác viên', status: 'failed', phone: '0864445555', dob: '08/08/1986', address: 'Đồng Tháp' },
    { id: '026', name: 'Vũ Cường', cccd: '033555666654', role: 'Khách hàng', status: 'pending', phone: '0855556666', dob: '21/05/1999', address: 'Tây Ninh' },
    { id: '027', name: 'Lý Dũng', cccd: '044666777987', role: 'Khách hàng', status: 'verified', phone: '0846667777', dob: '11/11/1993', address: 'Vĩnh Long' },
    { id: '028', name: 'Bùi Ân', cccd: '055777888147', role: 'Đại lý', status: 'verified', phone: '0837778888', dob: '02/02/1990', address: 'Long An' },
    { id: '029', name: 'Đỗ Phong', cccd: '066888999258', role: 'Khách hàng', status: 'pending', phone: '0828889999', dob: '18/04/1995', address: 'Tiền Giang' },
    { id: '030', name: 'Hồ Giang', cccd: '077999000369', role: 'Khách hàng', status: 'failed', phone: '0819990000', dob: '25/12/1988', address: 'An Giang' },
    { id: '031', name: 'Trương Huy', cccd: '088000111741', role: 'Nhân viên', status: 'verified', phone: '0801112233', dob: '07/07/2001', address: 'Kiên Giang' },
    { id: '032', name: 'Đinh Ích', cccd: '099111222852', role: 'Khách hàng', status: 'verified', phone: '0792223344', dob: '13/03/1991', address: 'Cà Mau' },
];

const removeVietnameseTones = (str) => {
    if (!str) return "";
    return str
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase();
};

const CustomerManagement = () => {
    // Các State vẫn phải giữ ở file cha để có thể lọc mảng Customers
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [customers, setCustomers] = useState(getRealisticData());

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Xử lý Modal
    const handleView = (customer) => {
        setSelectedCustomer(customer);
        setIsViewModalOpen(true);
    };

    const handleDeleteClick = (customer) => {
        setSelectedCustomer(customer);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        setCustomers(customers.filter(c => c.id !== selectedCustomer.id));
        closeModal();
    };

    const closeModal = () => {
        setIsViewModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedCustomer(null);
    };

    // Logic Lọc & Tìm kiếm
    const filteredCustomers = customers.filter(cus => {
        const keyword = removeVietnameseTones(searchTerm).trim();

        const name = removeVietnameseTones(cus.name);
        const id = removeVietnameseTones(cus.id);
        const phone = removeVietnameseTones(cus.phone);
        const cccd = removeVietnameseTones(cus.cccd);
        const role = removeVietnameseTones(cus.role);

        const matchesSearch =
            name.includes(keyword) ||
            id.includes(keyword) ||
            phone.includes(keyword) ||
            cccd.includes(keyword) ||
            role.includes(keyword);

        const matchesStatus = filterStatus === 'all' || cus.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

    // Các hàm này sẽ truyền dưới dạng Props xuống cho CustomerToolbar
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleSelectFilter = (status) => {
        setFilterStatus(status);
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
                    <h2 className={styles.title}>Quản lý khách hàng</h2>
                    <p className={styles.subtitle}>Tìm kiếm, lọc, xem chi tiết, chỉnh sửa, xóa, thêm tài khoản và phân quyền.</p>
                </div>

                {/* GỌI COMPONENT TOOLBAR VÀ TRUYỀN PROPS XUỐNG */}
                <CustomerToolbar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    filterStatus={filterStatus}
                    onFilterChange={handleSelectFilter}
                />

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
                        {currentCustomers.length > 0 ? (
                            currentCustomers.map((cus) => (
                                <tr key={cus.id}>
                                    <td>{cus.id}</td>
                                    <td>{cus.name}</td>
                                    <td>{cus.cccd}</td>
                                    <td>{cus.role}</td>
                                    <td>
                                        {cus.status === 'verified' && <span className={`${styles.badge} ${styles.badgeVerified}`}>Đã xác thực</span>}
                                        {cus.status === 'pending' && <span className={`${styles.badge} ${styles.badgePending}`}>Đang chờ</span>}
                                        {cus.status === 'failed' && <span className={`${styles.badge} ${styles.badgeFailed}`}>Thất bại</span>}
                                    </td>
                                    <td>
                                        <div className={styles.actionGroup}>
                                            <button className={styles.iconBtn} title="Xem chi tiết" onClick={() => handleView(cus)}><FiEye /></button>
                                            <button className={styles.iconBtn} title="Xóa" onClick={() => handleDeleteClick(cus)}><FiTrash2 /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className={styles.emptyState}>Không tìm thấy hồ sơ nào.</td>
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

            <CustomerViewModal isOpen={isViewModalOpen} onClose={closeModal} customer={selectedCustomer} />
            <CustomerDeleteModal isOpen={isDeleteModalOpen} onClose={closeModal} onConfirm={confirmDelete} customer={selectedCustomer} />

        </div>
    );
};

export default CustomerManagement;