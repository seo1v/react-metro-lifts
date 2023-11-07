import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getLocations } from '../api/metro';
import { useScrollToTop } from '../hooks/useScrollToTop';
import LocationCard from '../components/LocationCard';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import Main from '../components/Main';
import Modal from '../components/ui/Modal';
import Aside from '../components/ui/Aside';
import ScrollButton from '../components/ui/ScrollButton';
import { BiSearch } from 'react-icons/bi';
import styles from './Home.module.css';

export default function Home() {
  const {
    isLoading,
    error,
    data: locations,
  } = useQuery(['locations'], getLocations, {
    staleTime: 1000 * 60 * 10,
  });
  const [text, setText] = useState('');
  const [filteredStations, setFilteredStations] = useState([]);
  const { showButton, onScrollToTop } = useScrollToTop();

  const handleFind = (keyword, stations) => {
    const regex = new RegExp(keyword, 'gi');

    return stations.filter((station) => station.station_nm.match(regex));
  };

  useEffect(() => {
    if (locations) {
      const matchArr = handleFind(text, locations) || [];
      setFilteredStations(matchArr);
    }
  }, [text, locations]);

  return (
    <Wrapper>
      <Aside />
      <Header>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <label className={styles.label} htmlFor='main'>
            *역명을 입력하세요.
          </label>
          <div className={styles['form-content']}>
            <input
              id='main'
              tabIndex='0'
              type='text'
              placeholder='역명을 입력하세요'
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <BiSearch />
          </div>
        </form>
      </Header>
      <Main>
        {filteredStations && (
          <ul>
            {filteredStations.map((station) => (
              <LocationCard key={station.id} station={station} />
            ))}
          </ul>
        )}
      </Main>
      {showButton && <ScrollButton onScroll={onScrollToTop} />}
      {isLoading && <Modal message='로딩 중...' />}
      {error && <Modal message='문제가 발생했습니다!' />}
    </Wrapper>
  );
}
