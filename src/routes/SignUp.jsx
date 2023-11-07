import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { auth } from '../api/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { BiSolidUser, BiSolidEnvelope, BiSolidLockAlt } from 'react-icons/bi';
import Modal from '../components/ui/Modal';
import Logo from '../components/ui/Logo';
import styles from './SignUp.module.css';

export default function SignUp() {
  const user = auth.currentUser ?? null;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });
  let passwordCurrent = watch('password', '');

  // 사용자가 존재하면 home으로 리다이렉트
  if (user) {
    return <Navigate to='/' />;
  }

  const onSubmit = async (data) => {
    setError('');

    try {
      setIsLoading(true);

      // 계정 생성
      const credentials = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // 사용자 이름 프로필에 등록
      await updateProfile(credentials.user, {
        displayName: data.username,
        photoURL: process.env.REACT_APP_DEFAULT_AVATAR,
      });

      // Home으로 이동
      navigate('/');
    } catch (e) {
      setError(
        e.code === 'auth/email-already-in-use'
          ? '이미 존재하는 이메일입니다.'
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
            <h1 className={styles.title}>만나서 반가워요!</h1>
            <p className={styles.subtitle}>
              당신이 향하는 곳 어디든,&#x2004;
              <span className={styles.point}>Wherever</span>와 함께하세요
            </p>
          </div>
        </header>
        <main className={styles.main}>
          <legend className={styles.legend}>회원가입</legend>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.contents}>
              <label htmlFor='username'>사용자 이름</label>
              <div className={styles.content}>
                <input
                  type='text'
                  placeholder='이름을 입력하세요.'
                  {...register('username', {
                    required: '이름을 입력하세요.',
                    minLength: {
                      value: 3,
                      message: '이름은 3자 이상 입력해야 합니다.',
                    },
                    maxLength: {
                      value: 10,
                      message: '이름은 10자 이내로 입력해야 합니다.',
                    },
                    pattern: {
                      value:
                        /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){1,8}[a-zA-Z0-9]$/,
                      message:
                        '이름에 사용가능한 문자: 영문 대소문자, 숫자, 점(.), 밑줄(_), 하이픈(-)',
                    },
                  })}
                />
                <BiSolidUser />
              </div>
              {errors.username && (
                <p className={styles.error}>{errors.username.message}</p>
              )}
            </div>
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
            <div className={styles.contents}>
              <label htmlFor='passwordConfirm'>비밀번호 확인</label>
              <div className={styles.content}>
                <input
                  type='password'
                  placeholder='비밀번호를 다시 입력하세요.'
                  {...register('passwordConfirm', {
                    required: '비밀번호를 다시 입력하세요.',
                    validate: (value) =>
                      value === passwordCurrent ||
                      '비밀번호가 일치하지 않습니다.',
                  })}
                />
                <BiSolidLockAlt />
              </div>
              {errors.passwordConfirm && (
                <p className={styles.error}>{errors.passwordConfirm.message}</p>
              )}
            </div>
            <input type='submit' value='회원가입' />
            {error !== '' ? <p className={styles.error}>{error}</p> : null}
          </form>
        </main>
        <footer className={styles.footer}>
          <p className={styles.switcher}>
            이미 계정을 보유하고 계신가요? &#x2004;
            <Link to='/signin'>로그인 &rarr;</Link>
          </p>
        </footer>
      </section>
      {isLoading && <Modal message='가입 중...' />}
    </div>
  );
}
