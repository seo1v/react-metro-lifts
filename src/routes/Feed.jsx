import React from 'react';
import PostForm from '../components/PostForm';
import TimeLine from '../components/TimeLine';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Main from '../components/Main';
import Aside from '../components/ui/Aside';
import { useScrollToTop } from '../hooks/useScrollToTop';
import ScrollButton from '../components/ui/ScrollButton';

export default function Feed() {
  const { showButton, onScrollToTop } = useScrollToTop();

  return (
    <Wrapper>
      <Aside />
      <Header>
        <PostForm />
      </Header>
      <Main>
        <TimeLine />
      </Main>
      {showButton && <ScrollButton onScroll={onScrollToTop} />}
    </Wrapper>
  );
}
