import React from 'react';
import styles from './Aside.module.css';

export default function Aside() {
  return (
    <aside className={styles.aside}>
      <h2 className={styles.title}>Wherever</h2>
      <p className={styles.subtitle}>자유롭고 안전한 이동권을 위해</p>
      <img src={process.env.PUBLIC_URL + '/images/aside.png'} alt='bg' />
    </aside>
  );
}
