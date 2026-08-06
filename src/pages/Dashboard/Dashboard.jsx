import React from 'react';
import styles from './Dashboard.module.css';
import StatsCard from './StatsCard';
import { FiServer, FiUsers, FiUserPlus, FiShield, FiXCircle } from 'react-icons/fi';
// Import các component từ Recharts
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dữ liệu mẫu cho biểu đồ
const chartData = [
    { name: 'T2', register: 160, verified: 145 },
    { name: 'T3', register: 240, verified: 215 },
    { name: 'T4', register: 210, verified: 196 },
    { name: 'T5', register: 310, verified: 280 },
    { name: 'T6', register: 400, verified: 370 },
    { name: 'T7', register: 280, verified: 250 },
    { name: 'CN', register: 190, verified: 175 },
];

const statData = [
    { title: 'Tổng khách hàng', index: '01', value: '12,480', badge: '+18.4%', Icon: FiUsers, iconClass: styles.iconPrimary },
    { title: 'Tổng đăng ký', index: '02', value: '1,284', badge: '+7.2%', Icon: FiUserPlus, iconClass: styles.iconSecondary },
    { title: 'Xác thực thành công', index: '03', value: '11,902', badge: '95.3%', Icon: FiShield, iconClass: styles.iconSuccess },
    { title: 'Xác thực thất bại', index: '04', value: '578', badge: '4.7%', Icon: FiXCircle, iconClass: styles.iconDanger },
];

// Component tạo Hộp Tooltip khi Hover
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className={styles.tooltipContainer}>
                <p className={styles.tooltipLabel}>{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className={styles.tooltipItem} style={{ color: entry.stroke }}>
                        {entry.dataKey} : <span>{entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const Dashboard = () => {
    return (
        <div className={styles.container}>
            <div className={styles.statsGrid}>
                {statData.map((stat, idx) => (
                    <StatsCard key={idx} {...stat} />
                ))}
            </div>

            <div className={styles.bottomGrid}>
                {/* Khu vực Biểu đồ Recharts */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3>Luồng đăng ký tuần này</h3>
                    </div>

                    <div className={styles.chartArea}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRegister" x1="0" y1="0" x2="0" y2="1">
                                        {/* Đang dùng tone Xanh rêu/Emerald theo ảnh mẫu */}
                                        <stop offset="5%" stopColor="#115E59" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#115E59" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#34D399" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                {/* Lưới nét đứt */}
                                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#E2E8F0" />
                                {/* Trục X (Ngày) và Trục Y (Số liệu) */}
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />

                                {/* Tooltip tùy chỉnh với đường gióng (cursor) nét đứt */}
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '3 3' }} />

                                {/* 2 Đường Line */}
                                <Area type="monotone" dataKey="register" stroke="#115E59" strokeWidth={2} fillOpacity={1} fill="url(#colorRegister)" activeDot={{ r: 4, strokeWidth: 0 }} />
                                <Area type="monotone" dataKey="verified" stroke="#34D399" strokeWidth={2} fillOpacity={1} fill="url(#colorVerified)" activeDot={{ r: 4, strokeWidth: 0 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Khu vực Tình trạng xác thực giữ nguyên */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3>Tình trạng xác thực</h3>
                        <p>Tỷ lệ OCR và so khớp khuôn mặt.</p>
                    </div>

                    <div className={styles.progressGroup}>
                        <div className={styles.progressText}><span>Tỷ lệ chính xác OCR</span> <strong>97%</strong></div>
                        <div className={styles.progressBg}><div className={styles.progressFill} style={{width: '97%'}}></div></div>
                    </div>

                    <div className={styles.progressGroup}>
                        <div className={styles.progressText}><span>Tỷ lệ khớp khuôn mặt</span> <strong>96%</strong></div>
                        <div className={styles.progressBg}><div className={styles.progressFill} style={{width: '96%'}}></div></div>
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