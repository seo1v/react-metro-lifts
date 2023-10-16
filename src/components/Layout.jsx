import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import SkipNav from './SkipNav';

export default function Layout() {
  return (
    <>
      <SkipNav />
      <Navbar />
      <Outlet />
    </>
  );
}
