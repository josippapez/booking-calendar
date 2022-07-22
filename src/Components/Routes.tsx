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

  const routes =
    user && user.accessToken ? (
      <Routes>
        <Route path='/apartments' element={<ApartmentsPage />} />
        <Route path='/apartments/:id' element={<CalendarPage />} />
        <Route path='/:id' element={<LandingPage />} />
      </Routes>
    ) : (
      <Routes>
        <Route path='/:id' element={<LandingPage />} />
        <Route path='/' element={<LoginPage />} />
      </Routes>
    );

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
  }, [user, navigate]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Navbar userAuthenticated={!!user.accessToken} />
      <div
        className={`${
          user.accessToken
            ? `${
                isMobileView() ? 'py-10 px-2.5' : 'page-container py-16 px-[5%]'
              }
               min-h-[calc(100%_-_60px)]`
            : 'min-h-full'
        } min-w-screen w-full overflow-x-hidden`}
      >
        {routes}
      </div>
    </Suspense>
  );
};
