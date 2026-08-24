import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import StatsCard from './StatsCard';
import { FiServer, FiUsers, FiUserPlus, FiShield, FiXCircle } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardService } from '../../services/dashboardService';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className={styles.tooltipContainer}>
                <p className={styles.tooltipLabel}>{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className={styles.tooltipItem} style={{ color: entry.stroke }}>
                        {entry.dataKey === 'register' ? 'Đăng ký' : 'Xác thực'} : <span>{entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const Dashboard = () => {
    // ĐÃ SỬA: Bổ sung thêm dữ liệu mặc định cho biểu đồ
    const [stats, setStats] = useState({
        totalCustomers: 0,
        totalVerifications: 0,
        successfulMatches: 0,
        failedMatches: 0,
        avgOcrScore: 0,
        avgFaceMatchScore: 0,
        chartData: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const data = await dashboardService.getStatistics();
                if (data) {
                    setStats(data);
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu Dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const successRate = stats.totalVerifications > 0
        ? ((stats.successfulMatches / stats.totalVerifications) * 100).toFixed(1) + '%'
        : '0%';

    const failRate = stats.totalVerifications > 0
        ? ((stats.failedMatches / stats.totalVerifications) * 100).toFixed(1) + '%'
        : '0%';

    const dynamicStatData = [
        {
            title: 'Tổng khách hàng', index: '01',
            value: loading ? '...' : stats.totalCustomers.toLocaleString('vi-VN'),
            badge: 'Trong hệ thống',
            Icon: FiUsers, iconClass: styles.iconPrimary
        },
        {
            title: 'Tổng lượt eKYC', index: '02',
            value: loading ? '...' : stats.totalVerifications.toLocaleString('vi-VN'),
            badge: 'Tất cả các lượt',
            Icon: FiUserPlus, iconClass: styles.iconSecondary
        },
        {
            title: 'Xác thực thành công', index: '03',
            value: loading ? '...' : stats.successfulMatches.toLocaleString('vi-VN'),
            badge: successRate,
            Icon: FiShield, iconClass: styles.iconSuccess
        },
        {
            title: 'Xác thực thất bại', index: '04',
            value: loading ? '...' : stats.failedMatches.toLocaleString('vi-VN'),
            badge: failRate,
            Icon: FiXCircle, iconClass: styles.iconDanger
        },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.statsGrid}>
                {dynamicStatData.map((stat, idx) => (
                    <StatsCard key={idx} {...stat} />
                ))}
            </div>

            <div className={styles.bottomGrid}>
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3>Luồng đăng ký tuần này</h3>
                    </div>

                    <div className={styles.chartArea}>
                        <ResponsiveContainer width="100%" height="100%">
                            {/* ĐÃ SỬA: Lấy dữ liệu mảng chartData từ API thay vì Fix cứng */}
                            <AreaChart data={stats.chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRegister" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#115E59" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#115E59" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#34D399" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '3 3' }} />
                                <Area type="monotone" dataKey="register" stroke="#115E59" strokeWidth={2} fillOpacity={1} fill="url(#colorRegister)" activeDot={{ r: 4, strokeWidth: 0 }} />
                                <Area type="monotone" dataKey="verified" stroke="#34D399" strokeWidth={2} fillOpacity={1} fill="url(#colorVerified)" activeDot={{ r: 4, strokeWidth: 0 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3>Tình trạng xác thực</h3>
                        <p>Tỷ lệ OCR và so khớp khuôn mặt.</p>
                    </div>

                    <div className={styles.progressGroup}>
                        {/* ĐÃ SỬA: Kết nối biến điểm OCR từ hệ thống */}
                        <div className={styles.progressText}><span>Tỷ lệ chính xác OCR</span> <strong>{stats.avgOcrScore}%</strong></div>
                        <div className={styles.progressBg}><div className={styles.progressFill} style={{width: `${stats.avgOcrScore}%`}}></div></div>
                    </div>

                    <div className={styles.progressGroup}>
                        {/* ĐÃ SỬA: Kết nối biến điểm Face Match từ hệ thống */}
                        <div className={styles.progressText}><span>Tỷ lệ khớp khuôn mặt</span> <strong>{stats.avgFaceMatchScore}%</strong></div>
                        <div className={styles.progressBg}><div className={styles.progressFill} style={{width: `${stats.avgFaceMatchScore}%`}}></div></div>
                    </div>

                    <div className={styles.infoBox}>
                        <FiServer className={styles.infoIcon} />
                        <div>
                            <h4>Hệ thống sẵn sàng</h4>
                            <p>Tất cả hàng đợi đang dưới ngưỡng xử lý.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;