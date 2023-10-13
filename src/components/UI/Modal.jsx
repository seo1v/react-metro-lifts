import React from 'react';
import Loader from './Loader';
import styles from './Modal.module.css';

export default function Modal({ message }) {
  return (
    <>
      <div className={styles.backdrop}></div>
      <div className={styles.modal}>
        <Loader />
        <p className={styles.message}>{message ? message : ''}</p>
      </div>
    </>
  );
}
