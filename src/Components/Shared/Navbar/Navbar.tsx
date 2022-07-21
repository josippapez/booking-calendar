import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import isMobileView from '../../../checkForMobileView';
import useDarkMode from '../../../Hooks/useDarkMode';
import { logout } from '../../../store/firebaseActions/authActions';
import { persistor } from '../../../store/store';
import style from './Navbar.module.scss';

type Props = { userAuthenticated: boolean };

function Navbar(props: Props) {
  const { userAuthenticated } = props;
  const { t, i18n } = useTranslation();
  const darkmode = useDarkMode();
  const navigate = useNavigate();

  const [dropdownOpenned, setDropdownOpenned] = useState(false);
  const [displayLanguageDropdown, setDisplayLanguageDropdown] = useState(false);
  const component = useRef<HTMLDivElement | null>(null);
  const languageComponent = useRef<HTMLDivElement | null>(null);

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
      if (
        languageComponent.current &&
        !languageComponent.current.contains(event.target as Node)
      ) {
        setDisplayLanguageDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [component, languageComponent]);

  const languages = [
    { title: 'English', value: 'eng' },
    { title: 'Croatian', value: 'hr' },
  ];

  return (
    <>
      {userAuthenticated && (
        <nav
          ref={component}
          className={`page-container bg-neutral-100 border-gray-200 border-b-2 shadow-sm select-none ${
            isMobileView() ? 'px-4 py-2.5' : 'px-10 py-2.5'
          } rounded-b-md dark:bg-gray-800 relative`}
        >
          <div className='flex flex-wrap justify-between items-center'>
            <div className='flex gap-[20px]'>
              <span className='self-center text-xl font-semibold whitespace-nowrap dark:text-white'>
                {t('navbar_title')}
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
                      {t('apartments_link_name')}
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
            <div className='flex items-center md:order-2 drop-shadow-md'>
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
                {t('sign_out')}
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
          <div
            className='hidden md:hidden justify-between items-center w-full md:w-auto md:order-1 absolute px-4 py-2.5 bg-white z-10 left-0 top-[60px] drop-shadow-lg'
            id='mobile-menu-2'
          >
            <ul className='flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium gap-[10px]'>
              <li>
                <NavLink
                  to='/apartments'
                  className='block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                  aria-current='page'
                >
                  {t('apartments_link_name')}
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
                  {t('sign_out')}
                </button>
              </li>
            </ul>
          </div>
        </nav>
      )}
      <div className='fixed left-3 bottom-3 w-fit transition-colors h-auto z-40 select-none drop-shadow-md'>
        <div ref={languageComponent} className='relative flex-row-reverse flex'>
          <div
            className={`${style.translateButton} ${
              darkmode.enabled !== 'enabled' ? style.lightMode : style.darkMode
            } mt-3 rounded-full bg-neutral-200 relative`}
            onClick={() => setDisplayLanguageDropdown(!displayLanguageDropdown)}
          />
          <div className='relative' hidden={!displayLanguageDropdown}>
            <div className='w-fit p-3 rounded-md bg-white dark:bg-slate-800 text-zinc-900 dark:text-zinc-100 absolute bottom-0 left-11'>
              {languages.map(language => (
                <div
                  key={language.value}
                  className={`cursor-pointer px-1 py-[2px] rounded-md hover:dark:bg-slate-600 hover:bg-gray-200 ${
                    i18n.languages[0] === language.value &&
                    'bg-blue-500 text-white hover:bg-blue-500 hover:opacity-70'
                  }`}
                  onClick={() => {
                    i18n.changeLanguage(language.value);
                  }}
                >
                  {t(language.title)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
