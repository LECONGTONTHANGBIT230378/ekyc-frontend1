import React, { useState, useEffect } from 'react';
import {
    FiCalendar, FiCheckCircle, FiXCircle, FiClock,
    FiActivity, FiTrendingUp, FiTrendingDown, FiDownload
} from 'react-icons/fi';
import { dashboardService } from '../../services/dashboardService';
import styles from './Reports.module.css';

const Reports = () => {
    const [timeRange, setTimeRange] = useState('7days');
    const [exportModal, setExportModal] = useState({ isOpen: false, message: '', isError: false });
    const [loading, setLoading] = useState(true);

    // State quản lý số liệu thật từ Backend
    const [stats, setStats] = useState({
        totalVerifications: 0,
        successfulMatches: 0,
        failedMatches: 0
    });

    // Gọi API lấy dữ liệu thống kê khi trang được tải
    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                const data = await dashboardService.getStatistics();
                if (data) {
                    setStats({
                        totalVerifications: data.totalVerifications || 0,
                        successfulMatches: data.successfulMatches || 0,
                        failedMatches: data.failedMatches || 0
                    });
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu báo cáo:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStatistics();
    }, []);

    // Tính tỷ lệ thành công dựa trên dữ liệu thật
    const successRate = stats.totalVerifications === 0
        ? 0
        : ((stats.successfulMatches / stats.totalVerifications) * 100).toFixed(1);

    // Dữ liệu biểu đồ (Mock data - Đợi Backend nâng cấp sau)
    const barChartData = [
        { label: 'T2', value: 120, height: '40%' },
        { label: 'T3', value: 250, height: '70%' },
        { label: 'T4', value: 180, height: '55%' },
        { label: 'T5', value: 310, height: '90%' },
        { label: 'T6', value: 220, height: '65%' },
        { label: 'T7', value: 400, height: '100%' },
        { label: 'CN', value: 290, height: '80%' },
    ];

    // Dữ liệu nguyên nhân lỗi (Mock data)
    const errorStats = [
        { reason: 'Khuôn mặt bị mờ/nhòe', percent: 45, count: 124 },
        { reason: 'CCCD bị chói sáng', percent: 30, count: 82 },
        { reason: 'Không khớp với cơ sở dữ liệu', percent: 15, count: 41 },
        { reason: 'Lý do khác', percent: 10, count: 28 },
    ];

    // XỬ LÝ TẢI FILE EXCEL CÓ GỌI API
    const handleExportExcel = async () => {
        setExportModal({
            isOpen: true,
            message: "Hệ thống đang chuẩn bị dữ liệu và tải xuống file BaoCao_eKYC.xlsx. Quá trình này có thể mất vài giây...",
            isError: false
        });
        try {
            const blobData = await dashboardService.exportExcel();
            const url = window.URL.createObjectURL(new Blob([blobData]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'danh_sach_khach_hang_ekyc.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            setExportModal({
                isOpen: true,
                message: "Đã xảy ra lỗi trong quá trình xuất file Excel. Vui lòng thử lại sau!",
                isError: true
            });
        }
    };

    // XỬ LÝ TẢI FILE CSV CÓ GỌI API
    const handleExportCSV = async () => {
        setExportModal({
            isOpen: true,
            message: "Hệ thống đang trích xuất dữ liệu và tải xuống file BaoCao_eKYC.csv. Vui lòng không đóng trình duyệt...",
            isError: false
        });
        try {
            const blobData = await dashboardService.exportCsv();
            const url = window.URL.createObjectURL(new Blob([blobData]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'danh_sach_khach_hang_ekyc.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            setExportModal({
                isOpen: true,
                message: "Đã xảy ra lỗi trong quá trình xuất file CSV. Vui lòng thử lại sau!",
                isError: true
            });
        }
    };

    const closeExportModal = () => {
        setExportModal({ isOpen: false, message: '', isError: false });
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.headerSection}>
                <div>
                    <h2 className={styles.title}>Báo cáo & Thống kê</h2>
                    <p className={styles.subtitle}>Tổng hợp dữ liệu và hiệu suất hoạt động của hệ thống eKYC.</p>
                </div>

                <div className={styles.headerTools}>
                    <div className={styles.dateFilter}>
                        <FiCalendar className={styles.calendarIcon} />
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className={styles.dateSelect}
                        >
                            <option value="today">Hôm nay</option>
                            <option value="7days">7 ngày qua</option>
                            <option value="30days">30 ngày qua</option>
                            <option value="thisYear">Năm nay</option>
                        </select>
                    </div>

                    <button className={styles.exportCsvBtn} onClick={handleExportCSV}>
                        <FiDownload size={16} />
                        <span>Xuất CSV</span>
                    </button>

                    <button className={styles.exportExcelBtn} onClick={handleExportExcel}>
                        <FiDownload size={16} />
                        <span>Xuất Excel</span>
                    </button>
                </div>
            </div>

            {/* KHỐI 4 THẺ THỐNG KÊ */}
            <div className={styles.statsGrid}>
                {/* Thẻ 1: Tổng lượt xác thực */}
                <div className={styles.statCard}>
                    <div className={styles.statIconWrapper} style={{ backgroundColor: '#E8F3FF', color: '#0066FF' }}>
                        <FiActivity size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Tổng lượt xác thực</span>
                        <strong className={styles.statValue}>
                            {loading ? '...' : stats.totalVerifications.toLocaleString('vi-VN')}
                        </strong>
                        <div className={styles.statTrend}>
                            <FiTrendingUp className={styles.trendUp} />
                            <span className={styles.trendTextUp}>+12.5% so với kỳ trước</span>
                        </div>
                    </div>
                </div>

                {/* Thẻ 2: Tỷ lệ thành công */}
                <div className={styles.statCard}>
                    <div className={styles.statIconWrapper} style={{ backgroundColor: '#E9F9EE', color: '#10B981' }}>
                        <FiCheckCircle size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Tỷ lệ thành công</span>
                        <strong className={styles.statValue}>
                            {loading ? '...' : `${successRate}%`}
                        </strong>
                        <div className={styles.statTrend}>
                            <FiTrendingUp className={styles.trendUp} />
                            <span className={styles.trendTextUp}>+2.1% so với kỳ trước</span>
                        </div>
                    </div>
                </div>

                {/* Thẻ 3: Lượt thất bại */}
                <div className={styles.statCard}>
                    <div className={styles.statIconWrapper} style={{ backgroundColor: '#FEECEB', color: '#EF4444' }}>
                        <FiXCircle size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Lượt thất bại</span>
                        <strong className={styles.statValue}>
                            {loading ? '...' : stats.failedMatches.toLocaleString('vi-VN')}
                        </strong>
                        <div className={styles.statTrend}>
                            <FiTrendingDown className={styles.trendDown} />
                            <span className={styles.trendTextDown}>-5.4% so với kỳ trước</span>
                        </div>
                    </div>
                </div>

                {/* Thẻ 4: Thời gian xử lý TB */}
                <div className={styles.statCard}>
                    <div className={styles.statIconWrapper} style={{ backgroundColor: '#FFF4E5', color: '#F59E0B' }}>
                        <FiClock size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Thời gian xử lý TB</span>
                        <strong className={styles.statValue}>1.2s</strong>
                        <div className={styles.statTrend}>
                            <span className={styles.trendTextNeutral}>Giữ nguyên so với kỳ trước</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* KHỐI BIỂU ĐỒ */}
            <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Lưu lượng xác thực (7 ngày qua)</h3>
                    <div className={styles.barChartContainer}>
                        {barChartData.map((data, index) => (
                            <div key={index} className={styles.barColumn}>
                                <div className={styles.barValueTooltip}>{data.value}</div>
                                <div className={styles.barTrack}>
                                    <div className={styles.barFill} style={{ height: data.height }}></div>
                                </div>
                                <span className={styles.barLabel}>{data.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Nguyên nhân thất bại phổ biến</h3>
                    <div className={styles.errorList}>
                        {errorStats.map((error, index) => (
                            <div key={index} className={styles.errorItem}>
                                <div className={styles.errorHeader}>
                                    <span className={styles.errorReason}>{error.reason}</span>
                                    <span className={styles.errorCount}>{error.count} lượt ({error.percent}%)</span>
                                </div>
                                <div className={styles.progressBarTrack}>
                                    <div
                                        className={styles.progressBarFill}
                                        style={{
                                            width: `${error.percent}%`,
                                            backgroundColor: index === 0 ? '#EF4444' : index === 1 ? '#F59E0B' : index === 2 ? '#3B82F6' : '#9CA3AF'
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* MODAL THÔNG BÁO TẢI FILE */}
            {exportModal.isOpen && (
                <div className={styles.modalOverlay} onClick={closeExportModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalIconBox} style={{ color: exportModal.isError ? '#EF4444' : '#10B981' }}>
                            {exportModal.isError ? <FiXCircle size={32} /> : <FiCheckCircle size={32} />}
                        </div>
                        <h3 className={styles.modalTitle}>
                            {exportModal.isError ? 'Tải tệp thất bại' : 'Đã tiếp nhận yêu cầu'}
                        </h3>
                        <p className={styles.modalText}>{exportModal.message}</p>
                        <button className={styles.btnPrimaryFull} onClick={closeExportModal}>
                            Đã hiểu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;