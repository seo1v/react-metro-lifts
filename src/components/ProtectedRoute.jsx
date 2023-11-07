import React from 'react';
import { auth } from '../api/firebase';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const user = auth.currentUser;

  // 사용자가 존재하지 않으면 로그인 페이지로 리다이렉션
  if (user === null) {
    return <Navigate to='/signin' />;
  }

  return children;
}
