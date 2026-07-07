import React from 'react';
import styles from './Dashboard.module.css';

const StatsCard = ({ title, index, value, badge }) => (
    <div className={styles.card}>
        <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>{title}</span>
            <span className={styles.cardIndex}>{index}</span>
        </div>
        <h3 className={styles.cardValue}>{value}</h3>
        <span className={styles.cardBadge}>{badge}</span>
    </div>
);

export default StatsCard;