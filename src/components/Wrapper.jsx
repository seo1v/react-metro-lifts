import React from 'react';
import styles from './Wrapper.module.css';

export default function Wapper({ children }) {
  return <div className={styles.wrapper}>{children}</div>;
}
