import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import Apartments from './Calendar/Apartments/Apartments';
import LoginPage from './Calendar/LoginPage/LoginPage';
import PageLoader from './Shared/Loader/PageLoader';
import Navbar from './Shared/Navbar/Navbar';
const CalendarPage = lazy(() => import('./Calendar/Calendar'));

export const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const user = useAppSelector(state => state.user.user);

  useEffect(() => {
    if (user && !user.accessToken) {
      navigate('/');
    }
  }, [user]);

  useEffect(() => {
    if (user && user.accessToken) {
      if (
        window.location.pathname === '/' ||
        !['apartments'].includes(window.location.pathname.split('/')[1])
      ) {
        navigate('/apartments');
        return;
      }
    } else {
      if (window.location.pathname !== '/') {
        navigate('/');
      }
    }
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      {user.accessToken && <Navbar />}
      <div className='min-h-[calc(100vh_-_60px)] h-auto min-w-screen w-full bg-gray-100 p-10'>
        {user && user.accessToken ? (
          <Routes>
            <Route path='/' element={<Apartments />} />
            <Route path='/apartments' element={<Apartments />} />
            <Route path='/apartments/:id' element={<CalendarPage />} />
          </Routes>
        ) : (
          <Routes>
            <Route path='/' element={<LoginPage />} />
          </Routes>
        )}
      </div>
    </Suspense>
  );
};
