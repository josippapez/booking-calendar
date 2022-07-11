import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import isMobileView from '../checkForMobileView';
import { useAppSelector } from '../store/hooks';
import PageLoader from './Shared/Loader/PageLoader';
import Navbar from './Shared/Navbar/Navbar';

const CalendarPage = lazy(() => import('./Calendar/Calendar'));
const ApartmentsPage = lazy(() => import('./Calendar/Apartments/Apartments'));
const LandingPage = lazy(() => import('./Home/LandingPage/PublicCalendar'));
const LoginPage = lazy(() => import('./LoginPage/LoginPage'));

export const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const user = useAppSelector(state => state.user.user);

  useEffect(() => {
    if (user && user.accessToken) {
      if (window.location.pathname === '/') {
        navigate('/apartments');
        return;
      }
    } else {
      if (['apartments'].includes(window.location.pathname.split('/')[1])) {
        navigate('/');
      }
    }
    const element = document.getElementById('root');
    if (isMobileView() && element !== null) {
      element.style.maxHeight = window.innerHeight + 'px';
      element.style.height = window.innerHeight + 'px';
    }
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      {user.accessToken && <Navbar />}
      <div
        className={`${
          user.accessToken ? 'min-h-[calc(100%_-_60px)]' : 'min-h-full'
        } min-w-screen w-full bg-gray-100`}
      >
        {user && user.accessToken ? (
          <Routes>
            <Route path='/:id' element={<LandingPage />} />
            <Route path='/apartments' element={<ApartmentsPage />} />
            <Route path='/apartments/:id' element={<CalendarPage />} />
          </Routes>
        ) : (
          <Routes>
            <Route path='/:id' element={<LandingPage />} />
            <Route path='/' element={<LoginPage />} />
          </Routes>
        )}
      </div>
    </Suspense>
  );
};
