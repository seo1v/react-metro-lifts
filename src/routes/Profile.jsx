/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { auth, db } from '../api/firebase';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import useAvatar from '../hooks/useAvatar';
import Message from '../components/Message';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Main from '../components/Main';
import Aside from '../components/ui/Aside';
import Modal from '../components/ui/Modal';
import {
  BiDotsHorizontalRounded,
  BiSolidUserCircle,
  BiEditAlt,
  BiCheck,
} from 'react-icons/bi';
import styles from './Profile.module.css';

export default function Profile() {
  const user = auth.currentUser;
  const {
    avatarQuery: { isLoading, error, data: avatar },
    updateAvatar,
  } = useAvatar(user?.uid);
  const [messages, setMessages] = useState([]);
  const [changedName, setChangedName] = useState(
    user?.displayName ?? 'Anonymous'
  );
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const nameRef = useRef(null);

  // 아바타 변경
  const handleAvatarChange = (e) => {
    const { files } = e.target;

    if (!user) return;
    if (files && files[0].size > 1500000)
      return alert('1.5MB 이하의 이미지를 업로드하세요');

    if (files && files.length === 1 && files[0].size <= 100000) {
      const file = files[0];
      updateAvatar.mutate(file);
    }

    setShowMenu(false);
  };

  // 입력한 값을 name에 저장
  const onNameChange = (e) => {
    setChangedName(e.target.value);
  };

  // 이름 수정
  const handleNameEdit = async () => {
    if (!user || !isEditing) return;

    const regex = /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){1,8}[a-zA-Z0-9]$/;

    if (!regex.test(changedName.trim())) {
      return alert(
        '이름은 영문 대소문자, 숫자, 점(.), 밑줄(_), 하이픈(-)으로 구성된 3자 이상 10자 이내여야 합니다.'
      );
    }

    try {
      await updateProfile(user, {
        displayName: changedName,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsEditing(false);
    }
  };

  // 피드 불러오기
  const fetchMessages = async () => {
    const messageQuery = query(
      collection(db, 'messages'),
      where('userId', '==', user?.uid),
      orderBy('createdAt', 'desc'),
      limit(25)
    );

    const snapshot = await getDocs(messageQuery);
    const messages = snapshot.docs.map((doc) => {
      const { message, createdAt, userId, username, photo, avatar } =
        doc.data();

      return {
        message,
        createdAt,
        userId,
        username,
        photo,
        avatar,
        id: doc.id,
      };
    });
    setMessages(messages);
  };

  useEffect(() => {
    if (isEditing) {
      nameRef.current.focus();
    }
  }, [isEditing]);

  // messages가 변경될 때마다 feed 업데이트
  useEffect(() => {
    fetchMessages();
  }, [messages]);

  return (
    <Wrapper>
      <Aside />
      <Header>
        <section className={styles.profile}>
          <div className={styles.user}>
            <div className={styles.avatar}>
              <img
                src={avatar ?? process.env.REACT_APP_DEFAULT_AVATAR}
                alt={`${user.displayName} 아바타`}
              />
            </div>
            {isEditing ? (
              <div className={styles.editor}>
                <input
                  ref={nameRef}
                  onChange={onNameChange}
                  type='text'
                  placeholder='새로운 이름'
                />
                <button
                  onClick={handleNameEdit}
                  className={styles['edit-button']}
                >
                  <BiCheck />
                </button>
              </div>
            ) : (
              <div className={styles['user-info']}>
                <h2 className={styles.username}>
                  {user?.displayName ?? 'Anonymous'}
                </h2>
                {user && user.email && (
                  <h3 className={styles.email}>{user.email}</h3>
                )}
              </div>
            )}
          </div>
          <div className={styles['btn-container']}>
            <button
              className={styles['show-button']}
              onClick={() => setShowMenu(!showMenu)}
            >
              <BiDotsHorizontalRounded />
            </button>
            {showMenu && (
              <ul className={styles.menu}>
                <li>
                  <button
                    className={styles.button}
                    onClick={() => {
                      setIsEditing(!isEditing);
                      setShowMenu(!showMenu);
                    }}
                  >
                    <BiEditAlt /> &#x2004; 이름변경
                  </button>
                </li>
                <li>
                  <input
                    onChange={handleAvatarChange}
                    id='avatar'
                    type='file'
                    accept='image/*'
                  />
                  <label className={styles.button} htmlFor='avatar'>
                    <BiSolidUserCircle />
                    &#x2004; 사진변경
                  </label>
                </li>
              </ul>
            )}
          </div>
        </section>
      </Header>
      <Main>
        {messages.map((message) => (
          <Message key={message.id} info={message} />
        ))}
      </Main>
      {isLoading && <Modal message='로딩 중...' />}
      {error && <Modal message='문제가 발생했습니다!' />}
    </Wrapper>
  );
}
