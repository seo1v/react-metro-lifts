import React from 'react';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>페이지를 찾을 수 없습니다.</h2>
    </div>
  );
}
