import React from 'react';
import ReactDOM from 'react-dom';
import styles from './SkipNav.module.css';

export default function SkipNav() {
  return (
    <>
      {ReactDOM.createPortal(
        <div className={styles['skip-nav']}>
          <a href='#nav'>메뉴 바로가기</a>
          <a href='#main'>본문 바로가기</a>
        </div>,
        document.getElementById('skip-root')
      )}
    </>
  );
}
