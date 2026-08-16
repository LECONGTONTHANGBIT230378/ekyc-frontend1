// Tên file: StatsCard.jsx
import React from 'react';
import styles from './Dashboard.module.css';

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

            <div className={`${styles.cardIconWrapper} ${iconClass}`}>
                {Icon && <Icon />}
            </div>
        </div>
    );
};

export default StatsCard;