import React from 'react';
import styles from './Dashboard.module.css';
import StatsCard from './StatsCard';
import { FiServer } from 'react-icons/fi';

const statData = [
    { title: 'Tổng khách hàng', index: '01', value: '12,480', badge: '+18.4%' },
    { title: 'Tổng đăng ký', index: '02', value: '1,284', badge: '+7.2%' },
    { title: 'Xác thực thành công', index: '03', value: '11,902', badge: '95.3%' },
    { title: 'Xác thực thất bại', index: '04', value: '578', badge: '4.7%' },
];

const Dashboard = () => {
    return (
        <div className={styles.container}>

            {/* 4 Thẻ thống kê */}
            <div className={styles.statsGrid}>
                {statData.map((stat, idx) => (
                    <StatsCard key={idx} {...stat} />
                ))}
            </div>

            <div className={styles.bottomGrid}>
                {/* Biểu đồ xu hướng */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3>Xu hướng đăng ký</h3>
                        <p>Hồ sơ khách hàng được tạo theo thời gian.</p>
                    </div>
                    <div className={styles.chartArea}>
                        <svg viewBox="0 -20 800 250" className={styles.svgChart} preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#0F5B4C" stopOpacity="0.2"/>
                                    <stop offset="100%" stopColor="#0F5B4C" stopOpacity="0"/>
                                </linearGradient>
                            </defs>
                            <g className={styles.gridLines}>
                                <line x1="40" y1="200" x2="800" y2="200" />
                                <line x1="40" y1="100" x2="800" y2="100" />
                            </g>
                            <polygon points="40,200 40,150 192,120 344,90 496,95 648,60 800,40 800,200" fill="url(#areaGrad)" />
                            <polyline points="40,150 192,120 344,90 496,95 648,60 800,40" fill="none" stroke="#0F5B4C" strokeWidth="2.5" />
                        </svg>
                    </div>
                </div>

                {/* Tình trạng xác thực */}
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