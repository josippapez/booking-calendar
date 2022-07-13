import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import isMobileView from '../../../checkForMobileView';
import { logout } from '../../../store/firebaseActions/authActions';
import { persistor } from '../../../store/store';

type Props = {};

function Navbar({}: Props) {
  const [dropdownOpenned, setDropdownOpenned] = useState(false);
  const component = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (dropdownOpenned) {
      document.getElementById('mobile-menu-2')?.classList.remove('hidden');
    } else {
      document.getElementById('mobile-menu-2')?.classList.add('hidden');
    }
  }, [dropdownOpenned]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        component.current &&
        !component.current.contains(event.target as Node)
      ) {
        setDropdownOpenned(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [component]);

  return (
    <nav
      ref={component}
      className={`page-container bg-white border-gray-200 ${
        isMobileView() ? 'px-4 py-2.5' : 'px-10 py-2.5'
      } rounded dark:bg-gray-800 relative`}
    >
      <div></div>
      <div className='flex flex-wrap justify-between items-center'>
        <div className='flex gap-[20px]'>
          <span className='self-center text-xl font-semibold whitespace-nowrap dark:text-white'>
            Booking Calendar
          </span>
          <div
            className='hidden justify-between items-center w-full md:flex md:w-auto md:order-1'
            id='mobile-menu-1'
          >
            <ul className='flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium'>
              <li>
                <NavLink
                  to='/apartments'
                  className='block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                  aria-current='page'
                >
                  Apartments
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div className='flex items-center md:order-2'>
          <button
            className='hidden md:block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-fit self-end'
            type='button'
            onClick={async () => {
              logout();
              await persistor.purge();
              await persistor.flush();
              navigate('/');
            }}
          >
            Sign out
          </button>
          <button
            data-collapse-toggle='mobile-menu-2'
            type='button'
            className='inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
            aria-controls='mobile-menu-2'
            aria-expanded='false'
            onClick={() => {
              setDropdownOpenned(!dropdownOpenned);
            }}
          >
            <span className='sr-only'>Open main menu</span>
            <svg
              className='w-6 h-6'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'></path>
            </svg>
            <svg
              className='hidden w-6 h-6'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'></path>
            </svg>
          </button>
        </div>
      </div>
      <div></div>
      <div
        className='hidden md:hidden justify-between items-center w-full md:w-auto md:order-1 absolute px-4 py-2.5 bg-white z-10 left-0 top-[60px] shadow-lg'
        id='mobile-menu-2'
      >
        <ul className='flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium gap-[10px]'>
          <li>
            <NavLink
              to='/apartments'
              className='block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
              aria-current='page'
            >
              Apartments
            </NavLink>
          </li>
          <li>
            <button
              className='w-full text-left py-2 pr-4 pl-3 text-white bg-blue-900 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
              type='button'
              onClick={async () => {
                logout();
                await persistor.purge();
                await persistor.flush();
                navigate('/');
              }}
            >
              Sign out
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;