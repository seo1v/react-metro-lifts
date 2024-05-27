import React from 'react';
import { BiSolidUpArrowAlt } from 'react-icons/bi';
import styles from './ScrollButton.module.css';

export default function ScrollButton({ onScroll }) {
  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={onScroll}>
        <BiSolidUpArrowAlt />
      </button>
    </div>
  );
}
