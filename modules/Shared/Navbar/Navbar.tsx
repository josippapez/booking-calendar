import { logout } from '@/store/firebaseActions/authActions';
import { useCloseOnClickOutside } from '@modules/Shared/Hooks/useCloseOnClickOutside';
import { useDarkMode } from '@modules/Shared/Hooks/useDarkMode';
import { Routes } from 'consts';
import { Settings } from 'luxon';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from './Navbar.module.scss';
import { CalendarNavbarDropdown } from '@modules/Shared/Navbar/CalendarNavbarDropdown';

type Props = { userAuthenticated: boolean };

export function Navbar(props: Props) {
  const { userAuthenticated } = props;
  const { t, i18n } = useTranslation('Navbar');
  const darkmode = useDarkMode();
  const router = useRouter();

  const [dropdownOpenned, setDropdownOpenned] = useState(false);
  const [displayLanguageDropdown, setDisplayLanguageDropdown] = useState(false);
  const component = useRef<HTMLDivElement | null>(null);
  const languageComponent = useRef<HTMLDivElement | null>(null);

  useCloseOnClickOutside(component, () => setDropdownOpenned(false));
  useCloseOnClickOutside(languageComponent, () =>
    setDisplayLanguageDropdown(false)
  );

  useEffect(() => {
    if (dropdownOpenned) {
      document.getElementById('mobile-menu-2')?.classList.remove('hidden');
    } else {
      document.getElementById('mobile-menu-2')?.classList.add('hidden');
    }
  }, [dropdownOpenned]);

  const languages = [
    { title: 'English', value: 'en-US' },
    { title: 'Croatian', value: 'hr' },
  ];

  return (
    <>
      {userAuthenticated && (
        <nav
          ref={component}
          className={`page-container relative select-none border-b py-2.5 dark:bg-gray-800`}
        >
          <div className='flex flex-wrap items-center justify-between'>
            <div className='flex gap-[20px]'>
              <span className='self-center whitespace-nowrap text-xl font-semibold dark:text-white'>
                {t('navbar_title')}
              </span>
              <div
                className='hidden w-full items-center justify-between md:order-1 md:flex md:w-auto'
                id='mobile-menu-1'
              >
                <ul className='mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium'>
                  <li>
                    <Link
                      className='block rounded bg-blue-700 py-2 pl-3 pr-4 text-white dark:text-white md:bg-transparent md:p-0 md:text-blue-700'
                      href={Routes.APARTMENTS}
                    >
                      {t('apartments_link_name')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='block rounded bg-blue-700 py-2 pl-3 pr-4 text-white dark:text-white md:bg-transparent md:p-0 md:text-blue-700'
                      href={Routes.INVOICE}
                    >
                      {t('invoice_link_name')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='block rounded bg-blue-700 py-2 pl-3 pr-4 text-white dark:text-white md:bg-transparent md:p-0 md:text-blue-700'
                      href={Routes.GUESTS}
                    >
                      {t('guests_link_name')}
                    </Link>
                  </li>
                  <li>
                    <CalendarNavbarDropdown />
                  </li>
                </ul>
              </div>
            </div>
            <div className='flex items-center md:order-2'>
              <button
                className='focus:shadow-outline hidden w-fit self-end rounded bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-500 focus:outline-none md:block'
                type='button'
                onClick={async () => {
                  await logout();
                  await router.push(Routes.LOGIN);
                }}
              >
                {t('sign_out')}
              </button>
              <button
                data-collapse-toggle='mobile-menu-2'
                type='button'
                className='ml-1 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden'
                aria-controls='mobile-menu-2'
                aria-expanded='false'
                onClick={() => {
                  setDropdownOpenned(!dropdownOpenned);
                }}
              >
                <span className='sr-only'>Open main menu</span>
                <svg
                  className='h-6 w-6'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'></path>
                </svg>
                <svg
                  className='hidden h-6 w-6'
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
            className='full-bleed absolute left-0 top-[63px] z-10 hidden w-full items-center justify-between bg-white px-4 py-2.5 drop-shadow-lg md:order-1 md:hidden md:w-auto'
            id='mobile-menu-2'
          >
            <ul className='mt-4 flex flex-col gap-[10px] md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium'>
              <li>
                <Link
                  className='block rounded bg-blue-700 py-2 pl-3 pr-4 text-white hover:bg-blue-500 dark:text-white md:bg-transparent md:p-0 md:text-blue-700'
                  href='/apartments'
                >
                  {t('apartments_link_name')}
                </Link>
              </li>
              <li>
                <Link
                  className='block rounded bg-blue-700 py-2 pl-3 pr-4 text-white hover:bg-blue-500 dark:text-white md:bg-transparent md:p-0 md:text-blue-700'
                  href='/invoice'
                >
                  {t('invoice_link_name')}
                </Link>
              </li>
              <li>
                <Link
                  className='block rounded bg-blue-700 py-2 pl-3 pr-4 text-white hover:bg-blue-500 dark:text-white md:bg-transparent md:p-0 md:text-blue-700'
                  href='/guests'
                >
                  {t('guests_link_name')}
                </Link>
              </li>
              <li>
                <button
                  className='w-full rounded bg-blue-900 py-2 pl-3 pr-4 text-left text-white dark:text-white md:bg-transparent md:p-0 md:text-blue-700'
                  type='button'
                  onClick={async () => {
                    await logout();
                    await router.push(Routes.LOGIN);
                  }}
                >
                  {t('sign_out')}
                </button>
              </li>
            </ul>
          </div>
        </nav>
      )}
      <div className='fixed bottom-3 left-3 z-40 h-auto w-fit select-none drop-shadow-md transition-colors'>
        <div ref={languageComponent} className='relative flex flex-row-reverse'>
          <div
            className={`${style.translateButton} ${
              darkmode.enabled !== 'enabled' ? style.lightMode : style.darkMode
            } relative mt-3 rounded-full bg-neutral-200`}
            onClick={() => setDisplayLanguageDropdown(!displayLanguageDropdown)}
          />
          <div className='relative' hidden={!displayLanguageDropdown}>
            <div className='absolute bottom-0 left-11 w-fit rounded-md bg-white p-3 text-zinc-900 dark:bg-slate-800 dark:text-zinc-100'>
              {languages.map(language => (
                <div
                  key={language.value}
                  className={`cursor-pointer rounded-md px-1 py-[2px] hover:bg-gray-200 hover:dark:bg-slate-600 ${
                    i18n.language === language.value &&
                    'bg-blue-500 text-white hover:bg-blue-500 hover:opacity-70'
                  }`}
                  onClick={() => {
                    i18n.changeLanguage(language.value);
                    Settings.defaultLocale = language.value;
                    localStorage.setItem('i18nextLng', language.value);
                  }}
                >
                  {t(language.title, { ns: 'Languages' })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
