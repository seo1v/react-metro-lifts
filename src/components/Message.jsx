import React, { useState } from 'react';
import { auth, db, storage } from '../api/firebase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import moment from 'moment';
import {
  BiDotsHorizontalRounded,
  BiSolidTrashAlt,
  BiEditAlt,
  BiCheck,
} from 'react-icons/bi';
import styles from './Message.module.css';

export default function Message({
  info: { username, photo, message, userId, id, createdAt, avatar },
}) {
  const user = auth.currentUser;
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState('');

  // 수정된 메시지 값을 text에 저장
  const handleMessageChange = (e) => {
    setText(e.target.value);
  };

  // 작성글 수정
  const handleEdit = async () => {
    setShowMenu(false);

    if (!isEditing || (user && user.uid !== userId)) return;

    try {
      if (text === '' || text.length > 120) return;

      // doc 업데이트
      await updateDoc(doc(db, 'messages', id), {
        message: text,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsEditing(!isEditing);
      setText('');
    }
  };

  // 작성글 삭제
  const handleDelete = async () => {
    setShowMenu(false);

    const ok = window.confirm('정말 삭제하시겠습니까?');
    if (!ok || (user && user.uid !== userId)) return;

    try {
      // firestore에서 id에 해당하는 데이터 삭제
      await deleteDoc(doc(db, 'messages', id));

      // storage에서 id에 해당하는 사진 삭제
      if (photo) {
        const photoRef = ref(storage, `messages/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setShowMenu(false);
    }
  };

  return (
    <li className={styles.container}>
      <article>
        <div className={styles.header}>
          <div className={styles.user}>
            <div className={styles.avatar}>
              <img
                src={avatar ?? process.env.REACT_APP_DEFAULT_AVATAR}
                alt={username}
              />
            </div>
            <div className={styles['user-info']}>
              <span className={styles.username}>{username}</span>
              <span className={styles.date}>
                {moment(new Date(createdAt)).fromNow()}
              </span>
            </div>
          </div>
          {user && user.uid === userId ? (
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
                      onClick={() => {
                        setIsEditing(!isEditing);
                        setShowMenu(!showMenu);
                      }}
                    >
                      <BiEditAlt /> &#x2004; 수정하기
                    </button>
                  </li>
                  <li>
                    <button onClick={handleDelete}>
                      <BiSolidTrashAlt />
                      &#x2004; 삭제하기
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : null}
        </div>
        <div className={styles.content}>
          {photo ? <img src={photo} alt='upload' /> : null}
          {isEditing ? (
            <div className={styles.editor}>
              <textarea
                onChange={handleMessageChange}
                row='5'
                value={text}
                className={styles.textarea}
                maxLength='120'
                required
                placeholder={message}
              ></textarea>
              <button onClick={handleEdit} className={styles['edit-button']}>
                <BiCheck />
              </button>
            </div>
          ) : (
            <p className={styles.message}>{message}</p>
          )}
        </div>
      </article>
    </li>
  );
}
