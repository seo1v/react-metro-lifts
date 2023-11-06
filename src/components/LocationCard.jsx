import React from 'react';
import styles from './LocationCard.module.css';

export default function LocationCard({ station }) {
  const { faci_nm, location, station_nm, stup_lctn, use_yn } = station;
  const classes = `${styles.status} ${
    use_yn === '사용가능' ? styles.on : styles.off
  }`;

  return (
    <li className={styles.item}>
      <h3 className={styles.station}>{station_nm}</h3>
      <p className={styles.facility}>{faci_nm.split(')')[1]}</p>
      <h2 className={styles.location}>{location}</h2>
      <div className={styles.info}>
        <span className={styles.section}>운행구간: {stup_lctn}</span>
        <span className={classes}>{use_yn}</span>
      </div>
    </li>
  );
}
