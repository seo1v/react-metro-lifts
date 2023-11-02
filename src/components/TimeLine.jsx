import React, { useEffect, useState } from 'react';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../api/firebase';
import Message from '../components/Message';
import styles from './TimeLine.module.css';

export default function TimeLine() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let unsubscribe = null;

    const fetchMessages = async () => {
      const messageQuery = query(
        collection(db, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(25)
      );

      unsubscribe = await onSnapshot(messageQuery, (snapshot) => {
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
      });
    };
    fetchMessages();

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <ul className={styles.messages}>
      {messages.map((message) => (
        <Message key={message.id} info={message} />
      ))}
    </ul>
  );
}
