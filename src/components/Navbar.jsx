import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../api/firebase';
import Logo from '../components/ui/Logo.jsx';
import styles from './Navbar.module.css';

export default function Navbar() {
  const navigate = useNavigate();

  // 로그아웃
  const onSignOut = () => {
    const ok = window.confirm('로그아웃 하시겠습니까?');

    if (ok) {
      auth.signOut();
      navigate('/signin');
    }
  };

  return (
    <nav id='nav' tabIndex='0' className={styles.navbar}>
      <ul className={styles.items}>
        <li className={`${styles.item} ${styles.logo}`}>
          <Logo size='small' />
        </li>
        <li className={styles.item}>
          <Link to='/'>메인</Link>
        </li>
        <li className={styles.item}>
          <Link to='/feed'>피드</Link>
        </li>
      </ul>
      <ul className={styles.items}>
        <li className={styles.item}>
          <Link to='/profile'>프로필</Link>
        </li>
        <li className={styles.item} onClick={onSignOut}>
          <Link>로그아웃</Link>
        </li>
      </ul>
    </nav>
  );
}
