import { useEffect, useState } from 'react';

export function useScrollToTop() {
  const [showButton, setShowButton] = useState(false);

  const onScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY > 300 ? setShowButton(true) : setShowButton(false);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { showButton, onScrollToTop };
}
