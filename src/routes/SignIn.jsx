import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { auth } from '../api/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { BiSolidEnvelope, BiSolidLockAlt } from 'react-icons/bi';
import Modal from '../components/ui/Modal';
import Logo from '../components/ui/Logo';
import styles from './SignIn.module.css';

export default function SignIn() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const onSubmit = async (data) => {
    setError('');

    try {
      // 로딩 시작
      setIsLoading(true);

      // 로그인
      await signInWithEmailAndPassword(auth, data.email, data.password);

      // Home으로 이동
      navigate('/');
    } catch (e) {
      // 에러 처리
      setError(
        e.code === 'auth/invalid-login-credentials'
          ? '유효하지 않은 이메일 또는 비밀번호입니다.'
          : e.code
      );
    } finally {
      // 로딩 끝
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <aside className={styles.bg}></aside>
      <section className={styles.section}>
        <header>
          <Logo />
          <div className={styles.text}>
            <h1 className={styles.title}>좋은 하루입니다!</h1>
            <p className={styles.subtitle}>
              당신이 향하는 곳 어디든, Wherever와 함께하세요
            </p>
          </div>
        </header>
        <legend className={styles.legend}>로그인</legend>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.contents}>
            <label htmlFor='email'>이메일</label>
            <div className={styles.content}>
              <input
                type='email'
                placeholder='wherever@example.com'
                {...register('email', {
                  required: '이메일을 입력하세요.',
                  pattern: {
                    value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                    message: '이메일을 올바른 형식으로 입력하세요.',
                  },
                })}
              />
              <BiSolidEnvelope />
            </div>
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>
          <div className={styles.contents}>
            <label htmlFor='password'>비밀번호</label>
            <div className={styles.content}>
              <input
                type='password'
                placeholder='비밀번호를 입력하세요.'
                {...register('password', {
                  required: '비밀번호를 입력하세요.',
                  minLength: {
                    value: 8,
                    message:
                      '비밀번호는 영어 대소문자, 숫자, 특수문자를 포함해 8자 이상이어야 합니다.',
                  },
                  pattern: {
                    value:
                      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                    message:
                      '비밀번호는 영어 대소문자, 숫자, 특수문자를 포함해 8자 이상이어야 합니다.',
                  },
                })}
              />
              <BiSolidLockAlt />
            </div>
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>
          <input type='submit' value='Sign In' />
          {error !== '' ? <p className={styles.error}>{error}</p> : null}
        </form>
        <footer>
          <p className={styles.switcher}>
            아직 계정이 없으신가요? &#x2004;
            <Link to='/signup'>Sign up &rarr;</Link>
          </p>
        </footer>
      </section>
      {isLoading && <Modal message='로그인 중...' />}
    </div>
  );
}
