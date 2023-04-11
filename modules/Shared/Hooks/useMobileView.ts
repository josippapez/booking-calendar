import { useCallback, useEffect, useState } from 'react';

export const useMobileView = (): boolean => {
  const [isMobileView, setIsMobileView] = useState(false);

  const handleResize = useCallback(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    setIsMobileView(userAgent.includes('Mobile') || window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobileView;
};
