import React, { useState } from 'react';
// Import thêm icon FiX dùng cho nút Đóng modal
import { FiCalendar, FiCheckCircle, FiXCircle, FiClock, FiActivity, FiTrendingUp, FiTrendingDown, FiDownload, FiX } from 'react-icons/fi';
import styles from './Reports.module.css';

const Reports = () => {
    const [timeRange, setTimeRange] = useState('7days');

    // THÊM STATE QUẢN LÝ MODAL THÔNG BÁO
    const [exportModal, setExportModal] = useState({ isOpen: false, message: '' });

    const barChartData = [
        { label: 'T2', value: 120, height: '40%' },
        { label: 'T3', value: 250, height: '70%' },
        { label: 'T4', value: 180, height: '55%' },
        { label: 'T5', value: 310, height: '90%' },
        { label: 'T6', value: 220, height: '65%' },
        { label: 'T7', value: 400, height: '100%' },
        { label: 'CN', value: 290, height: '80%' },
    ];

    const errorStats = [
        { reason: 'Khuôn mặt bị mờ/nhòe', percent: 45, count: 124 },
        { reason: 'CCCD bị chói sáng', percent: 30, count: 82 },
        { reason: 'Không khớp với cơ sở dữ liệu', percent: 15, count: 41 },
        { reason: 'Lý do khác', percent: 10, count: 28 },
    ];

    // CẬP NHẬT LẠI HÀM XỬ LÝ: Mở Modal thay vì dùng alert()
    const handleExportExcel = () => {
        setExportModal({ isOpen: true, message: "Hệ thống đang chuẩn bị dữ liệu và tải xuống file BaoCao_eKYC.xlsx. Quá trình này có thể mất vài giây..." });
    };

    const handleExportCSV = () => {
        setExportModal({ isOpen: true, message: "Hệ thống đang trích xuất dữ liệu và tải xuống file BaoCao_eKYC.csv. Vui lòng không đóng trình duyệt..." });
    };

    const closeExportModal = () => {
        setExportModal({ isOpen: false, message: '' });
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

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIconWrapper} style={{ backgroundColor: '#E8F3FF', color: '#0066FF' }}>
                        <FiActivity size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Tổng lượt xác thực</span>
                        <strong className={styles.statValue}>1,770</strong>
                        <div className={styles.statTrend}>
                            <FiTrendingUp className={styles.trendUp} />
                            <span className={styles.trendTextUp}>+12.5% so với kỳ trước</span>
                        </div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIconWrapper} style={{ backgroundColor: '#E9F9EE', color: '#10B981' }}>
                        <FiCheckCircle size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Tỷ lệ thành công</span>
                        <strong className={styles.statValue}>84.5%</strong>
                        <div className={styles.statTrend}>
                            <FiTrendingUp className={styles.trendUp} />
                            <span className={styles.trendTextUp}>+2.1% so với kỳ trước</span>
                        </div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIconWrapper} style={{ backgroundColor: '#FEECEB', color: '#EF4444' }}>
                        <FiXCircle size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Lượt thất bại</span>
                        <strong className={styles.statValue}>275</strong>
                        <div className={styles.statTrend}>
                            <FiTrendingDown className={styles.trendDown} />
                            <span className={styles.trendTextDown}>-5.4% so với kỳ trước</span>
                        </div>
                    </div>
                </div>

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

            {/* GIAO DIỆN MODAL THÔNG BÁO MỚI (XỊN HƠN) */}
            {exportModal.isOpen && (
                <div className={styles.modalOverlay} onClick={closeExportModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalIconBox}>
                            <FiCheckCircle size={32} />
                        </div>
                        <h3 className={styles.modalTitle}>Đã tiếp nhận yêu cầu</h3>
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