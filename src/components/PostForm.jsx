import React, { useState } from 'react';
import { auth, db, storage } from '../api/firebase';
import { collection, addDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import useAvatar from '../hooks/useAvatar';
import Modal from './ui/Modal';
import { BiCheck, BiSolidPhotoAlbum, BiPlus, BiLoader } from 'react-icons/bi';
import styles from './PostForm.module.css';

export default function PostForm() {
  const user = auth.currentUser;
  const {
    avatarQuery: { isLoading: isAvatarLoading, error, data: avatar },
  } = useAvatar(user.uid);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleFileChange = (e) => {
    const { files } = e.target;

    if (files && files[0].size > 1500000)
      return alert('1.5MB 이하의 이미지를 업로드하세요');
    if (files && files.length === 1 && files[0].size <= 1000000) {
      setFile(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || isMessageLoading || message === '' || message.length > 120)
      return;

    try {
      setIsMessageLoading(true);

      // firestore에 데이터 추가
      const doc = await addDoc(collection(db, 'messages'), {
        message,
        createdAt: Date.now(),
        username: user.displayName || 'Anonymous',
        userId: user.uid,
      });

      // storage에 파일 업로드
      if (file) {
        const storageRef = ref(storage, `messages/${user.uid}/${doc.id}`);
        const result = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
      }

      if (avatar) {
        await updateDoc(doc, {
          avatar,
        });
      }

      setMessage('');
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setIsMessageLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea
        id='main'
        tabIndex='0'
        className={styles.textarea}
        rows='5'
        maxLength='120'
        onChange={handleMessageChange}
        value={message}
        placeholder='무슨 일이 일어나고 있나요?'
        required
      ></textarea>
      <div className={styles.editor}>
        <div className={styles.avatar}>
          <img
            src={user.photoURL ?? process.env.REACT_APP_DEFAULT_AVATAR}
            alt={user.displayName}
          />
        </div>
        <div className={styles.upload}>
          <input
            type='file'
            id='file'
            accept='image/*'
            onChange={handleFileChange}
          />
          <label htmlFor='file' className={styles.button}>
            {file ? <BiCheck /> : <BiSolidPhotoAlbum />}
          </label>
        </div>
        <div className={styles.post}>
          <input id='submit' type='submit' />
          <label htmlFor='submit' className={styles.button}>
            {isMessageLoading ? <BiLoader /> : <BiPlus />}
          </label>
        </div>
      </div>
      {isAvatarLoading && <Modal message='로딩 중...' />}
      {error && <Modal message='문제가 발생했습니다!' />}
    </form>
  );
}
