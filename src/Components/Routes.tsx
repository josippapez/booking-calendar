import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import Apartments from './Calendar/Apartments/Apartments';
import LoginPage from './Calendar/LoginPage/LoginPage';
import PageLoader from './Shared/Loader/PageLoader';
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

  return user && user.accessToken ? (
    <Routes>
      <Route
        path='/'
        element={
          <Suspense fallback={<PageLoader />}>
            <Apartments />
          </Suspense>
        }
      />
      <Route
        path='/apartments'
        element={
          <Suspense fallback={<PageLoader />}>
            <Apartments />
          </Suspense>
        }
      />
      <Route
        path='/apartments/:id'
        element={
          <Suspense fallback={<PageLoader />}>
            <CalendarPage />
          </Suspense>
        }
      />
    </Routes>
  ) : (
    <Routes>
      <Route
        path='/'
        element={
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        }
      />
    </Routes>
  );
};
