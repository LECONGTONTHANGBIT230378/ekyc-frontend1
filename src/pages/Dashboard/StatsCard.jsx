import React from 'react';
import styles from './Dashboard.module.css'; // Dùng chung file module hoặc đổi đường dẫn tương ứng

const StatsCard = ({ title, index, value, badge, Icon, iconClass }) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardInfo}>
                <div className={styles.cardHeader}>
                    <span>{title}</span>
                    <span>{index}</span>
                </div>
                <h3 className={styles.cardValue}>{value}</h3>
                <span className={styles.cardBadge}>{badge}</span>
            </div>

            {/* Hiển thị Icon và màu nền tương ứng */}
            <div className={`${styles.cardIconWrapper} ${iconClass}`}>
                {Icon && <Icon />}
            </div>
        </div>
    );
};

export default StatsCard;