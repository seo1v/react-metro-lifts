import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { auth } from '../api/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { BiSolidEnvelope, BiSolidLockAlt } from 'react-icons/bi';
import Modal from '../components/ui/Modal.jsx';
import Logo from '../components/ui/Logo.jsx';
import styles from './SignIn.module.css';

export default function SignIn() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  // 사용자가 존재하면 home으로 리다이렉트
  if (user) {
    return <Navigate to='/' />;
  }

  const onSubmit = async (data) => {
    setError('');

    try {
      setIsLoading(true);

      // 로그인
      await signInWithEmailAndPassword(auth, data.email, data.password);

      // Home으로 이동
      navigate('/');
    } catch (e) {
      setError(
        e.code === 'auth/invalid-login-credentials'
          ? '유효하지 않은 이메일 또는 비밀번호입니다.'
          : e.code
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <aside className={styles.bg}></aside>
      <section className={styles.section}>
        <header className={styles.header}>
          <Logo size='big' />
          <div className={styles.text}>
            <h1 className={styles.title}>좋은 하루입니다!</h1>
            <p className={styles.subtitle}>
              당신이 향하는 곳 어디든,&#x2004;
              <span className={styles.point}>Wherever</span>와 함께하세요
            </p>
          </div>
        </header>
        <main className={styles.main}>
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
                      value:
                        /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
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
            <input type='submit' value='로그인' />
            {error !== '' ? <p className={styles.error}>{error}</p> : null}
          </form>
        </main>
        <footer>
          <p className={styles.switcher}>
            아직 계정이 없으신가요? &#x2004;
            <Link to='/signup'>회원가입 &rarr;</Link>
          </p>
        </footer>
      </section>
      {isLoading && <Modal message='로그인 중...' />}
    </div>
  );
}
