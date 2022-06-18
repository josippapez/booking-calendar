import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import PageLoader from './Components/Shared/Loader/PageLoader';

const LandingPage = lazy(() => import('./Components/Calendar/Calendar'));

function App() {
  return (
    <div className='min-h-screen h-full min-w-full'>
      <Routes>
        <Route
          path='/'
          element={
            <Suspense fallback={<PageLoader />}>
              <LandingPage />
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
