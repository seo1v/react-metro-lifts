import React from 'react';
import styles from './Logo.module.css';

const env = process.env;
env.PUBLIC_URL = env.PUBLIC_URL || '';

export default function Logo({ size }) {
  return (
    <div className={styles.container}>
      <img
        className={`${size ? styles[size] : ''}`}
        src={process.env.PUBLIC_URL + '/images/logo.png'}
        alt='로고'
      />
    </div>
  );
}
